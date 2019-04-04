import "@tensorflow/tfjs-node";
import { ArgumentParser } from "argparse";
import { Tracker } from "../src/ai-bridge/video-annotation";
import * as cv from "opencv4nodejs";

let parser = new ArgumentParser();
parser.addArgument(['-r', '--refimages'], {
    nargs: '*',
    help: 'A list of image files (paths) each containing a single face'
})
parser.addArgument(['-n', '--names'], {
    nargs: '*',
    help: 'A list of corresponding names for faces in reference images'
});
parser.addArgument(['-t', '--target'], {
    required: true,
    type: String,
    help: 'Target video to track faces on'
});
parser.addArgument(['-s', '--similarity'], {
    type: Number,
    defaultValue: 80,
    help: 'Similarity threshold (0-100)'
});
parser.addArgument(['-d', '--distance'], {
    type: Number,
    defaultValue: 0.9,
    help: 'Distance threshold. Float value typically in 0-1.2 range'
});

parser.addArgument(['-v', '--visualize'], {
    action: "store",
    type: Boolean,
    defaultValue: true,
    help: 'Whether to display frame-by-frame output'
});
let args = parser.parseArgs();

async function run() {
    let tracker = await new Tracker().init(args.refimages, args.names);
    const faceBlobs = await tracker.track(args.target, new cv.Size(480, 360), args.similarity, args.distance, args.visualize);
    faceBlobs.forEach((fb) => {
        console.log(`Label: ${fb.matches}`);
        console.log(`Frames: ${fb.frameNos}`);
    });
}

run().catch(err => console.log(err));