import * as cv from "opencv4nodejs";
import { matToHtmlImage } from "./imageio";

export class VideoStream {

    private cap: cv.VideoCapture;
    public fps: number;
    constructor(sourcePath: string) {
        this.cap = new cv.VideoCapture(sourcePath);
        this.fps = this.cap.get(cv.CAP_PROP_FPS);
    }

    public nextFrame(): cv.Mat {
        return this.cap.read();
    }

    public nextHtmlImage() {
        let frame = this.nextFrame();
        if (frame) {
            return matToHtmlImage(frame);
        }
        this.cap.release();
        this.cap = undefined;
        return new cv.Mat();
    }

    public isOpen() {
       if (this.cap) return true;
       else return false;
    }
}