var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Player = require('./public/js/helper').Player;
var Question = require('./public/js/helper').Question;

app.use(express.static('app'));
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/app/index.html');
})

var players = [];
var rooms = [];

const roomsNamespace = io.of('/rooms');
const gameNamespaces = io.of(/^\/game\/\w{20}$/)

roomsNamespace.on('connection', (socket) => {
	console.log('A player is on the rooms page!');

	roomsNamespace.emit('availableRooms', rooms);

	socket.on('createRoom', (roomId) => {
		console.log('Room ' + roomId + ' is created.');
		rooms.push(roomId);
		roomsNamespace.emit('availableRooms', rooms);
	})
})

gameNamespaces.on('connection', (socket) => {

	const namespace = socket.nsp;
	const roomId = namespace.name.substring(6);
	console.log('Player ' + socket.id + ' connected to room ' + roomId);

	socket.on('joinRoom', (playerData) => {
		const player = new Player(socket.id, playerData);
		if (!players.includes(player)) {
			players.push(player);
		}
		namespace.allSockets().then((sockets) => {
			var currentPlayers = players.filter(player => sockets.has(player.socketId));
			socket.emit('currentPlayers', currentPlayers);
			socket.broadcast.emit('newPlayer', player);
		}, (err) => console.err(err));
	});

	socket.on('disconnecting', () => {
		console.log('A user disconnected: ' + socket.id);
		players.filter(player => player.socketId != socket.id);
		socket.broadcast.emit('playerLeft', socket.id);
	});

	socket.on('sendSong', (song) => {
		console.log('Playing song: ' + song.toString());
		namespace.emit('playSong', song);
	});

	socket.on('startQuestion', () => {
		namespace.allSockets().then((sockets) => {
			var currentPlayers = players.filter(player => sockets.has(player.socketId));
			var question = Question.randomQuestion(currentPlayers);
			console.log('Starting question: ' + question.question);
			namespace.emit('sendQuestion', question);
		}, (err) => console.err(err));
	});

	socket.on('pointsRequest', (seconds, choice) => {
		namespace.allSockets().then((sockets) => {
			var playerIndex = players.map(player => player.socketId).indexOf(socket.id);
			var score = players[playerIndex].addPoints(seconds, choice);
			console.log(socket.id + ' got ' + score + ' points!');
			namespace.emit('addPoints', socket.id, seconds, choice);
		}, (err) => console.err(err));
	})
})

server.listen(process.env.PORT || 8081, () => {
	console.log(`Listening on ${server.address().port}`);
})