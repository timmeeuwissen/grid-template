import * as _ from 'lodash'
import * as $ from 'jquery'
import IGridItem from './i_grid_item'
import IGridValidityCallback from './i_grid_validity_callback'

// todo : only restricitve behaviour is in x axis and should also be applied for y axis
export default class GridRenderer {

  private template:_.TemplateExecutor;
  private items:IGridItem[];
  private $elem:JQuery;
  private virtGrid: IGridItem[][][] = [];
  private dimX: number = 0;

  public static SUBQUERY_TEMPLATE:string = '[data-grid-template=item]';

  constructor(
    elem:Element
  ){
    this.$elem = $(elem);
    this.template = _.template(this.$elem.children(GridRenderer.SUBQUERY_TEMPLATE).html());
  }

  public add_item(item:IGridItem) {
    this.items.push(item);
  }

  /**
   * Sorts items to be rendered
   * 
   * Sometimes not all items can be rendered, we want to process them in 
   * a certain way. Currently we prioritize the items by how near they
   * are to the horizontal border (because of apparent visual breaking
   * of UX logic), positioned elements and size.
   */
  private helper_sort_items(a: IGridItem, b: IGridItem): number {
    // give priority to positioned items
    if (a.pos && !b.pos) {
      return -1;
    }
    else if (!a.pos && b.pos){
      return +1;
    }
    
    // between positioned elements, prioritize those positions on the edges
    if (a.pos && b.pos) {
      if (Math.abs(a.pos.x) < Math.abs(b.pos.x)) {
        return -1;
      }
      else if (Math.abs(a.pos.x) > Math.abs(b.pos.x)) {
        return +1;
      }
    }
    
    // if any is left, try to fit the biggest ones first
    let dimA = ((a.dim.x || 1) * (a.dim.y || 1)),
        dimB = ((b.dim.x || 1) * (b.dim.y || 1));
        
    if (dimA < dimB) {
      return -1;
    }
    else if (dimA > dimB) {
      return +1;
    }
    
    return 0;
  }
  
  /**
   * Ensures that there is always one item on a grid position
   * 
   * applies chain of responsibility, and if equal in chain picks 
   * the first one (determined by sorting function earlier in the process)
   */
  private helper_filter_items(itemsOnPosition: IGridItem[]): IGridItem | void {
    var self = this,
        itemsLeft: IGridItem[] = [];
    
    // if this item is an immutable item (probably because it was decided that
    // this items should be shown in another step (e.g. this is PART of another item))
    var immutableItem: IGridItem = null;
    itemsOnPosition.forEach(function(item){
      if (item._immutable) {
        immutableItem = item;
      }
    });
    
    if(immutableItem) {
      return immutableItem;
    }
    
    // otherwise assess the items on this position
    itemsOnPosition.forEach((item: IGridItem) => {
      var chain: IGridValidityCallback[] = [];
      if (item.callbacks.validity) {
        chain = item.callbacks.validity;
      }
      
      // make sure that the total width doesn't exceed the griddimensions
      chain.push(function(item: IGridItem, overlappingItems: IGridItem[]) {
        if (item.pos && item.dim) {
          if ((item.pos.x + item.dim.x - 1) > self.dimX) {
            return false;
          }
        }
        return true;
      })
      
      var valid = true;
      // todo : notice that each item also receives other items that might
      //        already have been invalidated. Hen / egg problem
      chain.forEach(function(cb: IGridValidityCallback){
        valid = cb(item, itemsOnPosition);
        // todo : break when invalidated
      });
      
      if (valid) {
        itemsLeft.push(item);
      } 
    });
    
    if (itemsLeft.length) {
      return itemsLeft[0]; 
    }
    
    return null;
  }
  
  /**
   * occupies the virtual grid with an item
   * 
   * notice that pos and dim are detached from the config here. 
   * this is because we at this point want to have the freedom 
   * to position an item wherever we want. e.g. some items have no
   * predefined position, but we want to have them in a certain 
   * spot anyways
   */
  private occupy_grid(
    item: IGridItem, 
    posX: number,
    posY: number,
    dimX: number = 1,
    dimY: number = 1) {
    
    // cover the situation that something should be positioned 
    // at the end of a row
    if (posX < 0) {
      posX = this.dimX - posX;
    }
    
    // first adapt the gridsize to accomodate the item
    while(this.virtGrid.length < posY + dimY) {
      this.virtGrid.push(new Array(this.dimX));
    }
    
    // then let the item occupy all positions
    for(var iCol = 1; iCol <= dimX; iCol++) {
      for(var iRow = 1; iRow <= dimX; iRow++) {
        this.virtGrid[posY + iRow - 1][posX + iCol - 1].push(
          item
        )
      }
    }
  }
  
  public render(xDim:number) {
    var self = this,
      iRendered:number = 0,
      iRow:number = 0,
      iCol:number = 0,
      fillerItems: IGridItem[] = [];
    
    this.dimX = xDim;
    
    // reset the internal grid state
    this.virtGrid = [];
    
    // first sort all items and put them on the grid
    this.items
      .sort(this.helper_sort_items)
      .forEach(function(item: IGridItem){
      
      // todo : randomize positions of filler items with dimensions
      
      // skip all filler items, we will use them later to fill when we start
      // to write to the domtree. 
      if(!item.pos && !item.dim) {
        fillerItems.push(item);
        return;
      }
      
      self.occupy_grid(
        item,
        item.pos.x,
        item.pos.y,
        item.dim.x,
        item.dim.y
      );
      
    });
    
    
    
    // apply fillers to spots that are empty
    // todo : cap amount of generated rows if needed
    
    // write to the domtree
    this.virtGrid.forEach(function(gridRow: IGridItem[][]) {
      gridRow.forEach(function(items: IGridItem[]) {
        
        // at this moment some items will overlap.
        // make sure each position carries only one item
        
        let positionedItem: IGridItem | void = self.helper_filter_items(items),
          item: IGridItem;
        if (positionedItem) {
          item = <IGridItem>positionedItem;
        }
        else if (fillerItems.length){
          item = fillerItems.shift();
        }
        else {
          console.error('Not enough filler items!');
        }
        
        // no going back now, this item is what will be taking the spot
        item._immutable = true;
        
        // multi dimensional items should be rendered once, but occupy many 
        if (!item._rendered) {
          var renderedItem:string = this.template(item);
          this.$elem.append(renderedItem);
          
          item._rendered = true;
        } 
        
      }); 
    }) 

  }

}
