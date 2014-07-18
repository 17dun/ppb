var http = require('http');
var fs = require('fs');
var url = "http://s0.hao123img.com/res/img/logo/logonew.png";
http.get(url, function(res){
    var imgData = "";
    res.setEncoding("binary"); 
    res.on("data", function(chunk){
        imgData+=chunk;
    });
    res.on("end", function(){
        fs.writeFile("logonew.png", imgData, "binary", function(err){
            if(err){
                console.log("down fail");
            }
            console.log("down success");
        });
    });
});