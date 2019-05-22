import React from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Button, Input, message, Modal } from 'antd';

import './index.less';

const { TabPane } = Tabs;
const {
  electron: { ipcRenderer },
} = window;

@connect(({ work: { tabWorkList, activeKey } }) => ({ tabWorkList, activeKey }))
class WorkSpace extends React.PureComponent {
  state = { codeEdite: false, codeCace: '' };

  componentDidMount() {
    ipcRenderer.on('runWorkResult', (e, work) => {
      const { tabWorkList, dispatch } = this.props;
      const index = tabWorkList.findIndex(({ _id }) => _id === work._id);
      console.log(20, index, tabWorkList);
      if (index < 0) return;
      tabWorkList[index] = {
        ...tabWorkList[index],
        ...work,
        log: (tabWorkList[index].log || '') + work.log,
      };
      dispatch({
        type: 'work/update',
        payload: {
          tabWorkList: [...tabWorkList],
        },
      });
    });
  }

  getActiveWork = () => {
    const { tabWorkList, activeKey } = this.props;
    return tabWorkList.find(({ _id }) => _id === activeKey) || {};
  };

  updateActiveWork = update => {
    const { dispatch, tabWorkList, activeKey } = this.props;
    const index = tabWorkList.findIndex(({ _id }) => _id === activeKey);
    tabWorkList[index] = { ...tabWorkList[index], ...update };
    dispatch({
      type: 'work/update',
      payload: {
        tabWorkList: [...tabWorkList],
      },
    });
  };

  changeActiveWork = targetKey => {
    const { dispatch, activeKey } = this.props;
    if (activeKey === targetKey) return;
    dispatch({
      type: 'work/update',
      payload: {
        activeKey: targetKey,
      },
    });
  };

  removeTab = targetKey => {
    Modal.confirm({
      title: '关闭窗口',
      content: '是否关闭当前会话？',
      okText: '确认',
      centered: true,
      cancelText: '取消',
      onOk: () => {
        this.stopWork();
        const { tabWorkList, dispatch, activeKey } = this.props;
        const update = { tabWorkList: tabWorkList.filter(({ _id: tid }) => tid !== targetKey) };
        if (activeKey === targetKey) {
          let aIndex = tabWorkList.findIndex(({ _id }) => _id === activeKey);
          aIndex = Math.min(aIndex, update.tabWorkList.length - 1);
          this.changeActiveWork((update.tabWorkList[aIndex] || {})._id);
        }
        dispatch({
          type: 'work/update',
          payload: update,
        });
      },
    });
  };

  formateCode = code => {
    const codeArr = `${code || ''}`.split(';');
    return codeArr.map((c, i) => <p key={`${i + i}`}>{c};</p>);
  };

  startWork = async () => {
    const { dispatch } = this.props;
    const activeWork = this.getActiveWork();
    const { code = '' } = activeWork;
    dispatch({
      type: 'work/runWorkCode',
      payload: { ...activeWork, code: code.replace(/;/g, '&') },
    });
  };

  stopWork = async () => {
    const { dispatch } = this.props;
    const activeWork = this.getActiveWork();
    const { pid } = activeWork;
    if (pid) {
      dispatch({
        type: 'work/killWork',
        payload: activeWork,
      });
    }
  };

  changeEditeState = async () => {
    const { codeEdite = false, codeCace } = this.state;
    const { dispatch } = this.props;
    const { _id, path, name, code } = this.getActiveWork();
    if (codeEdite) {
      const payload = { _id, path, name, code: codeCace };
      const ret = await dispatch({
        type: 'work/updateWorkSpace',
        payload,
      });
      if (ret) {
        dispatch({
          type: 'work/addWorkSpace',
          payload: ret,
        });
        this.setState({ codeEdite: false });
      } else {
        message.error('保存失败！');
      }
    } else {
      this.setState({ codeEdite: true, codeCace: code });
    }
  };

  changeWorkCode = e => {
    const code = e.target.value;
    this.setState({ codeCace: code });
  };

  clearLog = () => {
    this.updateActiveWork({ log: '' });
  };

  openInBower = () => {
    const activeWork = this.getActiveWork();
    const { dispatch } = this.props;
    dispatch({ type: 'work/openInBower', payload: { url: activeWork.url } });
  };

  render() {
    const { tabWorkList } = this.props;
    const { codeEdite = false, codeCace = '' } = this.state;
    const activeWork = this.getActiveWork();
    return (
      <div className="work-space-wrap">
        <Tabs
          type="editable-card"
          onChange={this.changeActiveWork}
          activeKey={activeWork._id}
          hideAdd
          onEdit={this.removeTab}
        >
          {tabWorkList.map(workSpace => (
            <TabPane tab={workSpace.name} key={workSpace._id} closable>
              <div className="tab-actions">
                <Icon type="play-circle" title="运行" onClick={this.startWork} />
                {activeWork.pid && <Icon type="stop" title="停止" onClick={this.stopWork} />}
                <Icon type="retweet" title="重新运行" />
                {/* <Icon type="redo" title="重做" /> */}
                {/* <Icon type="undo" title="撤销" /> */}
                {activeWork.url && (
                  <Button type="primary" onClick={this.openInBower}>
                    在浏览器中打开
                  </Button>
                )}
              </div>
              <div className="tab-contents">
                <div className="work-space-code">
                  <h3>
                    <span>运行代码：</span>
                    <Button size="small" type="primary" onClick={this.changeEditeState}>
                      {codeEdite ? '保存' : '修改'}代码
                    </Button>
                  </h3>
                  <div className="code-block">
                    {codeEdite ? (
                      <Input.TextArea
                        placeholder="请填写运行代码"
                        value={codeCace}
                        onChange={this.changeWorkCode}
                      />
                    ) : (
                      <pre className="code-node">{this.formateCode(workSpace.code)}</pre>
                    )}
                  </div>
                </div>
                <div className="work-space-code log-code">
                  <h3>
                    <span>运行结果：</span>
                    <Button size="small" type="primary" onClick={this.clearLog}>
                      清空日志
                    </Button>
                  </h3>
                  <div className="code-block">
                    <pre className="code-node">{activeWork.log}</pre>
                  </div>
                </div>
              </div>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default WorkSpace;
