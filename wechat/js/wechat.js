// 初始化
var api_url = '/wechat/api/';
var wechat = [];
var friend = [];
$('.sidestrip_icon').hide();
$('.wx_search').hide();
$('#talkbox').hide();
$(function () {
	// 检测是否登录
	function checkLogin(data)
	{
		if (data.code == -200)
		{
			alert('请先登录');
			window.location.href = '/wechat/index/login';
			return false;
		}
		return true;
	}

	// 异常处理
	function postError()
	{
		// alert('操作异常，请刷新页面后重新操作');
	}

	// 获取当前登录客服管理的在线的微信帐号列表
	function getWechatList()
	{
		// $.ajax({
		// 	type: "POST",
		// 	url: api_url+'getWechatList',
		// 	data: {},
		// 	dataType: "json",
		// 	success: function (data) {
		// 		if (checkLogin(data) == false) return;
		// 	},
		// 	error: function (data) {
		// 		postError();
		// 	}
		// });
		html = '';
		wxid = 'wxid_xw96svnp57r522';
		nick_name = '幸福';
		head = 'http://wx.qlogo.cn/mmhead/ver_1/2WBBGo68aYoicwDxvMAcwLazZ27b4DZJoGUiadu6ncUU10esKWzoQVk7b9l2RdwIvDibzM8KDIudysyWt5cibQcrcKicqnia9cB82KibiaOPAqcOHqk/0';
		html += '<li class="wechat_ad" wxid="'+wxid+'"><a href="javascript:;"><img src="'+head+'"> <label>'+nick_name+'</label> <span class="success">(在线)</span><b class="new_msg_num">0</b></a></li>'
		$('.weuser ul').html(html);
	}

	// 获取指定微信帐号信息
	function getWechatInfo(wxid)
	{
		// $.ajax({
		// 	type: "POST",
		// 	url: api_url+'getWechatList',
		// 	data: {'wxid': wxid},
		// 	dataType: "json",
		// 	success: function (data) {
		// 		if (checkLogin(data) == false) return;
		// 	},
		// 	error: function (data) {
		// 		postError();
		// 	}
		// });
		wechat = {
			'wxid': 'wxid_xw96svnp57r522',
			'nick_name': '幸福',
			'head': 'http://wx.qlogo.cn/mmhead/ver_1/2WBBGo68aYoicwDxvMAcwLazZ27b4DZJoGUiadu6ncUU10esKWzoQVk7b9l2RdwIvDibzM8KDIudysyWt5cibQcrcKicqnia9cB82KibiaOPAqcOHqk/0',
			'sf': '',
			'cs': '',
		}
		wxid = wechat.wxid;
		nick_name = wechat.nick_name;
		head = wechat.head;
		sf = wechat.sf;
		cs = wechat.cs;
		// 当前微信帐号的页面数据填充
		$('.own_head').html('<img src="'+head+'" alt="" style="width: 34px;height: 34px;" />');
		$('.own_name').html(nick_name+'<img src="images/icon/head.png" alt="" />');
		$('.own_numb').html('微信号：'+wxid);
		$('.own_head_bottom p').html('<span>地区</span>'+sf+' '+cs);
		$('.own_head_top .head').attr('src', head);
		// 点击消息列表
		$('.wechat_message').click();
	}

	// 获取消息列表
	// 按时间倒序(接收、发送)
	function getMessageList()
	{
		// $.ajax({
		// 	type: "POST",
		// 	url: api_url+'getMessageList',
		// 	data: {'wxid': wechat.wxid},
		// 	dataType: "json",
		// 	success: function (data) {
		// 		if (checkLogin(data) == false) return;
		// 	},
		// 	error: function (data) {
		// 		postError();
		// 	}
		// });
		var html = '';
		wxid = 'wxid_xw96svnp57r622';
		nick_name = '风华';
		head = 'http://wx.qlogo.cn/mmhead/ver_1/uVVhEeHK2WWhAQMx8OmsEIWvAATEJMPGZHMgBdooX10hrbW0W0VGBkmZaDKBicXNstAaq724qeLibxQksibicvb8V4rSxw8nibEdQhkmp7uQLbD0/132';
		content = '你好...';
		crtime = '3小时前';
		new_msg_num = 1;
		// 页面数据填充
		css = 'show';
		if (new_msg_num == 0) css = 'hide';
		html += '<li class="user_list_lo" wxid="'+wxid+'" nick_name="'+nick_name+'"><div class="user_head"><img src="'+head+'"/></div>' +
				'<div class="user_text"><p class="user_name">'+nick_name+'</p><p class="user_message">'+content+'</p> </div>' +
				'<div class="user_time">'+crtime+'</div><b class="fri_new_msg_num '+css+'">'+new_msg_num+'</b></li>';
		$('#message_list').html(html);
	}

	// 好友列表
	function getFriendsList()
	{
		// $.ajax({
		// 	type: "POST",
		// 	url: api_url+'getFriendsList',
		// 	data: {'wxid': wechat.wxid},
		// 	dataType: "json",
		// 	success: function (data) {
		// 		if (checkLogin(data) == false) return;
		// 	},
		// 	error: function (data) {
		// 		postError();
		// 	}
		// });
		var html = '';
		wxid = 'wxid_xw96svnp57r622';
		nick_name = '风华';
		head = 'http://wx.qlogo.cn/mmhead/ver_1/uVVhEeHK2WWhAQMx8OmsEIWvAATEJMPGZHMgBdooX10hrbW0W0VGBkmZaDKBicXNstAaq724qeLibxQksibicvb8V4rSxw8nibEdQhkmp7uQLbD0/132';
		html += '<div class="friends_box" wxid="'+wxid+'" nick_name="'+nick_name+'">\n' +
				'<div class="user_head"><img src="'+head+'"/></div><div class="friends_text"><p class="user_name">'+nick_name+'</p></div></div>';
		$('#friends_list li').html(html);
	}

	// 群列表
	function getChatroomList()
	{
		// $.ajax({
		// 	type: "POST",
		// 	url: api_url+'getChatroomList',
		// 	data: {},
		// 	dataType: "json",
		// 	success: function (data) {
		// 		if (checkLogin(data) == false) return;
		// 	},
		// 	error: function (data) {
		// 		postError();
		// 	}
		// });
		var html = '';
		wxid = '2159005123@chatroom';
		nick_name = '姐妹们';
		head = 'http://wx.qlogo.cn/mmcrhead/5cJ329xUeTz43ub5lLv2W4eicevJMicUeq8E8ibd4WgK19SkQ77SZcFok2aGAjCSNFq4fiaItdxAYaAkETICCcjic2tBDIevOfIX7/0';
		html += '<div class="friends_box" wxid="'+wxid+'" nick_name="'+nick_name+'">\n' +
				'<div class="user_head"><img src="'+head+'"/></div><div class="friends_text"><p class="user_name">'+nick_name+'</p></div></div>';
		$('#chatroom_list li').html(html);
	}

	// 获取与指定好友或群的聊天记录列表
	// 接口返回两部分数据 好友或群的资料和聊天记录
	function getTalkMessageList(wxid)
	{
		// $.ajax({
		// 	type: "POST",
		// 	url: api_url+'getTalkMessageList',
		// 	data: {'wxid': wxid},
		// 	dataType: "json",
		// 	success: function (data) {
		// 		if (checkLogin(data) == false) return;
		// 	},
		// 	error: function (data) {
		// 		postError();
		// 	}
		// });
		friend = {
			'wxid': 'wxid_xw96svnp57r622',
			'nick_name': '风华',
			'head': 'http://wx.qlogo.cn/mmhead/ver_1/uVVhEeHK2WWhAQMx8OmsEIWvAATEJMPGZHMgBdooX10hrbW0W0VGBkmZaDKBicXNstAaq724qeLibxQksibicvb8V4rSxw8nibEdQhkmp7uQLbD0/132',
			'sf': '',
			'cs': '',
		}
		message = {'msg_tp': 1, 'from': 'wxid_xw96svnp57r622', 'to': 'wxid_xw96svnp57r522', 'content': '你好'};
		pushMessageBox(message);
		message = {'msg_tp': 1, 'from': 'wxid_xw96svnp57r522', 'to': 'wxid_xw96svnp57r622', 'content': '你好...'};
		pushMessageBox(message);
	}

	// 发送消息
	function sendMessage(message)
	{
		// $.ajax({
		// 	type: "POST",
		// 	url: api_url+'sendMessage',
		// 	data: message,
		// 	dataType: "json",
		// 	success: function (data) {
		// 		if (checkLogin(data) == false) return;
		// 	},
		// 	error: function (data) {
		// 		postError();
		// 	}
		// });
		pushMessageBox(message);
	}

	// ==========================================
	// 初始化微信界面
	function init_chatbox(obj)
	{
		wxid = obj.attr('wxid');
		obj.addClass('user_active');
		$('.windows_top_box span').html(obj.attr('nick_name'));
		$('#talkbox').show();
		$('#chatbox').html('');
		getTalkMessageList(wxid);
	}

	// 获取与指定好友的聊天记录
	function getMessageContent(message)
	{
		msg_tp = message.msg_tp;
		content = message.content;
		switch (msg_tp)
		{
			case 1:
				break;
			case 3:
				content = '<img src="'+content.thumb+'" class="msg_content_img" />';
				break;
			case 34:
				content = '<audio src="'+content.file+'" controls="controls">'+content.ms+'</audio><br><a href="'+content.file+'" target="_blank">下载</a>';
				break;
			case 43:
				break;
		}
		return content;
	}

	// push聊天记录到窗口
	function pushMessageBox(message)
	{
		var html = '';
		message_content = getMessageContent(message);
		if (message.from == wechat.wxid)
			html += '<li class="me"><img class="msg_head" src="'+wechat.head+'" title="'+wechat.nick_name+'"><span>'+message_content+'</span></li>';
		if (message.from == friend.wxid)
			html += '<li class="other"><img class="msg_head" src="'+friend.head+'" title="'+friend.nick_name+'"><span>'+message_content+'</span></li>';
		$('#chatbox').append(html);
	}

	// ==========================================
	getWechatList();
	// 点击微信帐号
	$('.wechat_ad').click(function () {
		getWechatInfo($(this).attr('wxid'));
		$('.wechat_ad').removeClass('acte');
		$(this).addClass('acte');
		$('.sidestrip_icon').show();
		$('.wx_search').show();
	});
	// 点击消息图标 获取消息列表数据
	$('.wechat_message').click(function () {
		getMessageList();
	});
	// 点击好友图标 获取好友列表数据
	$('.wechat_friends').click(function () {
		getFriendsList();
	});
	// 点击群图标 获取群列表数据
	$('.wechat_chatroom').click(function () {
		getChatroomList();
	});
	// 点击消息、好友。群列表，获取聊天记录
	$('body').delegate('.user_list_lo', 'click', function () {
		$('.user_list_lo').removeClass('user_active');
		$(this).find('b.fri_new_msg_num').text(0).hide();
		init_chatbox($(this));
	});
	$('body').delegate('.friends_box', 'click', function () {
		$('.friends_box').removeClass('user_active');
		init_chatbox($(this));
	});

	// ===========================================
	// emoji 操作
	var emoji_box = 0;
	$('.emoji').click(function () {
		if (emoji_box == 0)
		{
			emoji_box = 1;
			$('.emoji_box').show();
			msg_file_box = 0;
			$('.msg_file_box').hide();
		}
		else
		{
			emoji_box = 0;
			$('.emoji_box').hide();
		}
	});
	$('.emoji_box a').click(function () {
		var v = $(this).attr('val');
		emoji_box = 0;
		$('.emoji_box').hide();
		$('#input_box').insertAtCaret(v);
	});
	// ------------------------------------------------
	// 图片、语音、视频 操作
	var msg_file_box = 0;
	$('.msg_file').click(function () {
		if (msg_file_box == 0)
		{
			msg_file_box = 1;
			$('.msg_file_box').show();
			emoji_box = 0;
			$('.emoji_box').hide();
		}
		else
		{
			msg_file_box = 0;
			$('.msg_file_box').hide();
		}
	});
	$('#msg_file_content').change(function () {
	});

	// ======================================
	// 发送消息动作
	$('#send').click(function () {
		var content = $('#input_box').val();
		switch (message_tp) {
			case 1:
				if (content == '')
				{
					return '';
				}
				else
				{
					$('#input_box').val('');
					$('#chatbox').append('<li class="me"><img class="msg_head" title="'+wechat.nick_name+'" src="'+wechat.head1+'"><span>'+content+'</span></li>');
					sendFriendMessages(0, {}, message_tp, friend_id, content);
				}
				break;
			case 0:
				sendFileMessage();
				break;
		}
		message_tp = 1;
		msg_file_box = 0;
		emoji_box = 0;
		$('.emoji_box').hide();
		$('.msg_file_box').hide();
	});









	// //-------------------------------------------------
	
	
	// //---------------------------------------------------
	// // ------------------------------------------------
	// //----------------------------------------------------
	
	// function sendFileMessage()
	// {
	// 	var file_type = $('#msg_file_content')[0].files[0]['type'];
	// 	if (file_type == '')
	// 	{
	// 		ftmp = $('#msg_file_content')[0].files[0]['name'].split('.');
	// 		if (ftmp)
	// 			file_type = ftmp[ftmp.length-1];
	// 	}
	// 	if (file_type == '')
	// 	{
	// 		alert('文件格式错误！');
	// 		return;
	// 	}
	// 	if (file_type == 'image/jpeg' || file_type == 'image/jpg' || file_type == 'image/png')
	// 		message_tp = 3;
	// 	if (file_type == 'silk')
	// 		message_tp = 34;
	// 	if (file_type == 'video/mp4')
	// 		message_tp = 43;
	// 	if (message_tp == 0)
	// 	{
	// 		message_tp = 1;
	// 		$('#msg_file_content').val('');
	// 		return;
	// 	}
	// 	var formData = new FormData();
	// 	formData.append('msg_tp', message_tp);
	// 	formData.append('fid', friend_id);
	// 	formData.append('wechat_id', wechat_id);
	// 	formData.append('file', $('#msg_file_content')[0].files[0]);
	// 	msg_tp = message_tp;
	// 	$.ajax({
	// 		url: '/wechat/api/sendFriendMessages',
	// 		type: 'POST',
	// 		cache: false,
	// 		data: formData,
	// 		dataType: 'json',
	// 		processData: false,
	// 		contentType: false
	// 	}).done(function(res) {
	// 		$('#chatbox').append('<li class="me"><img class="msg_head" title="'+wechat.nick_name+'" src="'+wechat.head1+'"><span>'+getMessageContent(msg_tp, res['msg']['content'])+'</span></li>');
	// 		message_tp = 1;
	// 		$('#msg_file_content').val('');
	// 	}).fail(function(res) {
	// 		message_tp = 1;
	// 		$('#msg_file_content').val('');
	// 	});
	// }

	// // ------------------------------------------------
	// // ------------------------------------------------
	// // 快捷消息 操作

	// // ------------------------------------------------
	// // ------------------------------------------------
	



	// // ------------------------------------------------
	// // 同步消息操作
	// // ------------------------------------------------
	// // 同步列表微信新消息数量
	// function syncListNewMessageNum(bool=0, data={})
	// {
	// 	if (bool == 0)
	// 		post('syncListNewMessageNum', {}, syncListNewMessageNum);
	// 	else
	// 	{
	// 		for (i=0; i<data.msg.length; i++)
	// 		{
	// 			if (data.msg[i].new_msg_num > 0)
	// 			{
	// 				$('.new_msg_num_'+data.msg[i].wechat_id).text(data.msg[i].new_msg_num);
	// 				$('.new_msg_num_'+data.msg[i].wechat_id).show();
	// 			}
	// 			else
	// 			{
	// 				$('.new_msg_num_'+data.msg[i].wechat_id).text(0);
	// 				$('.new_msg_num_'+data.msg[i].wechat_id).hide();
	// 			}
	// 		}
	// 	}
	// }
	// // ------------------------------------------------
	// // // 定时同步左侧微信列表新消息数量
	// // timer = setInterval(function(){
	// // 	syncListNewMessageNum();
	// // }, 1000*12);
	// // syncListNewMessageNum();
	// // // ------------------------------------------------
	// // // 定时同步微信消息列表新消息数量
	// // timer = setInterval(function(){
	// // 	if (wechat_id > 0)
	// // 		getMessages();
	// // }, 1000*10);
	// // ------------------------------------------------
	// // 定时同步微信聊天信息窗口
	// // timer = setInterval(function(){
	// // 	if (friend_id > 0)
	// // 		getFriendMessages(0, {}, friend_id);
	// // }, 1000*8);
	// // ------------------------------------------------
	// // 同步消息操作
	// // ------------------------------------------------

});