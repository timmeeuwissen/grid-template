import * as _ from 'lodash'
import * as $ from 'jquery'
import Item from './config/item'

export default class GridRenderer {

  private template:_.TemplateExecutor;
  private items:Item[];
  private $elem:JQuery;

  public static SUBQUERY_TEMPLATE:string = '[data-grid-template=item]';

  constructor(
    elem:Element
  ){
    this.$elem = $(elem);
    this.template = _.template(this.$elem.children(GridRenderer.SUBQUERY_TEMPLATE).html());
  }

  public add_item(item:Item) {
    this.items.push(item);
  }

  public render(xDim:number) {
    var iRendered:number = 0,
      iRow:number = 0,
      iCol:number = 0;

    this.items.forEach(function(index, item){
      var renderedItem:string = this.template(item);
      this.$elem.append(renderedItem);
      iRendered += 1;
      if (!(iRendered % xDim)) {
        iRow += 1;
      }
      iCol = iRendered % xDim;
    });

    // backfill with random until square
    if (this.items.length){
      while(iRendered % xDim) {
        var rndItem:Item = this.items[Math.floor(Math.random() * this.items.length)],
          renderedItem:string = this.template();

        this.$elem.append(renderedItem);

        iRendered += 1;
      }
    }
  }

}
