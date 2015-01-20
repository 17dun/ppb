/*
	获取数据的服务
*/

var http = require('http');
var url = require('url');
var db = require('./db');
var querystring = require('querystring');
var port = 8888;
function main(req,res){
	console.log(req.url);
	var arg  = url.parse(req.url).query;
  	var method = querystring.parse(arg).method;
  	if(db[method]){
  		db[method](req,res);
  	}else{
      res.write('方法不存在');
      res.end();
    }
}

function start(){
  http.createServer(main).listen(port);
  console.log('数据接口服务启动，端口:'+port);
}

module.exports.start = start;
