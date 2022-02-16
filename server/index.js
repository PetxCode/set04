const url_online =
  "mongodb+srv://AuthClass:AuthClass@codelab.u4drr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const url = "mongodb://localhost/change";

const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const port = 2556;

io.on("connection", (socket) => {
  console.log("now listen: ", socket.id);
});

mongoose.connect(url_online);

app.use(cors());
app.use(express.json());
app.use("/", require("./router"));

const db = mongoose.connection;

db.on("open", () => {
  const dbConnect = db.collection("changestreams").watch();

  dbConnect.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const newData = {
        _id: change.fullDocument._id,
        course: change.fullDocument.course
      };
      io.emit("observer", newData);
    } else if (change.operationType === "delete") {
      io.emit("deleteObserver", change.fullDocument);
    } else if (change.operationType === "update") {
      const newData = {
        _id: change.fullDocument._id,
        course: change.fullDocument.course
      };
      io.emit("updateObserver", newData);
    }
  });
});

server.listen(port, () => {
  console.log("server is now up and running", port);
});
