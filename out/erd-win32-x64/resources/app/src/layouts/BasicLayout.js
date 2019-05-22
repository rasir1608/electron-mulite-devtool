import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { getRoutes } from '../utils/utils';
import { getMenuData } from '../common/menu';
import NavMenu from '@/pages/z_components/menu';
import CreateModal from '@/pages/z_components/createModal';
import OpenModal from '@/pages/z_components/openModal';

import './basicLayout.less';

const { Content } = Layout;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

@connect(({ user: { currentUser }, work: { workList } }) => ({ currentUser, workList }))
class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    modalType: 'none',
    curretnWork: undefined,
  };

  getChildContext = () => {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  };

  getPageTitle = () => {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'rasir';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - rasir`;
    }
    return title;
  };

  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);
    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      const authorizedPath = Object.keys(routerData).find(item => item !== '/');
      return authorizedPath;
    }
    return redirect || '/';
  };

  handlerMenu = async menuKey => {
    switch (menuKey) {
      case 'create':
      case 'open':
        this.setState({ modalType: menuKey });
        break;
      default:
        break;
    }
  };

  submitWorkSpace = workSpace => {
    const { dispatch } = this.props;
    dispatch({ type: 'work/addWorkSpace', payload: workSpace });
  };

  editeWorkSpace = workSpace => {
    this.setState({ curretnWork: workSpace, modalType: 'edite' });
  };

  render() {
    const { routerData, match, loading = false, tip = '数据加载中，请稍后' } = this.props;
    const { modalType, curretnWork } = this.state;
    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Spin wrapperClassName="global-wrap" spinning={!!loading} delay={500} tip={`${tip}...`}>
        <Layout>
          <NavMenu onChange={this.handlerMenu} />
          <Content>
            <Switch>
              {redirectData
                .filter(path => path.from !== '/user')
                .map(item => (
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                ))}
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
            </Switch>
          </Content>
        </Layout>
        <CreateModal
          modalType={modalType}
          workSpace={curretnWork}
          onOk={this.submitWorkSpace}
          onClose={() => {
            this.setState({ modalType: modalType === 'create' ? 'none' : 'open' });
          }}
        />
        <OpenModal
          modalType={modalType}
          onClose={() => {
            this.setState({ modalType: 'none' });
          }}
          onEdite={this.editeWorkSpace}
        />
      </Spin>
    );
    return <DocumentTitle title={this.getPageTitle()}>{layout}</DocumentTitle>;
  }
}

export default BasicLayout;
