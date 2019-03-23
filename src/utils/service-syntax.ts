import { CComparedFace, CFaceMatch, CFaceDetail, CComparedSourceImage } from "./amazon-rekog-dtypes";
import { timingSafeEqual } from "crypto";

/**
 * This modules prepares the service response/request objects
 */
export class DetectFacesResponse {
    FaceDetails: CFaceDetail[]
    OrientationCorrection: string
    
    constructor(faceDetails: CFaceDetail[], orientationCorrection: string) {
        this.FaceDetails = faceDetails;
        this.OrientationCorrection = orientationCorrection;
    }
}

export class CompareFacesResponse {
    FaceMatches: CFaceMatch[]
    SourceImage: CComparedSourceImage
    SourceImageOrientationCorrection: string
    TargetImageOrientationCorrection: string
    UnmatchedFaces: CComparedFace[]

    constructor(faceMatches, sourceImage, sourceOrientationCorrection, targetOrientationCorrection, unmacthedFaces) {
        this.FaceMatches = faceMatches;
        this.SourceImage = sourceImage;
        this.SourceImageOrientationCorrection = sourceOrientationCorrection;
        this.TargetImageOrientationCorrection = targetOrientationCorrection;
        this.UnmatchedFaces = unmacthedFaces;
    }
}