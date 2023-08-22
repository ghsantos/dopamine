const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e7 });

const TRACK = {
  isPlaying: false,
  artist: '',
  trackTitle: '',
  albumTitle: '',
}

let currentTrack = TRACK
let image

fs.readFile(__dirname + '/static/icons/512x512.png', (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  let str = data.toString('base64')
  image = Buffer.from(str, 'base64');
});

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.sendFile(__dirname + '/test.html');
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.conn.server.clientsCount);
  io.emit('trackstate', currentTrack);
  if (image) {
    io.emit('trackcover', image);
  }
  // io.emit('trackcover', image)

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('prev', msg => {
    io.emit('chat message', 'cmd prev');
    io.emit('prev', 'cmd prev');
  });

  socket.on('playpause', msg => {
    io.emit('chat message', 'cmd playpause');
    io.emit('playpause', 'cmd playpause');
  });

  socket.on('next', msg => {
    io.emit('chat message', 'cmd next');
    io.emit('next', 'cmd next');
  });

  socket.on('trackstate', data => {
    io.emit('chat message', JSON.stringify(data));
    currentTrack = data
    io.emit('trackstate', data);
  })

  socket.on("upload", (file, callback) => {
    console.log('upload');

    !!callback && callback({ message: "success" });

    image = file
    io.emit('trackcover', file);
  });

  socket.on("playbackprogress", progress => {
    io.emit('playbackprogress', progress)
  })
});

server.listen(3000, '0.0.0.0', () => {
  console.log('listening on *:3000');
});
