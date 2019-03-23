import { Router } from 'express';

import { FaceVerification } from '../ai-bridge/face-analytics';
import { loadImage, imageToData } from '../utils/imageio';

let router:Router = Router();
/**
 * Initialise face verification instance
 */
let verifier: FaceVerification;
FaceVerification.getInstance()
    .then(faceVerifier => verifier = faceVerifier)
    .catch(err => console.log(`Cannot initialize face verifier: ${err}`));

const SIMILARITY_THRESHOLD = 60;

router.get('/from-url', async function(req, res) {
    let sourceImage: string  = req.query.sourceImage;
    let targetImage: string = req.query.targetImage;
    let similarityThreshold: number = req.query.similarityThreshold || SIMILARITY_THRESHOLD;
    
    try {
        const htmlImgs = await Promise.all(
            [loadImage(sourceImage),
             loadImage(targetImage)]);
        const sourceImageData = imageToData(htmlImgs[0]);
        const targetImageData = imageToData(htmlImgs[1]);
        let comparedFaces = await verifier.compareFaces(sourceImageData, targetImageData, similarityThreshold);
        
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
    let similarityThreshold: number = req.body.SimilarityThreshold || SIMILARITY_THRESHOLD;
    
    try {
        const htmlImgs = await Promise.all(
            [loadImage(sourceImage),
             loadImage(targetImage)]);
        const sourceImageData = imageToData(htmlImgs[0]);
        const targetImageData = imageToData(htmlImgs[1]);
        let comparedFaces = await verifier.compareFaces(sourceImageData, targetImageData, similarityThreshold);
        
        res.send(comparedFaces);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export const CompareFacesService:Router = router;
