
import { FaceDetection } from '../src/ai-bridge/face-analytics';
import { loadImage, imageToData } from '../src/utils/imageio';

let init = async function(){
    let faceDetection: FaceDetection = await FaceDetection.getInstance();
    let img = await loadImage('/home/sziraqui/Downloads/look-alike-faces.jpg');
    let imageData = imageToData(img);
    let bboxList = await faceDetection.detectAll(imageData);
    console.log('bbox', bboxList);
}
/** First time will take few seconds */
init();
/** Second time should be quick if the singleton is implemented correctly */
init();