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
  password : '5851204',
  database : 'ppq'
});


function getUserList(req,res){
	connection.query('SELECT * from user order by `id` desc limit 0,30', function(err, rows) {
	  res.end(JSON.stringify(rows));
	});
}

function getUserInfo(req,res){
	var querys = querystring.parse(url.parse(req.url).query);
	var id = querys.id;
	connection.query('SELECT * from user WHERE `id`='+id, function(err, rows) {
	  res.end(JSON.stringify(rows));
	});
}

function getPlaceInfo(req,res){
	var querys = querystring.parse(url.parse(req.url).query);
	var id = querys.id;
	connection.query('SELECT * from addr WHERE `id`='+id, function(err, rows) {
		getNewOneAddrCommentById(id,rows,res);
	});
}
function getMeetInfo(req,res){
  var querys = querystring.parse(url.parse(req.url).query);
  var id = querys.id;
  connection.query('SELECT m.id,m.user_id,m.time,m.people_num,m.add_id,m.type_demand,m.sex_demand,m.age_demand,m.skills_demand,m.site_fee,m.topic,DATE_FORMAT(m.date_created,\'%Y-%m-%d %h:%m:%s\') as date_created,DATE_FORMAT(m.date_modified,\'%Y-%m-%d %h:%m:%s\') as date_modified,a.name as add_name,a.addr,a.tel,u.name as user_name,u.sex,u.pic from meet m , user u ,addr a where m.user_id=u.id and m.add_id = a.id and m.id='+id, function(err, rows) {
   getMeetUsersByMeetId(id,rows,res);
  });
}
function getMeetUsersByMeetId(id,data,res){
  connection.query('SELECT mu.id,mu.user_id,mu.meet_id,mu.is_leader,DATE_FORMAT(mu.date_created,\'%Y-%m-%d %h:%m:%s\') as date_created,u.pic FROM `meet_users` mu ,`user` u where mu.user_id = u.id and mu.meet_id ='+id, function(err, rows) {
      data[0].meetUsers = rows;
      res.end(JSON.stringify(data[0]));
    });
}
function getNewOneAddrCommentById(id,data,res){
    connection.query('SELECT u.name,a.comment,a.start,a.time FROM `addr_comment`as a inner join `user` as u on a.user_id=u.id WHERE addr_id='+id+' order by time desc limit 0,1', function(err, rows) {
      data[0].lastcomment = rows[0];
      res.end(JSON.stringify(data[0]));
    });
}

function forPonit(pos,dis){
	var x = pos.x;
	var y = pos.y;
	var dm = (dis/2)*Math.sqrt(2);
	return {
		'x1': Math.floor(x*1-dm),
		'x2': Math.floor(x*1+dm),
		'y1': Math.floor(y*1-dm),
		'y2': Math.floor(y*1+dm)
	}
}

function getPlaceList(req,res){
	connection.query('SELECT * from addr WHERE 1=1 limit 20', function(err, rows) {
	  res.end(JSON.stringify(rows));
	});
}




function getContentList(req,res){
  connection.query('SELECT c.*,u.name,u.score,u.ballage,u.pic FROM `content` c ,user u where c.user_id = u.id limit 20', function(err, rows) {
    res.end(JSON.stringify(rows));
  });
}


function getPlaceListByDis(req,res){
  var querys = querystring.parse(url.parse(req.url).query);
  var pos = {x:querys.x,y:querys.y};
  var dis = querys.dis;
  var rtArr = forPonit(pos,dis);
  connection.query('SELECT * FROM `addr`where x between '+rtArr.x1+' and '+rtArr.x2+' and y between '+rtArr.y1+' and '+rtArr.y2, function(err, rows) {
    res.end(JSON.stringify(rows));
  });
}
function getMeetListByDis(req,res){
  var querys = querystring.parse(url.parse(req.url).query);
  var pos = {x:querys.x,y:querys.y};
  var dis = querys.dis;
  var rtArr = forPonit(pos,dis);
  connection.query('SELECT m.id,m.user_id,m.time,m.people_num,m.add_id,m.type_demand,m.sex_demand,m.age_demand,m.skills_demand,m.site_fee,m.topic,DATE_FORMAT(m.date_created,\'%Y-%m-%d %h:%m:%s\') as date_created,DATE_FORMAT(m.date_modified,\'%Y-%m-%d %h:%m:%s\') as date_modified,a.name as add_name,a.addr,a.tel,a.x,a.y,u.name as user_name,u.sex,u.pic from meet m , user u ,addr a where m.user_id=u.id and m.add_id = a.id  and a.x between '+rtArr.x1+' and '+rtArr.x2+' and a.y between '+rtArr.y1+' and '+rtArr.y2, function(err, rows) {
    res.end(JSON.stringify(rows));
  });
}
function getUserListByDis(req,res){
  var querys = querystring.parse(url.parse(req.url).query);
  var pos = {x:querys.x,y:querys.y};
  var dis = querys.dis;
  var rtArr = forPonit(pos,dis);
  connection.query('SELECT * FROM `user`where x between '+rtArr.x1+' and '+rtArr.x2+' and y between '+rtArr.y1+' and '+rtArr.y2, function(err, rows) {
    res.end(JSON.stringify(rows));
  });
}

