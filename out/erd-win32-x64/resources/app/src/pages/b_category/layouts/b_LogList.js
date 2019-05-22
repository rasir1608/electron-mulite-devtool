import React from 'react';
import { connect } from 'dva';

@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
class LogList extends React.PureComponent {
  render() {
    return <div>LogList</div>;
  }
}

export default LogList;
