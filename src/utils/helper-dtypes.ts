import { CBoundingBox } from "./amazon-rekog-dtypes";

export class Rectangle {
    x: number /**Top left x */
    y: number /** Top left y */
    w: number
    h: number
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }  
    
    public static fromBoundingBox(bbox: CBoundingBox, parentWidth: number, parentHeight: number) {
        const w = bbox.Width/parentWidth;
        const h = bbox.Height/parentHeight;

        return new Rectangle(
            Math.round(bbox.Left/w), 
            Math.round(bbox.Top/h), 
            Math.round(w), 
            Math.round(h)
        );
    }
}