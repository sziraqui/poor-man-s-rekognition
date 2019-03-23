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
import { CBoundingBox, CComparedFace, CFaceDetail } from "../utils/amazon-rekog-dtypes";
import { DetectFacesResponse } from "../utils/service-syntax";

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
     * @param image any image that may contain face(s) 
     */
    async detectFaces(image: ImageData): Promise<DetectFacesResponse> {
        let faces = await this.facenet.align(image);
        let faceDetails: CFaceDetail[] = new Array<CFaceDetail>(faces.length);
        faces.forEach((face, index) => { 
            faceDetails[index] = new CFaceDetail(new CBoundingBox(face.location, face.width, face.height), face.confidence);
        });
        const response: DetectFacesResponse = new DetectFacesResponse(faceDetails, "ROTATE_0");
        return response;
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
     * @implements FaceVerifier.similarity()
     */
    public async similarity(image1: ImageData, image2: ImageData, threshold: number): Promise<number> {
        let faces = await Promise.all([
            this.findLargestFace(image1), 
            this.findLargestFace(image2)
        ]);
        let distance: number = faces[0].distance(faces[1]);
        
        return this.confidence(distance, threshold);
    }
    
    private async findAllfaces(image: ImageData): Promise<Face[]> {
        let faces:Face[] = await this.facenet.align(image);
        
        for (let i in faces) {
            faces[i].embedding = await this.facenet.embedding(faces[i]);
            console.log(`findAllfaces:[${i}]embedding ${faces[i].confidence}:${faces[i].embedding}`);
        }
        return faces;
    }

    /**
     * @implements FaceVerifier.similarityMulti()
     */
    public async similarityMulti(source: ImageData, target: ImageData, threshold: number): Promise<CComparedFace[]> {
        const output = await Promise.all([
            this.findLargestFace(source), 
            this.findAllfaces(target)
        ]);
        let sourceFace: Face = output[0];
        let targetFaces: Face[] = output[1];
        let distances: number[] = this.facenet.distance(sourceFace, targetFaces);
        let confidences:number[] = new Array<number>(distances.length);
        distances.forEach((d, i) => {
            confidences[i] = this.confidence(d, threshold);
        });
        let comparedFaces = new Array<CComparedFace>(targetFaces.length);
        targetFaces.forEach((face, i) => {
            comparedFaces[i] = new CComparedFace(
                new CBoundingBox(face.location, target.width, target.height),
                confidences[i]
            )
        });
        return comparedFaces;
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
