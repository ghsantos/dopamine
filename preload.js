const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const TRACK = {
  isPlaying: false,
  artist: '',
  trackTitle: '',
  albumTitle: '',
}

let currentTrack = TRACK

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.sendFile(__dirname + '/test.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('trackstate', currentTrack);

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
});

server.listen(3000, '0.0.0.0', () => {
  console.log('listening on *:3000');
});
