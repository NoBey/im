var User = {};

// 验证用户已登陆
User.check = function (req, res, next){
  if (!req.session.user) {
    res.json({
      status: -1,
      msg: "尚未登陆，请先登录。"
    })
    res.end()
  }
  next()
}







module.exports = User;
