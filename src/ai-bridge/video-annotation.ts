import * as cv from "opencv4nodejs";
import { matToHtmlImage, loadImage } from "../utils/imageio";
import { VideoStream } from "../utils/videoio";
import { FaceDetection, FaceVerification } from "../ai-bridge/face-analytics";
import { FaceBlob, Rectangle } from "../utils/helper-dtypes";
import { CFaceDetail, CComparedFace, CBoundingBox } from "../utils/amazon-rekog-dtypes";
import { LabeledFaceDescriptors, FaceMatcher, Rect } from "face-api.js";

/**
 * Simple brute-force method for annotating a video
 */
export class Tracker {
    verifier: FaceVerification;
    detector: FaceDetection;
    labeledDescs = new Array<LabeledFaceDescriptors>();
    refImgs: any;
    target: VideoStream;
    ids:number = 0;
    names: string[]
    faceBlobs = new Array<FaceBlob>(); //stores annotations
    faceMatcher: FaceMatcher;
    visualize: boolean;
    frameNo:number = 0;
    similarityThreshold: number = 0.8;
    distanceThreshold: number = 0.9;

    constructor(){}

    async init(images: string[], names: string[]) {
        this.names = names;
        this.detector = await FaceDetection.getInstance();
        this.verifier = await FaceVerification.getInstance();
        let htmlImgs = await Promise.all(images.map(async (img) => await loadImage(img)));
        let faces = await Promise.all(htmlImgs.map(async(img) => await this.verifier.findLargestFace(img)));
        faces.forEach((face, i) => this.labeledDescs.push(new LabeledFaceDescriptors(names[i], [face.descriptor])));
        this.faceMatcher = new FaceMatcher(this.labeledDescs);
        return this;
    }

    async updateBlobs(frame: cv.Mat) {
        let htmlImg = await matToHtmlImage(frame);
        let faces = await this.verifier.findAllfaces(htmlImg);
        let matches = faces.map(face => this.faceMatcher.findBestMatch(face.descriptor));
        matches.forEach((match, i) => {
            let similarity = this.verifier.confidence(match.distance, 0.9);
            const bbox = faces[i].detection.box;
            const rect = new Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
            const confidence = faces[i].detection.score;
            const imgW = faces[i].detection.imageDims.width;
            const imgH = faces[i].detection.imageDims.height;
            let comparedFace = new CComparedFace(new CBoundingBox(rect, imgW, imgH), confidence);
            let faceBlob = new FaceBlob(frame, comparedFace);
            faceBlob.setMatch(match.label, similarity);
            
            let index = this.getBlobByName(faceBlob.matches);
            if(index!=-1){
                this.faceBlobs[index].frameNos.push(this.frameNo);
                faceBlob.frameNos = this.faceBlobs[index].frameNos;
                faceBlob.id = this.faceBlobs[index].id;
                faceBlob.frameNos = this.faceBlobs[index].frameNos;
                this.faceBlobs[index] = faceBlob;
            } else {
                if(this.faceBlobs.length < this.names.length && similarity >= this.similarityThreshold) {
                    faceBlob.id = this.ids;
                    this.ids++;
                    faceBlob.frameNos.push(this.frameNo);
                    this.faceBlobs.push(faceBlob)
                }
            }
            if(similarity >= this.similarityThreshold) {
                faceBlob.addAnnotation(new cv.Vec3(0, 255, 0), 8); //green
            } else {
                faceBlob.addAnnotation(new cv.Vec3(0, 0, 255), 8); //red
            }
            
        });
    }

    getBlobByName(name: string) {
        for(let i in this.faceBlobs) {
            if(this.faceBlobs[i].matches == name) {
                return i;
            }
        }
        return -1;
    }

    async track(targetVideo: string, frameDim: cv.Size, similarityThresh?:number, distanceThresh?:number, visualize?: boolean) {
        this.visualize = visualize;
        this.distanceThreshold = distanceThresh;
        this.similarityThreshold = similarityThresh/100;
        this.target = new VideoStream(frameDim, targetVideo);
        let frame;
        while(this.target.isOpen()) {
            frame = this.target.nextFrame();
            await this.updateBlobs(frame);
            this.frameNo++;
            if(this.visualize) {
                cv.imshow('output', frame);
                cv.waitKey(1000/this.target.fps);
            }
        }
        cv.destroyWindow('output');
        return this.faceBlobs;
    }
}
