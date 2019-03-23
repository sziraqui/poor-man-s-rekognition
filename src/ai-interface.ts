/**
 * Interfaces that must be implemented in ai-bridge module
 * These interfaces will be in the web service
 * References to third-party libraries must not appear here
 */

import { CBoundingBox, CComparedFace, CFaceDetail } from './utils/amazon-rekog-dtypes';
import { DetectFacesResponse } from './utils/service-syntax';

export interface FaceDetector {
    /**
     * @function detectAll
     * @param image Image as ndarray
     */
    detectFaces(image: ImageData): Promise<DetectFacesResponse>
 }

 export interface FaceVerifier {
     /**
      * Numerically find similarity between two faces
      * @param face1 ImageData of aligned face
      * @param face2 ImageData of aligned face
      * @param theshold similarity threshold
      * @returns float between [0,1] indicating similarity between two faces
      */
     similarity(face1: ImageData, face2: ImageData, threshold: number): Promise<number>

     /**
      * Compare largest face in source with all faces in target
      * @param source image containing source face
      * @param target image containing target faces
      * @param threshold similarity threshold [0,1] 
      */
     similarityMulti(source: ImageData, target: ImageData, threshold: number): Promise<CComparedFace[]>
 }