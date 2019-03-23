import { Router } from 'express';

import { FaceDetection, FaceVerification } from '../ai-bridge/face-analytics';
import { loadImage, imageToData } from '../utils/imageio';

let router:Router = Router();

let detector: FaceDetection;
FaceDetection.getInstance()
    .then(faceDetector => detector = faceDetector)
    .catch(err => console.log(`Cannot initialize face detector: ${err}`));

let verifier: FaceVerification;
FaceVerification.getInstance()
    .then(faceVerifier => verifier = faceVerifier)
    .catch(err => console.log(`Cannot initialize face verifier: ${err}`));

router.get('/from-url', async function(req, res) {
    let sourceImage: string  = req.query.sourceImage;
    let targetImage: string = req.query.targetImage;
    let similarityThreshold: number = req.query.similarityThreshold || 0.75;
    console.log(`request query: ${req.query}`);
    try {
        const htmlImgs = await Promise.all(
            [loadImage(sourceImage),
             loadImage(targetImage)]);
        const sourceImageData = imageToData(htmlImgs[0]);
        const targetImageData = imageToData(htmlImgs[1]);
        let comparedFaces = await verifier.similarityMulti(sourceImageData, targetImageData, similarityThreshold);
        console.log(comparedFaces);
        res.send(JSON.stringify(comparedFaces));
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

/**
 * Request Syntax
 * {    
 *      "SimilarityThreshold": any positive float ideally close to 0.75
 *      "SourceImage": {
 *          "Bytes": "base64 encoded image string",
 *      },
 *      "TargetImage": {
 *          "Bytes": "base64 encoded image string"
 *      }
 * }
 * 
 */
router.post('/from-blob', async function(req, res) {
    let sourceImage: string  = req.body.SourceImage.Bytes;
    let targetImage: string = req.body.TargetImage.Bytes;
    let similarityThreshold: number = req.body.SimilarityThreshold || 0.75;
    console.log(`request query: ${req.query}`);
    try {
        const htmlImgs = await Promise.all(
            [loadImage(sourceImage),
             loadImage(targetImage)]);
        const sourceImageData = imageToData(htmlImgs[0]);
        const targetImageData = imageToData(htmlImgs[1]);
        let comparedFaces = await verifier.similarityMulti(sourceImageData, targetImageData, similarityThreshold);
        console.log(JSON.stringify(comparedFaces));
        res.send(comparedFaces);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export const compareFaces:Router = router;
