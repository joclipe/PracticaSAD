var net = require('net');
var zmq = require('zmq');
var rep = zmq.socket('rep');
var pub = zmq.socket('pub');
var sub = zmq.socket('sub');
var HOST = '127.0.0.1';
//var PORT = 9000;
var PORT = process.argv[2];
var PORTPUB = process.argv[3];
var spliter = '~½¬½~{[¬½@~½#@|';

// Variable de la lista de los distintos servidores.
var servers = process.argv[4];

// puerto del server i puerto del pub node dmserver.js 8001 9001 127.0.0.1:9002

var dm = require ('./dm.js');


if (servers == "" || servers == null || servers == undefined) {
    console.log("El unico servidor conectado es el actual.")
} else {
    var i;
    var aux = servers.split(",");
    for (i = 0; i < aux.length; i++){
        sub.connect("tcp://"+aux[i]);
        sub.subscribe("cp");
        console.log ("subscrito al servidor : " +aux[i]);
    }
}

sub.on('message', function(msgStr){
	var res = (msgStr.toString()).split("cp");
	for (i=0; i< res.length; i++) {
		if (res[i] != "" && res[i] != "cp"){
			console.log("Checkpoint recibido:" + res[i]);
            var datos = JSON.parse (res[i]);
            var reply = {what:datos.what, invoId:datos.invoId};
			switch (datos.what) {
                case 'add user': 
                    reply.obj = dm.addUser(datos.u, datos.p);
                    pub.send ("cambios" + res[i]);
                    break;
                case 'add subject': 
                    reply.obj = dm.addSubject(datos.s);
                    pub.send ("cambios" + res[i]);
                    break;
                case 'add private message': 
                    console.log(datos.msg);
                    console.log(res[i]);
                    reply.obj = dm.addPrivateMessage (datos.msg);
                    pub.send ("cambios" + res[i]);
                    break;
                case 'add public message': 
                    reply.obj = dm.addPublicMessage (datos.msg);
                    pub.send ("cambios" + res[i]);
                    break;
                default:
                    console.log ('error catastrofico: no ha accedido a ningun case valido');
                    break;
            }
		}	
	}
});


// Create the server socket, on client connections, bind event handlers

pub.bind("tcp://*:"+ PORTPUB);
console.log('Server publishing on ' + PORTPUB + ' type: publisher')
rep.bind("tcp://"+HOST+":"+PORT,function(err) {
    if(err) {
        throw err;
    }
    else {
        console.log('Server listening on ' + HOST +':'+ PORT + ' type responser');
    }
});
rep.on('message', function(data) {
    var i;
    console.log('request comes in...' + data);
    var str = data.toString();
    var datas = str.split(spliter);
    for(i = 0; i< datas.length; i++){
        if(datas[i] != ""){
            console.log(datas[i]);
            var invo = JSON.parse (datas[i]);
            console.log('request is:' + invo.what + ':' + datas[i]);
            cmd = invo;
            var reply = {what:invo.what, invoId:invo.invoId};
            switch (invo.what) {
                case 'add user': 
                    reply.obj = dm.addUser(cmd.u, cmd.p);
                    pub.send ("cambios" + datas[i]);
                    pub.send ("cp" + datas[i]);
                    break;
                case 'add subject': 
                    reply.obj = dm.addSubject(cmd.s);
                    pub.send ("cambios" + datas[i]);
                    pub.send ("cp" + datas[i]);
                    break;
                case 'get subject list': 
                    reply.obj = dm.getSubjectList();
                    break;
                case 'get user list': 
                    reply.obj = dm.getUserList();
                    break;
                case 'login': 
                    reply.obj = dm.login(cmd.u, cmd.p);
                    break;
                case 'add private message': 
                    reply.obj = dm.addPrivateMessage (cmd.msg);
                    pub.send ("cambios" + datas[i]);
                    pub.send ("cp" + datas[i]);
                    break;
                case 'get private message list': 
                    reply.obj = dm.getPrivateMessageList (cmd.u1, cmd.u2);
                    break;
                case 'add public message': 
                    reply.obj = dm.addPublicMessage (cmd.msg);
                    pub.send ("cambios" + datas[i]);
                    pub.send ("cp" + datas[i]);
                    break;
                case 'get public message list': 
                    reply.obj = dm.getPublicMessageList (cmd.sbj);
                    break;
                
                // TODO: complete all forum functions
            }
            rep.send (JSON.stringify(reply) + spliter);
        }
    }
});

// Add a 'close' event handler to this instance of socket
rep.on('close', function(data) {
    console.log('Connection closed');
});


