import { CComparedFace, CFaceMatch, CFaceDetail } from "./amazon-rekog-dtypes";

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
    SourceImage: CComparedFace

}