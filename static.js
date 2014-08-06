/*
    静态文件服务
*/

var port=8080;
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var zlib = require("zlib");
//创建http服务端
var server=http.createServer(function(request,response){
    var obj= url.parse(request.url);
    response.setHeader("Server","Node/V8");
    var pathname=obj.pathname;

    var realPath = path.join("public", path.normalize(pathname.replace(/\.\./g, "")));
    console.log(realPath) ;
    var pathHandle=function(realPath){
    //用fs.stat方法获取文件
        fs.stat(realPath,function(err,stats){
            if(err){
                response.writeHead(404,"not found",{'Content-Type':'text/plain'});
                response.write("the request "+realPath+" is not found");
                response.end();
            }else{
                if(stats.isDirectory()){
                }else{
                    var lastModified = stats.mtime.toUTCString();
                    var ifModifiedSince = "If-Modified-Since".toLowerCase();
                    response.setHeader("Last-Modified", lastModified);
                    if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                        console.log("从浏览器cache里取")
                        response.writeHead(304, "Not Modified");
                        response.end();
                    } else {
                        var raw = fs.createReadStream(realPath);
                        var acceptEncoding = request.headers['accept-encoding'] || "";
                            response.writeHead(200, "Ok");
                            raw.pipe(response);
                    }
                }
            }
        });

    }
    pathHandle(realPath);
});
function start(){
    server.listen(port);
    console.log("静态文件服务启动，端口:"+port);
}
module.exports.start = start;