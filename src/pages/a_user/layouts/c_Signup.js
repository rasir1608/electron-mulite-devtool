import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal, message } from 'antd';
import { Link, routerRedux } from 'dva/router';
import './b_signin.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
class Signup extends React.PureComponent {
  submitSignup = () => {
    const {
      form: { validateFields, resetFields },
    } = this.props;
    validateFields(async (err, values) => {
      if (err) return;
      const { dispatch } = this.props;
      const { password, subPassword, userName } = values;
      if (password !== subPassword) {
        message.error('两次密码输入不一致，请重新输入');
        return;
      }
      const ret = await dispatch({
        type: 'user/signup',
        payload: { password, userName },
      });
      const { msg, ok } = ret;
      if (ok) {
        Modal.success({
          title: '成功',
          content: '账号注册成功，请登录！',
          centered: true,
          onOk: () => {
            dispatch(routerRedux.replace({ pathname: '/user/signin' }));
          },
        });
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
              })(<Input placeholder="请输入账号" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码', whitespace: true }],
              })(<Input placeholder="请输入密码" type="password" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('subPassword', {
                rules: [{ required: true, message: '请重新输入密码', whitespace: true }],
              })(<Input placeholder="请重新输入密码" type="password" />)}
            </FormItem>
            <FormItem>
              <div className="ra-user-action">
                <Link to="/user/signin">返回登录</Link>
              </div>
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.submitSignup}>
                注册
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Signup;
