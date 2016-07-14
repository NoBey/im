var socket = function(io) {
    var online_list = {}
    var io = io
    var User = require('./model/user.js');

    io.on('connection', function(socket) {

        var id = socket.id
        var user

        // 登陆回调
        socket.on('login', function(data) {
            // io.emit('msg', msg);
            User.findOne(data).then(function(result) {
                user = result.user // 设置全局的user
                if (online_list.hasOwnProperty(user)) {
                    return io.sockets.to(id).emit('login', {
                        status: -1,
                        err: '用户已登录'
                    });
                }
                online_list[result.user] = id
                console.log(user + '登陆成功')
                console.log("当前用户list")
                console.log(online_list)
                return io.sockets.to(id).emit('login', {
                    status: 1,
                    msg: '登录成功',
                    user: result.user
                });
            })
        });

        // 连接断开处理
        socket.on('disconnect', function() {
            delete online_list[user]
            console.log(user + '已退出')
            console.log("当前用户list")
            console.log(online_list)

        });

        // 获取当前在线用户信息
        socket.on('online_list', function() {
          var list = online_list
          io.sockets.to(id).emit('creat_user_list', list)
        });

        //
        socket.on('send_user_msg', function(data) {
                console.log(data);
          var send_id = online_list[data.user]
          io.sockets.to(send_id).emit('send_msg', {
            	 	make : 1,
 		            user : user,
		            msg  : data.msg
          })
        });


    });
}

module.exports = socket;
