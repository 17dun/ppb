/*
	服务启动脚本
*/
var staticServer = require('./static');
var dataServer = require('./api');

staticServer.start();
dataServer.start();