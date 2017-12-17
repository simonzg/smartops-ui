var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");

var index = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", index);

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("ERR is: " + err);
  var status_code = err && err.status_code ? err.status_code : 500;

  data = {
    message: err.message,
    status_code: status_code
  };

  if (req.app.get("env") === "development") {
    data.stacktrace = err.stack;
    data.code = err && err.code ? err.code : "";
  }

  // render the error page
  res.status(status_code).json(data);
});

module.exports = app;
