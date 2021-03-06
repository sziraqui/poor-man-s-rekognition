import * as cv from "opencv4nodejs";
import { matToHtmlImage } from "./imageio";

export class VideoStream {

    private cap: cv.VideoCapture;
    public fps: number;
    public size: cv.Size
    private open: boolean;
   
    constructor(size:cv.Size, source?: string) {
        if(!source) this.cap = new cv.VideoCapture(0);
        else this.cap = new cv.VideoCapture(source);
        this.fps = this.cap.get(cv.CAP_PROP_FPS);
        this.open = true;
        this.size = size;
    }

    public nextFrame(): cv.Mat {
        let frame = new cv.Mat();
        let retry = 5;
        while(frame.empty && retry > 0) {
            frame = this.cap.read();
            retry--;
        }
        if(frame.empty) {
            frame = new cv.Mat(this.size.width, this.size.height, 0);
            this.cap.release();
            this.open = false;
        }
        try{
            frame = frame.resize(this.size);
        } catch(err) {
            console.log(err.message);
        }
        return frame;
    }

    public nextHtmlImage() {
        let frame = this.nextFrame();
        return matToHtmlImage(frame);
    }

    public isOpen() {
       return this.open;
    }
}