import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
class Mine extends React.PureComponent {
  componentWillMount() {
    const { currentUser, dispatch } = this.props;
    if (!currentUser || !currentUser.userName) {
      dispatch(routerRedux.push({ pathname: '/user/signin' }));
    }
  }

  render() {
    return <div>用户信息页面</div>;
  }
}

export default Mine;
