import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as showError from "http-errors";
import * as cors from "cors";

import { indexRouter } from './routes/index';
import { FaceDetection, FaceVerification } from "./ai-bridge/face-analytics";
import { FaceDetectionService } from './services/detect-faces';
import { CompareFacesService } from "./services/compare-faces";

const createError = require("http-errors").createError;
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
/** For CORS */
app.use(cors());
app.options('*', cors());
/** Web demo static files */
app.set('views', path.join(__dirname, '..', 'web-demo', 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '..', 'web-demo', 'public')));
/* Add web ui endpoints */
app.use('/', indexRouter);
/** API endpoints */
app.use('/api/face-detection', FaceDetectionService);
app.use('/api/compare-faces', CompareFacesService);
/** Error handler */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(showError(404));
});
  // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {}; 
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export const App: express.Application = app;
