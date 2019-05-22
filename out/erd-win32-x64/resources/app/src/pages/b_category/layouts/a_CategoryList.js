import React from 'react';
import { connect } from 'dva';

@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
class CategoryList extends React.PureComponent {
  render() {
    return <div>CategoryList</div>;
  }
}

export default CategoryList;
