import * as express from "express";
import * as logger from "morgan";

import {indexRouter} from './routes/index';

const app:express.Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/* Add endpoints */
app.use('/', indexRouter);

export const App: express.Application = app;
