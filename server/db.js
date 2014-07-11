var mysql = require('mysql');
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
	  res.end(rows);
	});
}

module.exports = {
	getUserList : getUserList,
	getPlaceList : getPlaceList
};
