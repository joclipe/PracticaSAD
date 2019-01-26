var net = require('net');
var zmq = require('zmq');
var client = new net.Socket();
var spliter = '~½¬½~{[¬½@~½#@|';
var req = zmq.socket('req');
exports.Start = function (host, port,) {
	req.connect("tcp://"+host+":"+port);
	console.log('Connected to: ' + host + ':' + port);
}


var callbacks = {} // hash of callbacks. Key is invoId
var invoCounter = 0; // current invocation number is key to access "callbacks".

//
// When data comes from server. It is a reply from our previous request
// extract the reply, find the callback, and call it.
// Its useful to study "exports" functions before studying this one.
//

req.on ('message', function (data) {
	var datas = (data.toString()).split(spliter);
	var i;
	for(i=0; i< datas.length; i++) {
		if(datas[i] != ""){
			console.log ('message comes in: ' + datas[i]);
			var reply = JSON.parse (datas[i].toString());
			switch (reply.what) {
				// TODO complete list of commands
				case 'add user': //2
					console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
					delete callbacks [reply.invoId]; // remove from hash
				break;
				case 'add subject': //1
					console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
					delete callbacks [reply.invoId]; // remove from hash
				break;
				case 'get subject list': //0
					console.log ('We received a reply for:' + reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
					delete callbacks [reply.invoId]; // remove from hash
					break;
				case 'get user list':	//0
					console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
					delete callbacks [reply.invoId]; // remove from hash
					break;
				case 'login':	//2
					console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
					delete callbacks [reply.invoId]; // remove from hash
				break;

				case 'add private message': //1
					console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
					delete callbacks [reply.invoId]; // remove from hash
				break;
				case 'get private message list': //2
					console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
					delete callbacks [reply.invoId]; // remove from hash
				break;

				case 'add public message': //1
					console.log ('We received a reply for: ' +  reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, no arguments
					delete callbacks [reply.invoId]; // remove from hash
				break;
				case 'get public message list': //1
					console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
					callbacks [reply.invoId] (reply.obj); // call the stored callback, no arguments
					delete callbacks [reply.invoId]; // remove from hash
				break;
				default:
					console.log ("Panic: we got this: " + reply.what);
			}
		}
	}
});

// Add a 'close' event handler for the client socket
req.on('close', function() {
    console.log('Connection closed');
});


//
// on each invocation we store the command to execute (what) and the invocation Id (invoId)
// InvoId is used to execute the proper callback when reply comes back.
//
function Invo (str, cb) {
	this.what = str;
	this.invoId = ++invoCounter;
	callbacks[invoCounter] = cb;
}

//
//
// Exported functions as 'dm'
//
//
exports.addUser = function (u, p, cb){ //add
	var invo = new Invo ('add user', cb);
	invo.u = u;
	invo.p = p;
	req.send (JSON.stringify(invo) + spliter);
	}

exports.addSubject = function (s, cb){ //add
	var invo = new Invo ('add subject', cb);
	invo.s = s;
	req.send (JSON.stringify(invo) + spliter)
}

exports.getSubjectList = function (cb) {
	req.send  (JSON.stringify(new Invo ('get subject list', cb)) + spliter);
}

exports.getUserList = function (cb){//add
	req.send  (JSON.stringify(new Invo ('get user list', cb)) + spliter);
}
exports.login = function (u, p, cb){
	var invo = new Invo('login', cb)
	invo.u = u;
	invo.p = p;
	req.send  (JSON.stringify(invo) + spliter);
}

exports.addPrivateMessage = function (msg, cb) {
	invo = new Invo ('add private message', cb);
	invo.msg = msg;
	req.send  (JSON.stringify(invo) + spliter);
}

exports.getPrivateMessageList = function (u1, u2, cb) {
	invo = new Invo ('get private message list', cb);
	invo.u1 = u1;
	invo.u2 = u2;
	req.send  (JSON.stringify(invo) + spliter);
}

exports.addPublicMessage = function (msg, cb)
{
	var invo = new Invo('add public message', cb);
	invo.msg = msg;
	req.send  (JSON.stringify(invo) + spliter);
}

exports.getPublicMessageList = function  (sbj, cb) {
	var invo = new Invo ('get public message list', cb);	
	invo.sbj = sbj;
	req.send  (JSON.stringify(invo) + spliter);
}

