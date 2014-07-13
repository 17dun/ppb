var mysql = require('mysql');
var url = require('url');
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
module.exports = {
	getUserList : getUserList,
	getPlaceList : getPlaceList,
	setMeet:setMeet
};
