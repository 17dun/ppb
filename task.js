/*
  任务管理脚本
*/
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var port = 8881;
function main(req,res){
  var arg  = url.parse(req.url).query;
    var method = querystring.parse(arg).method;
    if(method=='restart'){
       process.exec('restart.sh');
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