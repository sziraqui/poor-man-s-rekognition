/**
 * Interfaces that must be implemented in ai-bridge module
 * These interfaces will be in the web service
 * References to third-party libraries must not appear here
 */

import { BoundingBox } from './common';

export interface FaceDetector {
    /**
     * @function detectAll
     * @param image Image as ndarray
     */
    detectAll(image: ImageData): Promise<BoundingBox[]>
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
 }