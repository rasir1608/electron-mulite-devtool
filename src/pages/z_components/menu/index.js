import React from 'react';
import { Menu } from 'antd';
import './index.less';

const { Item: MenuItem } = Menu;

const menuList = [
  {
    title: '打开',
    key: 'open',
  },
  {
    title: '新建',
    key: 'create',
  },
  {
    title: '导入配置',
    key: 'load',
  },
  {
    title: '导出配置',
    key: 'output',
  },
];

class NavMenu extends React.PureComponent {
  state = {};

  handleClick = ({ key }) => {
    console.log(11, key);
    const { onChange = () => {} } = this.props;
    onChange(key);
  };

  render() {
    return (
      <Menu onClick={this.handleClick} mode="horizontal" selectedKeys={[]}>
        {menuList.map(menu => (
          <MenuItem key={menu.key} style={{ borderBottom: '2px solid transparent' }}>
            {menu.title}
          </MenuItem>
        ))}
      </Menu>
    );
  }
}

export default NavMenu;
