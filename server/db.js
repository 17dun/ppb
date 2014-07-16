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
	connection.query('SELECT * from user limit 0,10', function(err, rows) {
	 res.write('loadUserList('+JSON.stringify(rows)+')');
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
    var data=fs.readFileSync('test.txt','utf-8');
    var names = data.split('*');
    var item = 0;
    for(var i=0,len=names.length;i<len;i++){
        var sql ='UPDATE `user` SET `name`="'+names[item]+'" WHERE `id`in (select u.id from (SELECT * FROM `user` WHERE name=\'\' limit 1) as u)';
        connection.query(sql, function(err, rows) {
            if(rows.changedRows==0){
                connection.query('INSERT INTO `user`(`name`) VALUES ("'+names[item]+'")', function(err, rows) {

                });
            }
            item++;
            res.end();
        });
    }  
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
    downLoadImg:downLoadImg
};
