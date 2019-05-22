import React from 'react';
import { Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';
import { getRoutes } from '@/utils/utils';
import './A_basicLayout.less';

// const { electron } = window;

@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
class BasicLayout extends React.PureComponent {
  state = {};

  getRouteList = () => {
    const { routerData } = this.props;
    return getRoutes('/user', routerData);
  };

  getRedirectRouter = () => {
    const { currentUser } = this.props;
    if (currentUser && !!currentUser.userName) return '/user/mine';
    return '/user/signin';
  };

  render() {
    const routeList = this.getRouteList().reverse();
    const redirectRouter = this.getRedirectRouter();
    return (
      <div className="ra-user-base">
        <Switch>
          <Redirect from="/user" exact to={redirectRouter} />
          {routeList.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact />
          ))}
        </Switch>
      </div>
    );
  }
}

export default BasicLayout;
