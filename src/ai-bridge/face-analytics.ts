/**
 * Bridges AI implementation of Face Detection and the server
 * Currently, I have used node-facenet which is a nodejs wrapper for Tensorflow implementation of
 * popular FaceNet architecture in Python. We can also implement Facenet in Tensorflow.js
 * to improve performance.
 * 
 * This module ensures the server code is independent of AI implementations of Face Detection
 * References to third-party AI models can appear here
 */
import { Facenet, Face } from "facenet";
import { FaceDetector } from "../ai-interface";
import { BoundingBox } from "../common";

/**
 * Facenet Singleton to ensure only one instance of Facenet is present
 * This is crucial because Facenet takes 15-100 seconds to initialise
 */
export class FacenetModel {
    private static facenet: Facenet;
    private static notInitialised: boolean = true;
    private constructor() {}

    public static async getInstance() {
        if (this.notInitialised) {
           this.facenet = new Facenet();
            await this.facenet.init();
            this.notInitialised = false;
            return this.facenet;
        }
        return this.facenet;
    }
}

/**
 * Performs face detection using Facenet
 */
export class FaceDetection implements FaceDetector {

    private facenet: Facenet;
    private static instance: FaceDetection;
    private static notInitialised: boolean = true;
    private constructor(){
    }
    
    public static async getInstance() {
        if (this.notInitialised) {
            this.instance = new FaceDetection();
            this.instance.facenet = await FacenetModel.getInstance();
            this.notInitialised = false;
            return this.instance;
        }
        return this.instance;
    }
    /**
     * Find bounding box of all faces present in image
     * @param image any image that may contain a face
     * @returns Promise<BoundingBox[]>
     */
    async detectAll(image: ImageData) {
        let faces = await this.facenet.align(image);
        let bboxList: BoundingBox[] = new Array<BoundingBox>(faces.length);
        faces.forEach((face, index) => { 
            bboxList[index] = new BoundingBox(face.location.x, face.location.y, face.location.w, face.location.h);
        });
        return bboxList;
    }
}

