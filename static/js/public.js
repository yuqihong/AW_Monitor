function _ajax(options) {
	// 默认选项
	var defaults = {
		url : "", // action的地址，必填
		data : {}, // 需要传递的参数，可选
		dataType : "JSON", // ajax请求返回类型，默认是JSON，可选
		method : 'POST', //提交表单的形式
		showLoading : true, //是否打开loading，默认关闭
		timeout : 10000, // 超时时间（毫秒） 只有当async=true的情况下，timeout才生效
		loadingMsg:'数据加载中...',// 默认加载状态下的提示
		async : true //在默认的情况下，所有请求都是以同步的方式发送的（值为false）。如果要使用异步方式，需要将此项设置为true
	};
	var options = $.extend({}, defaults, options);
	var index = layer.load(0, {shade: false,content: '加载中...',});
	$.ajax({
		url: options.url,
		type: options.method,
		datatype: options.dataType,
		timeout: options.timeout,
		data: options.data,
		success: function(json) {
			if(options.success!=undefined){
				options.success(eval('(' + json + ')'));
			}
		  layer.close(index);
		},
		error : function(json) {
			if(options.error!=undefined){
				options.error(eval('(' + json + ')'));
			}
			layer.close(index);
			layer.msg("请求数据失败!");
		},
		complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
			if(status == 'timeout') { //超时　　
				layer.msg("请求数据超时!");
			}
		   layer.close(index);
		}
	});
}
function a(){
	alert(1)
}