import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";

import { indexRouter } from './routes/index';
import { FaceDetection, FaceVerification } from "./ai-bridge/face-analytics";
import { FaceDetectionService } from './services/detect-faces';
import { CompareFacesService } from "./services/compare-faces";

let initAI = async () => {
    await FaceDetection.getInstance();
    await FaceVerification.getInstance();
}

initAI()
    .then(() => console.log('AI initialized'))
    .catch(err => console.log(`Failed to initialise AI: ${err}`));
    
const app:express.Application = express();

app.use(logger('dev'));
/** Request payload limits
 * Source: https://stackoverflow.com/a/36514330/6699069
 */
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
/* Add web ui endpoints */
app.use('/', indexRouter);
/** API endpoints */
app.use('/api/face-detection', FaceDetectionService);
app.use('/api/compare-faces', CompareFacesService);

export const App: express.Application = app;
