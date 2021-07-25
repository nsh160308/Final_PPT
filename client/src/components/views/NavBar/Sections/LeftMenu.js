import React from 'react';
import { Menu, Button } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const MenuStyle = {
  fontSize:"14px",
  fontFamily:"Georgia",
  fontWeight:"bold",
}



function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="Subscription">
        <a href="/subscription" style={MenuStyle}>좋아하는 영상</a>
      </Menu.Item>
      <Menu.Item key="Lookbook">
        <a href="/Lookbook" style={MenuStyle}>Lookbook</a>
      </Menu.Item>
      <Menu.Item key="Shop">
        <a href="/Shop" style={MenuStyle}>쇼핑</a>
      </Menu.Item>
    </Menu>
  )
}

export default LeftMenu