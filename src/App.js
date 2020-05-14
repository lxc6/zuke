// 根组件
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
// import {} from "antd-mobile";
import Home from "./pages/Home";
import Citylist from "./pages/Citylist";
import Map from "./pages/Map";
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          {/* <h1>我是根组件</h1> */}

          {/* home组件 */}
          {/* exact精确模式 默认*/}
          <Route
            exact
            path="/"
            render={(props) => {
              return <Redirect to="/home/default"></Redirect>;//强制跳转
            }}
          ></Route>
          {/* 主页 */}
          <Route path="/home" component={Home}></Route>
          {/* 城市列表 */}
          <Route exact path="/citylist" component={Citylist}></Route>
          {/* 地图找房 */}
          <Route exact path="/map" component={Map}></Route>
          {/* 房子详情  :id 路由参数*/}
          <Route exact path="/detail/:id" component={HouseDetail}></Route>
          {/* 登录页面 */}
          <Route exact path='/login' component={Login}></Route>
        </div>
      </Router>
    );
  }
}
