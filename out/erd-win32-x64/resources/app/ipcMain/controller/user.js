const Result = require('../utils/result');
const userServer = require('../server/user');

module.exports = {
  /**
   * 登录账号验证
   */
  signin: (event, params = {}) => {
    const eve = event;
    const { userName = '', password = '' } = params || {};
    try {
      const userList = userServer.query();
      const exsitUser = userList.find(user => user.userName === userName);
      if (!exsitUser) {
        eve.returnValue = Result.error('账号不存在，请重新输入！');
      } else if (exsitUser.password !== password) {
        eve.returnValue = Result.error('账号密码不匹配，请重新输入！');
      } else {
        eve.returnValue = Result.success({ ...exsitUser, password: null });
      }
    } catch (err) {
      eve.returnValue = Result.error(err.toString());
    }
  },

  /**
   * 注册账号
   */
  signup: (event, params = {}) => {
    const eve = event;
    const { userName = '' } = params || {};
    try {
      const userList = userServer.query();
      if (userList.some(user => user.userName === userName)) {
        eve.returnValue = Result.error('账号已占用，请重新输入！');
      } else {
        const ret = userServer.save(params);
        eve.returnValue = Result.success(ret);
      }
    } catch (err) {
      eve.returnValue = Result.error(err.toString());
    }
  },
};
