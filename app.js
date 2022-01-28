import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const __dirname = path.resolve();

const app = express();
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// CORS POLICY
const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
  methods: "OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // include before other routes


app.use("/", indexRouter);

var router = express.Router();

const API_KEY = process.env.API_KEY;

const data = {
  endDate: "2022-02-28T08:50:00.000Z",
  fields: ["hostRoomUrl"],
};

function getResponse() {
    return fetch("https://api.whereby.dev/v1/meetings", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

const createMeeting =((req, res) => {
  console.log('I am here');
  getResponse().then(async result => {
    console.log(res);
    console.log("Status code:", result.status);
    const data = await result.json();
    res.json({ status: 200, msg: 'Meeting URL you requested for ', data});
    console.log('Here is the data send to FE', data);
  });
})

/* GET home page. */
app.use('/create-meeting', router.get('/', createMeeting));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

export default app;
