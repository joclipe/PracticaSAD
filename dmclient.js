var dm = require ('./dm_remote.js');

var ipp = process.argv[2].split(":");

var peticion = process.argv[3];

var u1 = process.argv[4];
var u2 = process.argv[5];

var aux = process.argv[6];

//url server, accion, argumentos de la accion, node dmclient.js127.0.0.1:8001 'get user list'

var HOST = ipp[0];
//var PORT = 9000;
var PORT = ipp[1];


dm.Start(HOST, PORT);
switch(peticion){
	case 'add user':
		dm.addUser (u1,u2,function (peticion) {
			console.log ("Se ha añadido el siguiente usuario:")
			console.log (JSON.stringify(u1,u2,peticion));   
		});
	break;
	case 'add subject':
		dm.addSubject (u1, function (peticion) {
			console.log ("Se ha añadido el siguiente tema: ")
			console.log (JSON.stringify(u1,peticion));   
		});
	break;
	case 'get subject list': 
		dm.getSubjectList (function (peticion) {
			console.log ("Estos son los temas disponibles:")
			console.log (JSON.stringify(peticion)); 
			
		});
	break;
	case 'get user list':
		dm.getUserList (function (peticion) {
			console.log ("Estos son los usuarios disponibles:")
			console.log (JSON.stringify(peticion));  
		});
	break;
	case 'login':
		dm.login (u1, u2, function (peticion) {
			console.log ("Se ha iniciado sesion: ")
			console.log (JSON.stringify(u1,u2,peticion));   
		});
	break;
	case 'add private message':
		dm.addPrivateMessage (u1, function (peticion) {
			console.log ("Se ha enviado el mensaje privado: ")
			console.log (JSON.stringify(u1,peticion));   
		});
	break;
	case 'get private message list':
		dm.getPrivateMessageList (u1,u2, function (peticion) {
			console.log ("Estos son los mensaje privados disponibles:")
			console.log (JSON.stringify(u1,u2,peticion));   
		});
	break;
	case 'add public message':
	dm.addPublicMessage (function (u1, peticion) {
		console.log ("Se ha enviado el mensaje publico: ")
		console.log (JSON.stringify(u1,peticion));   
	});
	break;
	case 'get public message list':
		dm.getPublicMessageList (u1, function (peticion) {
			console.log ("Estos son los mensajes publicos disponibles:")
			console.log (JSON.stringify(u1,peticion));   
		});
	break;
	default:
		console.log("error")
}
