import { Router } from 'express';
import { FaceDetection } from '../ai-bridge/face-analytics';
import { loadImage, imageToData } from '../utils/imageio';
import { inherits } from 'util';
import { CBoundingBox } from '../utils/amazon-rekog-dtypes';
import { DetectFacesResponse } from '../utils/service-syntax';
let router:Router = Router();

let detector:FaceDetection;
FaceDetection.getInstance()
    .then(faceDetector => detector = faceDetector)
    .catch(console.error);


router.get('/from-url', async function(req, res) {
    let imageUrl: string  = req.query.imageUrl;
    console.log(`imageUrl ${imageUrl}`);
    try {
        const image = await loadImage(imageUrl);
        const imageData = imageToData(image);
        const detectFacesRes: DetectFacesResponse = await detector.detectFaces(imageData);
        res.send(JSON.stringify(detectFacesRes));
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

/**
 * Request Syntax
 * {    
 *      "Image": {
 *          "Bytes": "base64 encoded image string",
 *      }
 * }
 * 
 */
router.post('/from-blob', async function(req, res) {
    const dataUrl: string = req.body.Image.Bytes;
    try {
        const image = await loadImage(dataUrl);
        const imageData = imageToData(image);
        const detectFacesRes: DetectFacesResponse = await detector.detectFaces(imageData);
        res.send(JSON.stringify(detectFacesRes));
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export const faceDetection:Router = router;
