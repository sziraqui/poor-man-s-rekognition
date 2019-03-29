import { CComparedFace, CFaceMatch, CFaceDetail, CComparedSourceImage } from "./amazon-rekog-dtypes";

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
    SourceImageFace: CComparedSourceImage
    SourceImageOrientationCorrection: string
    TargetImageOrientationCorrection: string
    UnmatchedFaces: CComparedFace[]

    constructor(faceMatches, sourceImageFace, sourceOrientationCorrection, targetOrientationCorrection, unmacthedFaces) {
        this.FaceMatches = faceMatches;
        this.SourceImageFace = sourceImageFace;
        this.SourceImageOrientationCorrection = sourceOrientationCorrection;
        this.TargetImageOrientationCorrection = targetOrientationCorrection;
        this.UnmatchedFaces = unmacthedFaces;
    }
}