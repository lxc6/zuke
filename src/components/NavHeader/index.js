import React, { Component } from 'react'
import { NavBar, Icon } from "antd-mobile";
import './index.scss'
// 1.封装组件导入时 history路由没有 要用需导入withRouter
import { withRouter } from 'react-router-dom'
// 2.通过prop-types 验证type类型 防止随意传值
import PropTypes from 'prop-types'

 class NavHeader extends Component {
    render() {
        return <NavBar
        className="navbar"
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => {
          console.log(this.props.history);
          this.props.history.go(-1);
        }}
      >
        {this.props.children}
      </NavBar>
    }
}
// 2.导出组件之前验证
// 验证参数    this.props.参数
NavHeader.propTypes={
  children:PropTypes.string
}
// 3.默认值
NavHeader.defaultProps={
  children:'默认导航标题'
}
export default withRouter(NavHeader)