function getAddrCommentsById(req,res){
    var querys = querystring.parse(url.parse(req.url).query);
    connection.query('SELECT u.name,a.comment,a.start,a.time FROM `addr_comment`as a inner join `user` as u on a.user_id=u.id WHERE addr_id='+querys.id+' order by time desc limit 0,20', function(err, rows) {
      res.end(JSON.stringify(rows));
    });
}
function setMeet(req,res) {
	var querys = querystring.parse(url.parse(req.url).query);
  var date = new Date();
  var datetime = dateformat(date,'yyyy-MM-dd hh:mm:ss');
	var sql =' CALL `sp_setMeet`(' +querys.user_id+',' +querys.add_id+',"'+querys.time+'","'+querys.people_num+'","'+querys.type_demand+'","'+querys.sex_demand+'","'+querys.age_demand+'","'+querys.skills_demand+'","'+querys.site_fee+'","'+datetime+'")';
	connection.query(sql, function(err, rows) {
		var code=1,message="Ok";
		if(!err){
			code=0;
			message="Error";
		}
	  res.end('callback({code:'+code+',message:"'+message+'"})');
	});
}

function setMeetUsers(req,res) {
  var querys = querystring.parse(url.parse(req.url).query);
  var date = new Date();
  var datetime = dateformat(date,'yyyy-MM-dd hh:mm:ss');
  var sql ='INSERT INTO `ppq`.`meet_users` (`user_id`, `meet_id`, `is_leader`, `date_created`) VALUES ("'+querys.user_id+'","'+querys.meet_id+'","'+querys.is_leader+'","'+datetime+'")';
  connection.query(sql, function(err, rows) {
    var code=1,message="Ok";
    if(!err){
      code=0;
      message="Error";
    }
    res.end('callback({code:'+code+',message:"'+message+'"})');
  });
}

function setAddrComment(req,res) {
    var querys = querystring.parse(url.parse(req.url).query);
    var sql ='INSERT INTO `ppq`.`addr_comment` (`user_id`, `addr_id`, `comment`, `time`, `start`) VALUES ("'+querys.user_id+'","'+querys.addr_id+'","'+querys.comment +'","'+querys.time +'","'+querys.start+'")';
    connection.query(sql, function(err, rows) {
        var code=1,message="Ok";
        if(!err){
            code=0;
            message="Error";
        }
      res.end(JSON.stringify(rows));
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

function setXY(req,res){
  var sql = 'SELECT `id` FROM `user`';
  var point = {
  	x:12950092,
  	y:4823386
  }
  connection.query(sql, function(err, rows) {
    rows.forEach(function(item,index){
      var xF = Math.random()>0.5?-1:1;
      var yF = Math.random()>0.5?-1:1;
      var xDis = Math.random()*20000*xF;
      var yDis = Math.random()*20000*yF;
      var x = point.x + xDis;
      var y = point.y + yDis;
      var sql2 = 'UPDATE `user` SET `x`="'+x+'", `y`="'+y+'" WHERE id ='+item.id;
      connection.query(sql2,function(err,rows){
          if(!err){
            console.log(item.id+' is ok');
          }
      })
    })
  })
}
function dateformat(date, format) {
  if(!date){
    return '';
  }
    date = new Date(date-0);
    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
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
	getUserInfo : getUserInfo,
	getPlaceInfo : getPlaceInfo,
	setMeet:setMeet,
    setAddrComment:setAddrComment,
    importUserName:importUserName,
    downLoadImg:downLoadImg,
    setUserData:setUserData,
    getAddrCommentsById:getAddrCommentsById,
    getPlaceListByDis:getPlaceListByDis,
    setXY:setXY,
    getUserListByDis:getUserListByDis,
    getMeetListByDis:getMeetListByDis,
    getMeetInfo:getMeetInfo,
    setMeetUsers:setMeetUsers,
    getContentList:getContentList
};
