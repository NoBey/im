
    var socket,     // socket连接
    user_name,      // 当前用户名称
    im_record = {}, // 用户聊天记录数组
    current_name    // 当前聊天的用户
	// 入口函数
	var init = function(){
		var login       = $('#login_btn')      // 获取登陆按钮
		var register    = $('#register_btn')   // 获取注册按钮
		var send_msg    = $('#send_msg')       // 获取发送消息按钮
		var user_online = $('#user_online')    // 全部的在线用户列表id
		var send_text   = $('#send_text')      // 要发送的内容
		// 登陆绑定事件
		login.on('click',function(){
			var user = $('#user').val()
			var password = $('#password').val()
			users.login(user, password)
		})
		
		// 注册绑定事件
		register.on('click',function(){
			var user = $('#user').val()
			var password = $('#password').val()
			users.creat(user, password)
		})
		
		// 绑定用户列表点击事件
		user_online.on('click', 'li', function(){
			var user = $(this).html()
			console.log(user)
			creat_chat(user)
            
			 
		})
		// 绑定聊天提交按钮
		send_msg.on('click', function(e){			
			var msg = send_text.val()
			send_text.val('')
			console.log(msg)
		 	socket.emit('send_user_msg', {
			    	user: current_name,
			    	msg: msg
			})
		 	
		 	if(im_record[current_name] === undefined){
			im_record[current_name] = []
		    }
		 	
		 	im_record[current_name].push({
		 		make: 0,
		      	user: user_name,
			    	msg: msg
		 	})  
		 	
		    creat_chat(current_name) 
		 		 	
		})
		
		// 添加回车发送
		send_text.on('keydown', function(e){
			
			if(e.keyCode == 13){
				e.preventDefault()
				send_msg.click()
			}
		})
		
		// 添加回车登陆 
		$('#user').on('keydown', function(e){
			e.stopPropagation()
			if(e.keyCode == 13){
				e.preventDefault()
				$('#password').focus()
			}
		})
		$('#password').on('keydown', function(e){
			e.stopPropagation()
			if(e.keyCode == 13){
				e.preventDefault()
				login.click()
			}
		})
		
		
		

	
    }
	
	var users = {} // 用户类 对用户的一系列操作
	// 登陆函数
	users.login = function(user, password){
		$.post('/login',{
			user: user,
			password: password
		},
		function(result){
			// 登陆成功的回调
			if(result.status===1){ 
				
			    user_name = user
			    layer.msg(result.msg);
			    socket = io('http://127.0.0.1:3000');
			    socket_init()
			    
			    	socket.emit('login', {
			    	 	user: user,
			    	 	password: password
			    	 })

			    return
			}
			// 登陆成功的回调
			if(result.status===-1){
			    layer.msg(result.msg);
				return
			}
		})	
	}
    // 创建新用户
	users.creat = function(user, password){
		if (user.length < 4 || password < 6) {
			return layer.msg('用户名不得少于4个字符, 密码不得少于6个字符。')
		} 
		
		$.post('/user',{
			user: user,
			password: password
		},
		function(result){
			// 创建成功的回调
			if(result.status===1){ 
			    layer.msg(result.msg);
			    return
			}
			// 创建错误的回调
			if(result.status===-1){
			    layer.msg(result.msg);
				return
			}
		})	
	}
	
	
	
  // 根据聊天记录创建聊天窗口
  function creat_chat(user){
  	var dom = ''
  	// 先清除聊天窗口数据
  	$('#chat_box').html('')
  	for (var k in im_record[user]) {
  		if(im_record[user][k].make === 1){
  			dom += '<div class="l_msg">'
  			dom += '<a href="">'+ im_record[user][k].user + '</a>'
  			dom += '<p>'+ im_record[user][k].msg + '</p></div>'				
  		}
  		if(im_record[user][k].make === 0){
  			dom += '<div class="r_msg">'
  			dom += '<a href="">'+ im_record[user][k].user + '</a>'
  			dom += '<p>'+ im_record[user][k].msg + '</p></div>'	
  		}  		
  		
  	} 
  	current_name = user      // 设置当前聊天用户
  	$('.nav_name').html(current_name)  // 设置nav name
 	$('#chat_box').html(dom) // 添加聊天数据
  	
  }

	
	// socket 回调函数  建立连接后调用
function socket_init(){
	
	// 成功登陆后根据返回信息执行回调
	socket.on('login', function(data){
	   if(data.status === -1){
       	 layer.msg(data.err);
		 return
       }
	   
       if(data.status === 1){
         $('#login').hide()
         $('#im_main').show()
         $('#user_info').find('h4').html(data.user)
        	socket.emit('online_list')
        	setInterval(function(){
        		socket.emit('online_list')
        	}, 10000)
		 return    	
       }
       
    });
    
	// 创建在线用户列表
	socket.on('creat_user_list', function(list){
		delete list[user_name]
		
		var user_online = $('#user_online')	// 获取节点
		var listdom  = ''                   // 用户储存创建出来的节点
		
		for(var k in list){
			listdom += '<li>' + k + '</li>'
		}
		
		user_online.html(listdom)		
		
	})
	
	// 接受消息
//	 data = {
//	 	make : 1,
//		user : user,
//		msg  : msg
//	 }
	 
	socket.on('send_msg', function(data){
		var user = data.user
		console.log(data)
		if(im_record[user] === undefined){
			im_record[user] = []
		}
		im_record[user].push(data)		
		creat_chat(user)
	})
	
	
}

	 
	 
	 
	 

     // socket 回调函数 
	
	init()

