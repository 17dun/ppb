/*
	服务启动脚本
*/
var staticServer = require('./static');
var dataServer = require('./api');
var taskServer = require('./task');
var arguments = process.argv.splice(2);
if(arguments.length){
	switch (arguments[0]){
		case 'static':
			staticServer.start();
			break;
		case 'data':
			dataServer.start();
			break;
		default:
			staticServer.start();
			dataServer.start();
			taskServer.start();
	}
}else{
	staticServer.start();
	dataServer.start();
	taskServer.start();
}
