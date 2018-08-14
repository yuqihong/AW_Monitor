var timeDate = "3";  //代表天数
var isRestart = "10*60*1000"; //代表毫秒数(10分钟)

var AW = {
		getAWReport : function(){
			var ajax={
					url : '/getAWData/',
					success : function(json){
						AW.show_table(json);
					}
				}
				_ajax(ajax);
		},
		
		show_table : function(json){
			var html = "";
			var current = new Date();  //当前时间戳 
			var current_time = formatDate(current); 
			//处理数据
			if(json['users'].length > 0){
				
				html+="<thead><tr><th><i class=\"icon-user\"></i> Anywhere User</th><th class=\"hidden-xs\"><i class=\" icon-info\"></i> Clients Information</th></tr></thead>";
				html+="<tbody>"
				for(var i = 0; i<json['users'].length; i++){
					var data = json['users'][i];
					html+="<tr>";
					html+="<td><li class=\"fa fa-user\"></li>&nbsp;<a href=\"#\" title=\"用户:"+data["user"]["displayName"]+"\">"+data["user"]["displayName"]+"</a>&nbsp;";
					html+="</td>";
					html+="<td class=\"hidden-xs\">";
					html+="<table class=\"table table-striped custom-table table-hover\">";
					
					html+="<thead><tr>";
					html+="<th class=\"hidden-xs\"><i class=\"icon-screen-desktop\"></i> Device Name</th>";
					html+="<th><i class=\"fa fa-bar-chart-o\"></i> OS Type</th>";
					html+="<th><i class=\"fa fa-line-chart\"></i> Version</th>";
					html+="<th class=\"hidden-xs\"><i class=\"icon-clock\"></i> Last Access Time</th>";
					html+="<th class=\"hidden-xs\"><i class=\"fa fa-cogs\"></i> Operation</th>";
					html+="</tr></thead>"
					
					html+="<tbody>";
					//start
					var devList = data["clients"];
					for(var j=0; j<devList.length; j++){
						//获取OS Type
						var os = devList[j]['OS'];
						os = os.toUpperCase();
						html+="<tr>";
						html+="<td class=\"hidden-xs\">"+devList[j]['name'].replace('User Portal','Web UI')+"</td>";
						html+="<td>"+devList[j]['OS']+"</td>";
						html+="<td>"+devList[j]['version'].replace('None','N/A')+"</td>";
						html+="<td><span class=\"label label-primary label-mini\">"+getDate(devList[j]['lastAccess'])+"</span>";
						//计算如果当前时间大于三天则显示
						var holdDate=new Date(getDate(devList[j]['lastAccess']).replace("-", "/").replace("-", "/"));
						var old_time = formatDate(holdDate); 
						var t = GetDateDiff(current_time ,old_time);
						if(t > timeDate && os!='PUBLIC_API' && os!='BROWSER'){
							html+="&nbsp;<li class=\"fa fa-flag\" style=\"color:#f00;\"></li>";
						}
						html+="</td>";
						html+="<td class=\"hidden-xs\">";
						if(os!='PUBLIC_API' && os!='BROWSER'){
							html+="<button class=\"btn btn-success btn-xs\" title=\"发送邮件\" onClick=\"mailsome('"+data["user"]["displayName"]+"','"+devList[j]['name'].replace('User Portal','Web UI')+"','"+getDate(devList[j]['lastAccess'])+"')\"><i class=\"fa fa-envelope\"></i></button>";
							html+="&nbsp;&nbsp;&nbsp;";
							html+="<button class=\"btn btn-primary btn-xs\" title=\"重新启动\"><i class=\"fa fa-wrench\"></i></button>";
						}
						html+="</td>";
						html+="</tr>";
					}
					//over
					html+="</tbody>";
					html+="</table>";
					html+="</td>";
					html+="</tr>";
				}
				html+="</tbody>"
			}else{
				html+= "<thead><tr style=\"color:red;\"><th>暂无内容</th></tr></thead>";
			}
			$('#example').html(html);
			$('#example').DataTable();
		},
}
function getDate(str){
	var date = new Date(str);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate() + ' ';
	h = date.getHours() < 10 ? '0'+(date.getHours()) : " "+date.getHours() + ':';
	m = date.getMinutes() < 10 ? '0'+(date.getMinutes())+":" : date.getMinutes()+ ':';
	s = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds(); 
	var times = Y+M+D+h+m+s;
	return times;
}

//时间戳转换为 普通日期格式
function formatDate(now)   {     
    var   year=now.getFullYear();   //获取获取当前年份  
    var   month=now.getMonth()+1;   //获取获取当前月份
    var   date=now.getDate();       //获取获取当前日期
    var   hour=now.getHours();      //获取时
    var   minute=now.getMinutes();  //获取分  
    var   second=now.getSeconds();  //获取秒
    //时间格式 ：年-月-日   
    return   year+"-"+month+"-"+date;     
}
//计算时间差
function GetDateDiff(startDate,endDate)  {  
    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
    var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
    var dates = Math.floor((startTime - endTime))/(1000*60*60*24);     
    return  dates;    
}
//发送邮件
function mailsome(userName, deviceName, accessTime){
	who=prompt("Enter recipient's email address: ","");
	what=prompt("Enter the subject: ","设备因长时间未启动,需要重新启动程序!");
	body="用户:"+userName+"%0A设备名称:"+deviceName+"%0A最后登录时间为:"+accessTime+"%0A"+"因程序"+timeDate+"天未启动,需要重新启动该程序,谢谢!%0A";
	if (confirm("Are you sure you want to mail "+who+" with the subject of "+what+"?")==true){
		parent.location.href='mailto:'+who+'?subject='+what+'&body='+body+'';
	}
}
/*setInterval("AW.getAWReport();",isRestart);*/
