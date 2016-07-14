var express = require('express');
var router  = express.Router();
// console.log(__dirname)
var User    = require('../curd/user');
var User_mw = require('../middleware/user_mw');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/', User.add); // 添加用户
router.use(User_mw.check)
router.get('/', User.list);  // 获取用户列表
router.get('/:id', User.get); // 获取制定用户信息
router.delete('/:id', User.delete); // 删除指定用户

router.put('/:id', User.update); // 更新指定用户信息

module.exports = router;
