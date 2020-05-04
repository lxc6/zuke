import React, { Component } from 'react'
import { NavBar, Icon } from "antd-mobile";
import './index.scss'
export default class NavHeader extends Component {
    render() {
        return <NavBar
        className="navbar"
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          console.log(this.props);
        //   this.props.history.go(-1);
        }}
      >
        {this.props.children}
      </NavBar>
    }
}
