import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal } from 'antd';
import { Link, routerRedux } from 'dva/router';
import './b_signin.less';

// const {
//   electron: { ipcRenderer },
// } = window;
// const {shell} = require('electron')

const FormItem = Form.Item;

@Form.create()
@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
class Signin extends React.PureComponent {

  notification = async () => {
    let myNotification = new Notification('标题', {
      body: '通知正文内容'
    })
    myNotification.onclick = () => {
      console.log('通知被点击')
      // shell.openExternal(option.href)
    }
    console.log(28,myNotification)

    const { dispatch } = this.props;
    const ret = await dispatch({
      type:'user/test',
    });
    console.log(ret)
  }

  submitLogin = () => {
    const {
      form: { validateFields, resetFields },
    } = this.props;

    validateFields( async (err, values) => {
      if (err) return;
      const { dispatch } = this.props;
      const ret = await dispatch({
        type:'user/signin',
        payload:values
      });
      const { msg, ok, data } = ret;
      if (ok) {
        dispatch({
          type: 'user/update',
          payload: { currentUser: data },
        });
        dispatch(routerRedux.replace({ pathname: '/user/mine' }));
      } else {
        Modal.error({
          title: '',
          content: msg,
          centered: true,
          onOk: () => {
            resetFields();
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className="ra-user-sigin">
        <h3>登录</h3>
        <div>
          <Form>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入账号', whitespace: true }],
              })(<Input placeholder="账号" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码', whitespace: true }],
              })(<Input placeholder="密码" type="password" />)}
            </FormItem>
            <FormItem>
              <div className="ra-user-action">
                <Link to="/user/signup">没有账号？</Link>
                <Link to="/user/signup">忘记密码？</Link>
              </div>
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.submitLogin}>
                登录
              </Button>
            </FormItem>
          </Form>
          <Button onClick={this.notification}>点击</Button>
        </div>
      </div>
    );
  }
}

export default Signin;
