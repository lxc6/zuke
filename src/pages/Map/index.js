// 地图组件
import React, { Component } from "react";
import NavHeader from '../../components/NavHeader'
// 导入样式
import "./map.scss";
// 1 当你引入 百度地图的js 后 就天生 有 BMap还有很多 地图的函数
// 2 react比较特别 凡是引入的js 要使用 需要加 window.
let BMap = window.BMap; // 每次加window很烦 先赋值一下
export default class Map extends Component {
  componentDidMount() {
    // 必须保证页面 有对应div了 componentDidMount 页面初次渲染了 保证有div了
    //    1 发送请求 2 涉及到dom元素操作 要在这里
    this.initMap();
  }
  initMap() {
    //   1.创建地图 放到对应div
    var map = new BMap.Map("container");
    //   2.移动到地图中心点经纬度     116.404,39.915天安门
    var point = new BMap.Point(116.404, 39.915);
    //  3.缩放
    map.centerAndZoom(point, 15); //  15数字越大 地图就会放大 看到的就更精确 数值实现放大缩小
  }
  render() {
    return (
      <div className="map">
        {/* 我是map组件 */}
        <NavHeader>
            地图找房
        </NavHeader>
        <div id="container"></div>
      </div>
    );
  }
}

