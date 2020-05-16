// 根组件
import React, { Component, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
// import {} from "antd-mobile";
import Rent from "./pages/Rent";
import RentAdd from "./pages/Rent/Add";
import RentSearch from "./pages/Rent/Search";
import AuthRoute from "./components/AuthRoute";
// 导入组件换成lazy方式实现 用谁导入谁
const Home= lazy(()=>import('./pages/Home'))
const Citylist= lazy(()=>import('./pages/Citylist'))
const Map= lazy(()=>import('./pages/Map'))
const HouseDetail= lazy(()=>import('./pages/HouseDetail'))
const Login= lazy(()=>import('./pages/Login'))



export default class App extends Component {
  render() {
    return (
      <Router>
        <Suspense
          fallback={
            <div
              style={{
                height: "100%",
                padding:"200px 0",
                backgroundColor: "skyblue",
                fontSize: "30px",
                textAlign: "center",
              }}
            >
              加载中------
            </div>
          }
        >
          <div className="App">
            {/* <h1>我是根组件</h1> */}

            {/* home组件 */}
            {/* exact精确模式 默认*/}
            <Route
              exact
              path="/"
              render={(props) => {
                return <Redirect to="/home/default"></Redirect>; //强制跳转
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
            <Route exact path="/login" component={Login}></Route>
            {/* 三个页面需要鉴权 
            /rent 房屋管理  
            /rent/add  发布房屋
            /rent/search 小区搜索
            */}
            {/* 房屋管理页面 */}
            <AuthRoute exact={true} path={"/rent"} Pages={Rent}></AuthRoute>
            <AuthRoute
              exact={true}
              path={"/rent/add"}
              Pages={RentAdd}
            ></AuthRoute>
            <AuthRoute
              exact={true}
              path={"/rent/search"}
              Pages={RentSearch}
            ></AuthRoute>
          </div>
        </Suspense>
      </Router>
    );
  }
}
