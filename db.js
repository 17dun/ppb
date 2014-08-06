/*
  数据服务调用
*/

var mysql = require('mysql');
var http = require('http');
var url = require('url');
var fs=require('fs');  
var request = require('request');
var querystring = require('querystring');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ppq'
});


function getUserList(req,res){
	connection.query('SELECT * from user limit 0,100', function(err, rows) {
	 res.write(JSON.stringify(rows));
	 res.end();
	});
}
function getPlaceList(req,res){
	connection.query('SELECT * from place limit 0,10', function(err, rows) {
	 res.write('loadPlaceList('+JSON.stringify(rows)+')');
	  res.end();
	});
}
function setMeet(req,res) {
  	var querys = querystring.parse(url.parse(req.url).query);
  	var sql ='INSERT INTO `ppq`.`meet` (`ownerId`, `title`, `datetime`, `addressId`, `sex`, `pay`) VALUES (1,"'+querys.title+'","'+querys.date+' '+querys.time+'","'+querys.addressId+'","'+querys.sex+'","'+querys.pay+'")';
	connection.query(sql, function(err, rows) {
		var code=1,message="Ok";
		if(!err){
			code=0;
			message="Error";
		}
	  res.end('callback({code:'+code+',message:"'+message+'"})');
	});
}

function importUserName(req,res){
    var data =  require('./data.json');
    data.forEach(function(item,index){
      var sex = Math.round(Math.random());
      var picSrc = item.img.split('/')[3]+'-180-'+item.img.split('/').slice(5,8).join('-');
       var sql ='UPDATE `user` SET `name`="'+item.name+'", `pic`="'+picSrc+'",`info`="'+item.info+'",`sex`="'+sex+'" WHERE `id`in (select u.id from (SELECT * FROM `user` WHERE name=\'\' limit 1) as u)';
       connection.query(sql, function(err, rows) {
            if(rows.changedRows==0){
                connection.query('INSERT INTO `user`(`name`,`pic`,`info`,`sex`) VALUES ("'+item.name+'","'+picSrc+'","'+item.info+'","'+sex+'")', function(err, rows) {
                });
            }
        });
    })
}

function setUserData(req,res){
  var sql = 'SELECT `id` FROM `user` WHERE `style`=""';
  connection.query(sql, function(err, rows) {
    rows.forEach(function(item,index){
      var num  = item.id%4;
      var sql2 = 'UPDATE `user` SET `style`="'+num+'" WHERE id ='+item.id;
      connection.query(sql2,function(err,rows){
          if(!err){
            console.log(item.id+' is ok');
          }
      })
    })
  })
}




function downLoadImg(){
    fs.readFile('test.txt','utf-8',function(err,data){
    data = eval("("+data.substring(1,data.length)+")");
        data.forEach(function(obj){
            request(obj.img).pipe(fs.createWriteStream('abc.jpg'));
        });
    });
}
module.exports = {
	getUserList : getUserList,
	getPlaceList : getPlaceList,
	setMeet:setMeet,
    importUserName:importUserName,
    downLoadImg:downLoadImg,
    setUserData:setUserData
};
