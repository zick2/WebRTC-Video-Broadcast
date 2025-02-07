const express = require("express");
const app = express();

let broadcaster;
const PORT = 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server,  {
  cors: {
    origin: "http://localhost:4002",
    methods: ["GET", "POST"]
  }
});
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  console.log("New:", socket.id)
  // socket.on("msg", (m)=> {
  //   console.log("msg:",m)
  // })
  

  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });


  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });

  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });

  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });

  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });

});


const port = process.env.PORT || PORT;

server.listen(port, () => console.log(`Server is running on port ${port}`));
