 /**
  * A rectangular bounding box over a detected object
  */
class BoundingBox {
    Left: number /** Top left x coordinate */
    Top: number /** Top left y coordinate */
    Width: number /** width */
    Height: number /** height */

    constructor(topLeftX: number, topLeftY: number, width: number, height:number) {
        this.Left = topLeftX;
        this.Top = topLeftY;
        this.Width = width;
        this.Height = height;
    }
}

export { BoundingBox }