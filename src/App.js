import React, { Component } from "react";
import { Button } from "antd-mobile"
export default class App extends Component {
  render() {
    return <div className="App">
      <h1>我是根组件</h1>

      <Button style={ {width:"70%",margin:"0 auto"} } type="primary">antd组件库的button按钮</Button>
    </div>;
  }
}
