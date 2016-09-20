import GridConfig from "./config"
import GridRenderer from "./renderer"

export default class GridController {

  public static ATTR_DIM_X:string = 'data-grid-dim-x';
  public static ATTR_DIM_Y:string = 'data-grid-dim-y';

  private height:number = 0;
  private width:number = 0;
  private itemsOnLine:number = 0;
  private renderer:GridRenderer;

  constructor(
    private window: Window,
    private elem: Element,
    private config: GridConfig) {

    this.renderer = new GridRenderer(this.elem);
    this.update();
    this.observe();
  }

  public observe(){
    this.window.addEventListener('resize', this.monitorResizes);
  }

  private monitorResizes(evt: Event) {
    this.update();
  }

  private updateSizes(){
    var newWidth = this.elem.clientWidth,
      newHeight = this.elem.clientHeight;

    if ((this.width == newWidth) && (this.height == newHeight)) {
      return false;
    }

    this.width = newWidth;
    this.height = newHeight;

    return true;
  }

  private updateItemsOnLine(){
    var expected = Math.floor(this.width / this.config.minItemWidth);
    if (expected == this.itemsOnLine) {
      return false;
    }

    this.elem.setAttribute(GridController.ATTR_DIM_X, String(expected));
    this.itemsOnLine = expected;

    return true;
  }

  private update(){
    if (!this.updateSizes() || !this.updateItemsOnLine()) {
      return false;
    }

    return true;
  }

}
