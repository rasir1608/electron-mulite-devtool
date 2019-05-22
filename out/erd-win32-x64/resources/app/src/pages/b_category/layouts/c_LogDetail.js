import React from 'react';
import { connect } from 'dva';

@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
class LogDetail extends React.PureComponent {
  render() {
    return <div>LogDetail</div>;
  }
}

export default LogDetail;
