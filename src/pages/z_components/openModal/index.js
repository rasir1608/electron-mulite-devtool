import React from 'react';
import { Modal, Icon, message } from 'antd';
import { connect } from 'dva';
import { List } from 'react-virtualized';
import './index.less';

@connect(({ work: { allWorkList } }) => ({ allWorkList }))
class OpenModal extends React.PureComponent {
  componentDidUpdate(preProps) {
    const { modalType: preModalType } = preProps;
    const { modalType } = this.props;
    if (preModalType !== 'open' && modalType === 'open') {
      this.getAllWorkList();
    }
  }

  getAllWorkList = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'work/queryWorkList',
    });
  };

  openWorkSpace = workspace => {
    const { dispatch, onClose = () => {} } = this.props;
    dispatch({
      type: 'work/addWorkSpace',
      payload: workspace,
    });
    onClose();
  };

  deleteWork = workspace => {
    Modal.confirm({
      title: '删除会话',
      content: '该操作将删除选择的会话，是否继续？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { dispatch } = this.props;
        const ret = await dispatch({
          type: 'work/deleteById',
          payload: { id: workspace._id },
        });
        if (ret) {
          message.success('会话删除成功！');
          this.getAllWorkList();
        }
      },
    });
  };

  listRowRenderer = ({ key, index, style }) => {
    const { onEdite = () => {}, allWorkList = [] } = this.props;
    return (
      <div
        key={key}
        style={style}
        className="wrok-list-item"
        title={(allWorkList[index] || {}).name}
      >
        <div className="item-open">
          <Icon
            type="play-circle"
            title="打开"
            onClick={() => this.openWorkSpace(allWorkList[index])}
          />
          <span onDoubleClick={() => this.openWorkSpace(allWorkList[index])}>
            {(allWorkList[index] || {}).name}
          </span>
        </div>
        <div className="item-actions">
          <Icon type="edit" title="编辑" onClick={() => onEdite(allWorkList[index])} />
          <Icon type="delete" title="删除" onClick={() => this.deleteWork(allWorkList[index])} />
        </div>
      </div>
    );
  };

  render() {
    const { modalType = 'none', onClose = () => {}, allWorkList } = this.props;
    return (
      <Modal
        title="打开会话"
        centered
        visible={['open', 'edite'].includes(modalType)}
        onCancel={onClose}
        onOk={onClose}
        width={500}
      >
        <List
          className="work-list-wrap"
          width={450}
          height={300}
          rowCount={allWorkList.length}
          rowHeight={30}
          rowRenderer={this.listRowRenderer}
        />
      </Modal>
    );
  }
}

export default OpenModal;
