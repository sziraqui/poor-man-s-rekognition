import { loadImage } from '../src/utils/imageio'; // important to put this line first
import { FaceDetection } from '../src/ai-bridge/face-analytics';
import { ArgumentParser } from 'argparse';

let parser = new ArgumentParser({
    addHelp: true,
    description: 'Find all face bounding boxes for input image'
});
parser.addArgument('source', {
    help: 'Source Image'
});

let args = parser.parseArgs();

let init = async function(){
    let faceDetection: FaceDetection = await FaceDetection.getInstance();
    let img = await loadImage(args.source);
    
    let bboxList = await faceDetection.detectFaces(img);
    console.log(JSON.stringify(bboxList, null, 2));
}
/** First time will take few seconds */
init();
