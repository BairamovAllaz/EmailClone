const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"
  },
});
const coockieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-cookie");
dotenv.config();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"]
  })
);
app.use(require("express").json());
app.use(
  require("express").urlencoded({
    extended: false,
  })
);
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(coockieParser());
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "836wer89r",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      sameSite: "none",
    },
  })
);

io.on("connection", socket => {
  console.log("A user is connected");

  socket.on("message", message => {
    console.log(`message from ${socket.id} : ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });
});
module.exports = io;




app.get("/", (req, res) => {
  res.send("Hello world");
});
app.get("/", (req, res) => {
  res.send("Hello world");
});

const api = require("./Router/Api");
app.use("/api", api);

server.listen(process.env.PORT || 5100, () => {
  console.log("Connected" + 5100);
});
