import { loadImage } from '../src/utils/imageio'; //important to put this on first line
import { FaceVerification } from '../src/ai-bridge/face-analytics';
import { ArgumentParser } from 'argparse';

let parser = new ArgumentParser({
    addHelp: true,
    description: 'Compare largest face of source image to all faces in target image'
});
parser.addArgument('source', {
    help: 'Source Image'
});
parser.addArgument('target', {
    help: 'Target image'
});
parser.addArgument(['-s', '--similarity'], {
    help: 'Similarity threshold. A value between 0-100',
    defaultValue: 60,
    type: Number
});
let args = parser.parseArgs();
let run = async function(){
    let faceVerification: FaceVerification = await FaceVerification.getInstance();
    let file1 = args.source;
    let file2 = args.target;
    let out = await Promise.all([loadImage(file1), loadImage(file2)]);
    let image1 = out[0];
    let image2 = out[1];
    let response = await faceVerification.compareFaces(image1, image2, 60);
    console.log(JSON.stringify(response, null, 2));
}

run();