import IGridItem from './i_grid_item';

// todo : determine the arguments that a callback would need in order to
//        determine its validity.
interface IGridValidityCallback {
  (
    itemConfig: IGridItem,
    overlappingItems: IGridItem[]
  ): boolean;
}

export default IGridValidityCallback;
