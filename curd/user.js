var User = require('../model/user.js');
module.exports = {

  // 获取用户列表
  list: function (req, res, next){
    User.find('_id','user').then(function(msg){
      res.json(msg)

    })
  },

  // 获取制定用户信息
  get: function (req, res, next){
    var user = req.param('id')
    User.findOne({user: user}).then(function (msg){
      res.json(msg)
    })
  },

  // 删除指定用户
  delete: function (req, res, next){
    var user = req.param('id')
    User.remove({user: user}).then(function(msg){
      res.json(msg)
    })

  },

  // 添加用户
  add: function (req, res, next){
    var user =  req.body.user
    var password =  req.body.password

    User.findOne({user: user}).then(function(msg){
      if(!msg){
        User({
          user: user,
          password: password
        }).save().then(function (){
          res.json({
            status: 1,
            msg: "注册成功",
            user: user
          })
        });
      }else {
        res.json({
          status: -1,
          msg: "注册失败",
          user: user
        })
      }
    })
  },

  // 更新指定用户信息
  update: function (req, res, next){
    var user =  req.param('id')
    var password = req.body.password
    User.update({user: user},{password: password}).then(function (msg){
      res.json(msg)
    })
  },

  // 用户登陆
  login: function (req, res, next){
    var user =  req.body.user
    var password =  req.body.password
    User.findOne({
      user: user,
      password: password
    }).then(function(msg){
      if(msg){
        req.session.user = user
        req.session.password = password
        res.json({
          status: 1,
          msg: "登陆成功",
          user: user
        })
      }else {
        res.json({
          status: -1,
          msg: "登陆失败"
        })
      }

    })
  }

};
