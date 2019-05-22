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
    const { modalType: preModalType } = preProps;
    const { modalType } = this.props;
    const {
      form: { resetFields, setFieldsValue },
      workSpace = {},
    } = this.props;
    if (preModalType === 'none' && modalType === 'create') {
      resetFields();
    } else if (preModalType === 'open' && modalType === 'edite') {
      const { name, url, code, path } = workSpace;
      setFieldsValue({ name, path, code, url: (url || '').replace(/^http:\/\//i, '') });
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
      modalType = 'none',
      workSpace = {},
      form: { validateFields },
      onClose = () => {},
      onOk = () => {},
    } = this.props;
    validateFields(async (errors, values) => {
      if (errors) return;
      const payload = Object.assign({}, workSpace, values, {
        url: values.url ? `http://${values.url}` : '',
      });
      const ret = await dispatch({
        type: 'work/saveWorkSpace',
        payload,
      });
      if (ret) {
        if (modalType === 'create') {
          message.success('会话新建成功！');
          onOk(ret);
        } else if (modalType === 'edite') {
          message.success('会话修改成功！');
        }
        onClose();
      }
    });
  };

  validatorName = async (rule, value, callback) => {
    const { dispatch, workSpace = {} } = this.props;
    if (workSpace._id) callback();
    else {
      const ret = await dispatch({ type: 'work/checkWorkName', payload: `${value || ''}`.trim() });
      if (ret) callback();
      else callback('名称已被使用，请重新输入！');
    }
  };

  render() {
    const {
      modalType,
      onClose = () => {},
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        title={modalType === 'create' ? '新建会话' : '修改会话'}
        centered
        visible={['create', 'edite'].includes(modalType)}
        onCancel={onClose}
        onOk={this.onSubmit}
        zIndex={1100}
      >
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
          <FormItem label="工作空间">
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
          <FormItem label="调试页面">
            {getFieldDecorator('url', {
              rules: [],
            })(<Input placeholder="请输入网页开启URL" allowClear addonBefore="http://" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default CreateModal;
