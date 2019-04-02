import * as cv from "opencv4nodejs";
export const loadImage = require('../ai-bridge/env').canvas.loadImage;


export function matToBase64(frame: cv.Mat): string {
    return cv.imencode('.jpg', frame).toString('base64');
}

export function base64ToHtmlImage(base64Img: string) {
    const dataUrl = 'data:image/jpeg;base64' + base64Img;
    return loadImage(dataUrl);
}

export function matToHtmlImage(frame: cv.Mat) {
    return base64ToHtmlImage(matToBase64(frame));
}

