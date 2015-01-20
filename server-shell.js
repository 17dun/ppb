/*
	服务启动脚本
*/
var staticServer = require('./shellstatic');
var taskServer = require('./shell');
var arguments = process.argv.splice(2);
staticServer.start();
taskServer.start();
