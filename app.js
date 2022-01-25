import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// app.use("/", indexRouter);


const API_KEY = process.env.API_KEY;
console.log(API_KEY);

const data = {
  endDate: "2022-01-26T08:50:00.000Z",
  fields: ["hostRoomUrl"],
};

function getResponse() {
    return fetch("https://api.whereby.dev/v1/meetings", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

getResponse().then(async res => {
    console.log("Status code:", res.status);
    const data = await res.json();
    console.log("Room URL:", data.roomUrl);
    console.log("Host room URL:", data.hostRoomUrl);
});

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
