var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('app'));
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/app/index.html');
})

var players = {};

io.on('connection', (socket) => {
	console.log('A user connected!');

	socket.on('joinRoom', (roomId, user) => {
		const player = {'socketId': socket.id, 'playerData': user};
		if (roomId in players) {
			if (players[roomId].map(player => player.socketId).includes(socket.id)) {
				socket.emit('currentPlayers', players[roomId]);
				return;
			}
			players[roomId].push(player);
		} else {
			players[roomId] = [player];
		}
		socket.join(roomId);
		socket.emit('currentPlayers', players[roomId]);
		socket.to(roomId).emit('newPlayer', player);
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected: ' + socket.id);
		for(var roomId in players) {
			const index = players[roomId].map(x => x.socketId).indexOf(socket.id);
			if (index > -1) {
				players[roomId].splice(index, 1);
			  	io.to(roomId).emit('playerLeft', socket.id);
			  	break;
			}
		}
	});

	socket.on('sendSong', (roomId, song) => {
		console.log(`Playing song: ${song.name} by ${song.artists[0].name}`);
		io.to(roomId).emit('playSong', song);
	})
});


server.listen(process.env.PORT || 8081, () => {
	console.log(`Listening on ${server.address().port}`);
})