// 鉴权组件 导航守卫

import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "../../utils/token";

export default class AuthRoute extends Component {
  render() {
    // props 解构传的参数
    let { exact, path, Pages } = this.props;
    return (
      <Route
        exact={exact}//传入的布尔值
        path={path}//传入的地址
        render={(props) => {
          if (isAuth()) {//isAuth() 要执行才可以
            //   传入的组件
            // history 报错 需要传入props Route组件不能用withRouter
            return <Pages {...props}></Pages>;
          } else {
            return <Redirect to="/login"></Redirect>; //强制跳转
          }
        }}
      ></Route>
    );
  }
}


// -----效验

//------ 默认值