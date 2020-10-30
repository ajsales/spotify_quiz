var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static("app"));
app.use(express.static("public"));

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/app/index.html');
})

server.listen(8081, () => {
	console.log(`Listening on ${server.address().port}`);
})