/*
  任务管理脚本
*/
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var port = 8881;
var process = require('child_process');
function main(req,res){
  var arg  = url.parse(req.url).query;
    var method = querystring.parse(arg).method;
    res.writeHead(200, {"Content-Type": "text/html;charset:utf-8"}); 
    if(method=='restart'){
       process.exec('sh ./restart.sh',function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
	  res.write('执行错误：'+error);
      	  res.end();
	}else{
	  res.write('重启成功');
	  res.end();
	}
    });
       console.log('chongqi');
    }else{
      res.write('方法不存在');
      res.end();
    }
}

function start(){
  http.createServer(main).listen(port);
  console.log('任务脚本启动:'+port);
}

module.exports.start = start;
