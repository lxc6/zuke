// 根组件
import React, { Component } from "react";
import { BrowserRouter as Router, Route,Redirect} from "react-router-dom";
// import {} from "antd-mobile";
import Home from "./pages/Home"
import Citylist from "./pages/Citylist"
import Map from './pages/Map'
export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          {/* <h1>我是根组件</h1> */}
          
          {/* home组件 */}
          <Route exact path="/" render={(props)=>{
            return <Redirect to="/home/default"></Redirect>
          }} ></Route>
          <Route path="/home" component={Home}></Route>
          {/* 城市列表 */}
          <Route exact path="/citylist" component={Citylist}></Route>
          <Route exact path="/map" component={Map}></Route>
          
        </div>
      </Router>
    );
  }
}
