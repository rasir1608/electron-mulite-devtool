import React from 'react';
import { Modal, Form, Input, Icon, message } from 'antd';
import { connect } from 'dva';
import './index.less';

const { Item: FormItem } = Form;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
@Form.create()
@connect(() => ({}))
class CreateModal extends React.PureComponent {
  state = {};

  componentDidUpdate(preProps) {
    const { visible: preVisible } = preProps;
    const { visible } = this.props;
    if (!preVisible && visible) {
      const {
        form: { resetFields },
      } = this.props;
      resetFields();
    }
  }

  choosePath = async () => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    const path = await dispatch({
      type: 'work/getWorkSpacePath',
    });
    if (path) setFieldsValue({ path });
  };

  onSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      onClose = () => {},
      onOk = () => {},
    } = this.props;
    validateFields(async (errors, values) => {
      if (errors) return;
      const ret = await dispatch({
        type: 'work/saveWorkSpace',
        payload: values,
      });
      if (ret) {
        message.success('会话新建成功！');
        onOk(ret);
        onClose();
      }
    });
  };

  validatorName = async (rule, value, callback) => {
    const { dispatch } = this.props;
    const ret = await dispatch({ type: 'work/checkWorkName', payload: `${value || ''}`.trim() });
    if (ret) callback();
    else callback('名称已被使用，请重新输入！');
  };

  render() {
    const {
      visible,
      onClose = () => {},
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal title="新建会话" centered visible={visible} onCancel={onClose} onOk={this.onSubmit}>
        <Form {...formItemLayout}>
          <FormItem label="会话名称">
            {getFieldDecorator('name', {
              validateTrigger: 'onBlur',
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: '会话名称不能为空',
                  whitespace: true,
                },
                {
                  message: '最大不能超过15个字符',
                  max: 15,
                },
                {
                  validator: this.validatorName,
                },
              ],
            })(<Input placeholder="请填写会话名称" />)}
          </FormItem>
          <FormItem label="执行代码">
            {getFieldDecorator('code', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: '代码栏不能为空',
                  whitespace: true,
                },
              ],
            })(
              <Input.TextArea
                autosize={{ minRows: 4, maxRows: 6 }}
                placeholder="请填写要执行的代码，语句间以分号做为分隔"
              />
            )}
          </FormItem>
          <FormItem label="执行代码">
            {getFieldDecorator('path', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: '文件夹路径不能为空',
                  whitespace: true,
                },
              ],
            })(
              <Input
                placeholder="请输入工作区文件夹路径"
                allowClear
                addonAfter={
                  <Icon
                    type="folder-add"
                    title="选择路径"
                    style={{ cursor: 'pointer' }}
                    onClick={this.choosePath}
                  />
                }
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default CreateModal;
