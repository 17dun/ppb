var http = require("http");
var fs = require("fs");
var data =  require('./data.json');

data.forEach(function(item,index){
	var url = item.img.replace('/50/','/180/');
	var picName = item.img.split('/')[3]+'-180-'+item.img.split('/').slice(5,8).join('-');
	http.get(url, function(res){
    var imgData = "";

    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开


    res.on("data", function(chunk){
        imgData+=chunk;
    });

    res.on("end", function(){
        fs.writeFile("./img/"+picName, imgData, "binary", function(err){
            if(err){
                console.log("down fail");
            }
            console.log("down success");
        });
    });
});
})