import { Rectangle } from './helper-dtypes';
/**
 * All datatypes defined as per Amazon Rekognition Data Types (https://docs.aws.amazon.com/rekognition/latest/dg/API_Types.html)
 * Class member names intentionally in SentenceCase instead of camelCase for convenience in rendering json response
 * Class names start with C so that they dont conflict with member names
 */
export class CPoint {
    X: number
    Y: number
}

/**
 * A rectangular bounding box over a detected object
 */
export class CBoundingBox {
    Left: number /** Top left x coordinate ratio*/
    Top: number /** Top left y coordinate ratio */
    Width: number /** width ratio */
    Height: number /** height ratio */

    constructor(rect: Rectangle, parentWidth: number, parentHeight: number) {
        /** See https://docs.aws.amazon.com/rekognition/latest/dg/API_BoundingBox.html  */
        this.Left = rect.x/rect.w;
        this.Top = rect.y/rect.h;
        this.Width = rect.w/parentWidth;
        this.Height = rect.h/parentHeight;
    }

    toRect(parentWidth, parentHeight): Rectangle {
        const w = this.Width*parentWidth;
        const h = this.Height*parentHeight;

        return new Rectangle(
            Math.round(this.Left*w), 
            Math.round(this.Top*h), 
            Math.round(w), 
            Math.round(h)
        );
    }
}

export class CComparedFace {
    BoundingBox: CBoundingBox
    Confidence: number
    constructor(faceBbox: CBoundingBox, confidence) {
        this.BoundingBox = faceBbox;
        this.Confidence = confidence;
    }
}

export class CComparedSourceImage {
    BoundingBox: CBoundingBox
    Confidence: number
    constructor(faceBbox: CBoundingBox, confidence) {
        this.BoundingBox = faceBbox;
        this.Confidence = confidence;
    }
}

export class CFaceDetail {
    BoundingBox: CBoundingBox
    Confidence: number
    constructor(faceBbox: CBoundingBox, confidence) {
        this.BoundingBox = faceBbox;
        this.Confidence = confidence;
    }
}

export class CFaceMatch {
    Face: CComparedFace
    Similarity: number

    constructor(faceDetail: CComparedFace, similarity: number) {
        this.Face = faceDetail;
        this.Similarity = similarity;
    }
}
