import { CBoundingBox, CFaceDetail, CFaceMatch, CComparedFace } from "./amazon-rekog-dtypes";
import * as cv from "opencv4nodejs";
import { Point2 } from "opencv4nodejs";

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
        const w = bbox.Width*parentWidth;
        const h = bbox.Height*parentHeight;

        return new Rectangle(
            Math.round(bbox.Left*w), 
            Math.round(bbox.Top*h), 
            Math.round(w), 
            Math.round(h)
        );
    }
}

export class FaceBlob {
    id: number;
    image: cv.Mat;
    rect: cv.Rect;
    confidence: number;
    matches: string;
    similarity: number;

    constructor(image: cv.Mat, face: CFaceDetail | CFaceMatch | CComparedFace) {
        this.image = image;
        let faceDetail: CFaceDetail;
        if(face instanceof CFaceDetail || face instanceof CComparedFace) {
            faceDetail = face;
        } else if(face instanceof CFaceMatch) {
            faceDetail = face.Face;
        }

        let rect = faceDetail.BoundingBox.toRect(image.cols, image.rows);
        this.rect = new cv.Rect(rect.x, rect.y, rect.w, rect.h);
        this.confidence = faceDetail.Confidence;
    }

    setMatch(name: string, similarity, number) {
        this.matches = name;
        this.similarity = similarity;
    }

    addAnnotation(color: cv.Vec3, padding:number) {
        this.image.drawRectangle(this.rect, color);
        let text = `[${this.id}]`
        if (this.matches) {
            text += `\n${this.matches}(${this.similarity}%)`;
        }
        this.image.putText(text, new Point2(padding, padding), cv.FONT_HERSHEY_SIMPLEX, 1, color);
    }
}