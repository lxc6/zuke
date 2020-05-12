import React, { Component } from "react";

export default class Stikcy extends Component {
  pRef = React.createRef();
  cRef = React.createRef();
   // 去顶部  吸顶
   goTop=()=> { //箭头函数 
    // console.log('滚动了',this.pRef.current);
    let pDiv = this.pRef.current; //获取元素
    let cDiv = this.cRef.current;
    // 元素.getBoundingClientRect() 获取当前元素距离页面窗口上下左右的位置
    let pTop = pDiv.getBoundingClientRect().top;
    // console.log(pTop);
    if (pTop <= 0) {
      cDiv.style.position = "fixed";
      cDiv.style.top = 0;
      cDiv.style.left = 0;
      cDiv.style.width = "100%";
      cDiv.style.zIndex = 999;
      pDiv.style.height = this.props.height + "px"; //注意单位
    } else {
      cDiv.style = "static"; //还原
      pDiv.style.height = 0;
    }
  }
  // 初次渲染
  componentDidMount() {
    window.addEventListener("scroll", this.goTop);
  }
  // 卸载组件
  componentWillUnmount() {
    window.removeEventListener("scroll", this.goTop);
  }
 
  render() {
    return (
      <div className="stikcy">
        {/* 监听顶部 */}
        <div ref={this.pRef} id="placeholder"></div>
        {/* 固定定位 */}
        <div ref={this.cRef} id="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
