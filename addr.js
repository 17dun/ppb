/*
    远程批量下载图片到本地
*/
var http = require("http");
var fs = require("fs");
var data =  require('./data/addr.json');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ppq'
});
var count = 0;
data.forEach(function(item,index){
    item.forEach(function(marker,index2){
        var sql ='INSERT INTO `ppq`.`addr` (`name`, `addr`, `tel`, `city`[p0, `x`,`y`) VALUES ("'+marker.name+'","'+marker.addr+'","'+marker.tel+'","'+marker.city+'","'+marker.x/100+'","'+marker.y/100+'")';
        connection.query(sql, function(err, rows) {
            console.log(count);
            count++;
        });
    })
})
