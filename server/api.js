var http = require('http');
var url = require('url');
var db = require('./db');
var querystring = require('querystring');
http.createServer(
    main
).listen(888);
 
//请求进来时候执行的代码
function main(req,res){
	console.log(req.url);
	//res.write('ss');
	//res.end();
	//数据库操作是异步，释放也是异步的，两个异步的时间不处理好这边已经释放了
	var arg  = url.parse(req.url).query;
  	var method = querystring.parse(arg).method;
  	console.log(db[method]);
  	if(db[method]){
  		db[method](req,res);
  	}

}