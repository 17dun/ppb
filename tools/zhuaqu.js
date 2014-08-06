var script = document.createElement( 'script' );
script.onload=function(){getData()};
script.src = 'http://127.0.0.1/jquery.js';
document.body.appendChild(script);
function getData(){
	setTimeout(function(){
		var str = '';
		console.log($);
		var list = $('.cnfList li');
		var result = [];
		$.each(list,function(i,item){
			console.log(item);
			var img = $(item).find('.face img').attr('src');
			var name = $(item).find('.name a').html();
			var info = $(item).find('.info').html();
			var _obj = {
				name : name,
				img : img,
				info : info
			};
			result.push(JSON.stringify(_obj));
		})
		var thisStr = result.join(',')
		var lastStr = localStorage.nameData;
		if(!lastStr){
			localStorage.nameData = thisStr;
		}else{
			localStorage.nameData = lastStr+','+str;
		}
		var page = location.href.split('page=')[0]+'page='+(location.href.split('page=')[1]*1+1)
		location.href=page;

	}, 2000);
}

