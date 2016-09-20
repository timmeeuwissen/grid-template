interface Item {
  icon: string,
  title: string,
  classes?: string[],
  dim?: {
    x: number,
    y: number
  },
  pos?: {
    x: number,
    y: number
  }
}

export default Item;
