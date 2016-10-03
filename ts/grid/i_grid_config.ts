import IGridItem from './i_grid_item'

interface IGridConfig {
  minItemWidth: number,
  maxItemsOnLine: number,
  items: IGridItem[]
};

export default IGridConfig;
