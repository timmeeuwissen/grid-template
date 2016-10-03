import IGridValidityCallback from './i_grid_validity_callback'

interface IGridItem {
  icon: string,
  title: string,
  classes?: string[],
  callbacks?: {
    validity?: IGridValidityCallback[]
  },
  dim?: {
    x: number,
    y: number
  },
  pos?: {
    x: number,
    y: number
  },
  
  // used for internal state:
  _rendered: boolean,
  _immutable: boolean
}

export default IGridItem;
