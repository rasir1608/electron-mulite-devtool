import React from 'react';
import { Modal, Icon } from 'antd';
import { connect } from 'dva';
import { List } from 'react-virtualized';
import './index.less';

@connect(({ work: { allWorkList } }) => ({ allWorkList }))
class OpenModal extends React.PureComponent {
  state = { allWorkList: [] };

  componentDidUpdate(preProps) {
    const { visible: preVisible } = preProps;
    const { visible } = this.props;
    if (!preVisible && visible) {
      this.getAllWorkList();
    }
  }

  getAllWorkList = async () => {
    const { dispatch } = this.props;
    await this.setState({ allWorkList: [] });
    const allWorkList =
      (await dispatch({
        type: 'work/queryWorkList',
      })) || [];
    await this.setState({ allWorkList });
  };

  openWorkSpace = workspace => {
    const { dispatch, onClose = () => {} } = this.props;
    dispatch({
      type: 'work/addWorkSpace',
      payload: workspace,
    });
    onClose();
  };

  listRowRenderer = ({ key, index, style }) => {
    const { allWorkList = [] } = this.state;
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
          <Icon type="edit" title="编辑" />
          <Icon type="delete" title="删除" />
        </div>
      </div>
    );
  };

  render() {
    const { visible, onClose = () => {} } = this.props;
    const { allWorkList = [] } = this.state;
    return (
      <Modal
        title="打开会话"
        centered
        visible={visible}
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
