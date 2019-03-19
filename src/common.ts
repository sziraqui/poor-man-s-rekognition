 /**
  * A rectangular bounding box over a detected object
  */
class BoundingBox {
    x: number /** Top left x coordinate */
    y: number /** Top left y coordinate */
    w: number /** width */
    h: number /** height */

    constructor(topLeftX: number, topLeftY: number, width: number, height:number) {
        this.x = topLeftX;
        this.y = topLeftY;
        this.w = width;
        this.h = height;
    }
}

export { BoundingBox }