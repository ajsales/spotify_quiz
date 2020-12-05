var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Spotify = require('spotify-web-api-js');
var s = new Spotify();

app.use(express.static('app'));
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/app/index.html');
})

var players = [];

io.on('connection', (socket) => {
	console.log('A user connected!');

	socket.on('joinServer', (user) => {
		const player = {'socketId': socket.id, 'playerData': user};
		players.push(player);
	});

	socket.on('joinRoom', (roomId, user) => {
		console.log(socket.id + ' joined room ' + roomId);
		if (!(socket.rooms.has(roomId))) {
			socket.join(roomId);
		}
		socket.rooms.forEach(room => {
			if (!([socket.id, roomId].includes(room))) {
				socket.to(room).emit('playerLeft', socketId);
				socket.leave(room);
			}
		});
		var currentSockets = io.sockets.adapter.rooms.get(roomId);
		socket.emit('currentPlayers', players.filter(player => currentSockets.has(player.socketId)));
		var player = {'socketId': socket.id, 'playerData': user};
		socket.to(roomId).emit('newPlayer', player);
	});

	socket.on('currentRoomsRequest', () => {
		socket.emit('currentRooms', Array.from(io.sockets.adapter.rooms.keys()));
	})

	socket.on('disconnecting', () => {
		console.log('A user disconnected: ' + socket.id);
		socket.rooms.forEach(room => {
			console.log(socket.id + ' leaving room ' + room);
			socket.to(room).emit('playerLeft', socket.id);
		});
	})

	socket.on('sendSong', (roomId, song) => {
		console.log(`Playing song: ${song.name} by ${song.artists[0].name}`);
		io.to(roomId).emit('playSong', song);
	})

	socket.on('sendQuestion', (roomId, question) => {
		console.log('Question time!');
		io.to(roomId).emit('playSong', question.song);
		io.to(roomId).emit('receiveQuestion', question);
	})
});


server.listen(process.env.PORT || 8081, () => {
	console.log(`Listening on ${server.address().port}`);
})