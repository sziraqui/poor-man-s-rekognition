/**
 * Bridges AI implementation of Face Detection and the server
 * Currently, I have used node-facenet which is a nodejs wrapper for Tensorflow implementation of
 * popular FaceNet architecture in Python. We can also implement Facenet in Tensorflow.js
 * to improve performance.
 * 
 * This module ensures the server code is independent of AI implementations of Face Detection
 * References to third-party AI models can appear here
 */

import * as path from "path";
import * as nj from "numjs";
import * as faceApi from "face-api.js";
import { FaceDetector, FaceVerifier } from "../ai-interface";
import { CBoundingBox, CComparedFace, CFaceDetail, CFaceMatch, CComparedSourceImage } from "../utils/amazon-rekog-dtypes";
import { DetectFacesResponse, CompareFacesResponse } from "../utils/service-syntax";
import { MtcnnOptions, IFaceDetecion, Rect } from "face-api.js";
import { Rectangle } from "../utils/helper-dtypes";


/**
 * Performs face detection using Facenet
 */
export class FaceDetection implements FaceDetector {

    
    private static instance: FaceDetection;
    private static notInitialised: boolean = true;
    private constructor(){
    }
    
    public static async getInstance() {
        if (this.notInitialised) {
            this.instance = new FaceDetection();
            const weightsPath = path.resolve(path.join(__dirname, '..', '..', 'weights'));
            await faceApi.nets.mtcnn.loadFromDisk(weightsPath);
            this.notInitialised = false;
            return this.instance;
        }
        return this.instance;
    }
    /**
     * Find bounding box of all faces present in image
     * @param image any image that may contain face(s) 
     */
    async detectFaces(image): Promise<DetectFacesResponse> {
        let faces = await faceApi.detectAllFaces(image, new MtcnnOptions());
        let faceDetails: CFaceDetail[] = new Array<CFaceDetail>(faces.length);
        faces.forEach((face, index) => { 
            faceDetails[index] = new CFaceDetail(new CBoundingBox(new Rectangle(face.box.x, face.box.y, face.box.width, face.box.height), image.width, image.height), face.score);
        });
        const response: DetectFacesResponse = new DetectFacesResponse(faceDetails, "ROTATE_0");
        return response;
    }
}

/**
 * Performs Face verification
 */
export class FaceVerification implements FaceVerifier {
    
    private static instance: FaceVerification;
    private static notInitialised: boolean = true;

    public static readonly DISTANCE_THRESHOLD: number = 1.1;

    private constructor(){}
    
    public static async getInstance() {
        if (this.notInitialised) {
            this.instance = new FaceVerification();
            FaceDetection.getInstance(); // load faceApi's detection net if not loaded previously
            const weightsPath = path.resolve(path.join(__dirname, '..', '..', 'weights'));
            await faceApi.nets.faceLandmark68Net.loadFromDisk(weightsPath);
            await faceApi.nets.faceRecognitionNet.loadFromDisk(weightsPath);
            this.notInitialised = false;
            return this.instance;
        }
        return this.instance;
    }

    private async findLargestFace(image) {
        return await faceApi.detectSingleFace(image, new MtcnnOptions()).withFaceLandmarks().withFaceDescriptor();
    }
    /**
     * @implements FaceVerifier.similarity()
     */
    public async similarity(image1: ImageData, image2: ImageData, threshold: number): Promise<number> {
        let faces = await Promise.all([
            this.findLargestFace(image1), 
            this.findLargestFace(image2)
        ]);
        let distance: number;
        let faceMatcher = new faceApi.FaceMatcher(faces[0]);
        distance = faceMatcher.findBestMatch(faces[1].descriptor).distance;
        return this.confidence(distance, threshold);
    }
    
    private async findAllfaces(image) {
        let faces = await faceApi.detectAllFaces(image, new MtcnnOptions).withFaceLandmarks().withFaceDescriptors();
        return faces;
    }

    /**
     * @implements FaceVerifier.similarityMulti()
     */
    public async compareFaces(source, target, similarityThreshold: number): Promise<CompareFacesResponse> {
        const output = await Promise.all([
            this.findLargestFace(source), 
            this.findAllfaces(target)
        ]);
        let sourceFace = output[0];
        let targetFaces = output[1];
        let faceMatcher = new faceApi.FaceMatcher(sourceFace, FaceVerification.DISTANCE_THRESHOLD);
        let distances = new Array<number>(targetFaces.length)
        targetFaces.forEach((fd, i) => {
            let faceMatch = faceMatcher.findBestMatch(fd.descriptor);
            distances[i] = faceMatch.distance;
        });
        
        let similarities:number[] = new Array<number>(distances.length);
        for (let i in distances) {
            similarities[i] = this.confidence(distances[i], FaceVerification.DISTANCE_THRESHOLD);
        }
        similarityThreshold/=100;
        let faceMatches: CFaceMatch[] = Array<CFaceMatch>();
        let unmatchedFaces: CComparedFace[] = Array<CComparedFace>();

        targetFaces.forEach((face, i) => {

            const bbox = face.detection.box;
            const rect = new Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
            const confidence = face.detection.score;
            const imgW = face.detection.imageDims.width;
            const imgH = face.detection.imageDims.height;
            let comparedFace = new CComparedFace(new CBoundingBox(rect, imgW, imgH), confidence);

            if (similarities[i] >= similarityThreshold) {
                let faceMatch = new CFaceMatch(comparedFace, similarities[i]);
                faceMatches.push(faceMatch);
            } else {
                unmatchedFaces.push(comparedFace);
            }
        });
        
        faceMatches.sort((a, b) => b.Similarity - a.Similarity);
        unmatchedFaces.sort((a, b) => b.Confidence - a.Confidence);
        const bbox = sourceFace.detection.box;
        const rect = new Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
        const confidence = sourceFace.detection.score;
        const imgW = sourceFace.detection.imageDims.width;
        const imgH = sourceFace.detection.imageDims.height;
        const response: CompareFacesResponse = new CompareFacesResponse(
            faceMatches,
            new CComparedSourceImage(new CBoundingBox(rect, imgW, imgH), confidence),
            "ROTATE_0",
            "ROTATE_0",
            unmatchedFaces
        );
        return response;
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

