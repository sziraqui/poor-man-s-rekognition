/**
 * Bridges AI implementation of Face Detection and the server
 * Currently, I have used node-facenet which is a nodejs wrapper for Tensorflow implementation of
 * popular FaceNet architecture in Python. We can also implement Facenet in Tensorflow.js
 * to improve performance.
 * 
 * This module ensures the server code is independent of AI implementations of Face Detection
 * References to third-party AI models can appear here
 */
import * as nj from "numjs";
import { Facenet, Face } from "facenet";
import { FaceDetector, FaceVerifier } from "../ai-interface";
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

/**
 * Performs Face verification
 */
export class FaceVerification implements FaceVerifier {
    private facenet: Facenet;
    private static instance: FaceVerification;
    private static notInitialised: boolean = true;
    private constructor(){}
    
    public static async getInstance() {
        if (this.notInitialised) {
            this.instance = new FaceVerification();
            this.instance.facenet = await FacenetModel.getInstance();
            this.notInitialised = false;
            return this.instance;
        }
        return this.instance;
    }

    private async findLargestFace(image: ImageData) {
        let faces = await this.facenet.align(image);
        
        let largestIndex = 0;
        let maxArea = faces[0].location.w * faces[0].location.h;
        faces.forEach((face, index) => {
            let area = face.location.w * face.location.h;
            if (area > maxArea) {
                maxArea = area;
                largestIndex = index;
            }
        });
        faces[largestIndex].embedding = await this.facenet.embedding(faces[largestIndex]);
        return faces[largestIndex];
    }
    /**
     * Find probability that largest face in image1 and image2 are similar
     * @param image1 
     * @param image2 
     * @param threshold 
     */
    public async similarity(image1: ImageData, image2: ImageData, threshold: number): Promise<number> {
        let faces = await Promise.all([
            this.findLargestFace(image1), 
            this.findLargestFace(image2)
        ]);
        let distance: number = faces[0].distance(faces[1]);
        console.log('distance', distance);
        return this.confidence(distance, threshold);
    }

    /**
     * Convert distance into a probabilitic measure
     * @param distance 
     * @param threshold a threshold to give 0.5 confidence when distance == threshold
     */
    private confidence(distance: number, threshold: number): number {
        if (distance == 0) {
            return 1;
        }
        return 1 - nj.sigmoid(distance - threshold, 7).tolist()[0];
    }
}
