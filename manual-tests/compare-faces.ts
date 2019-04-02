
import { FaceVerification } from '../src/ai-bridge/face-analytics';
import { loadImage } from '../src/utils/imageio';

let run = async function(){
    let faceVerification: FaceVerification = await FaceVerification.getInstance();
    let file1 = "/home/sziraqui/Desktop/faces/zunaid.s@somaiya.edu/WhatsApp Image 2018-01-14 at 11.06.51.jpeg";
    let file2 = "/home/sziraqui/Desktop/faces/zunaid.s@somaiya.edu/WhatsApp Image 2018-01-14 at 11.06.50.jpeg";
    let out = await Promise.all([loadImage(file1), loadImage(file2)]);
    let image1 = out[0];
    let image2 = out[1];
    let confidence = await faceVerification.similarity(image1, image2, 0.75);
    console.log(confidence);
}

run();