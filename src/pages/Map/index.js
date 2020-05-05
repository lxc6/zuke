// 地图组件
import React, { Component } from "react";
import NavHeader from "../../components/NavHeader";
import { getCurrentCity } from "../../utils/currentCity";
import axios from 'axios'
// 导入局部样式
import "./map.scss";
import styles from "./map.module.scss";
// 1 当你引入 百度地图的js 后 就天生 有 BMap还有很多 地图的函数
// 2 react比较特别 凡是引入的js 要使用 需要加 window.
let BMap = window.BMap; // 每次加window很烦 先赋值一下
export default class Map extends Component {
  componentDidMount() {
    // 必须保证页面 有对应div了 componentDidMount 页面初次渲染了 保证有div了
    //    1 发送请求 2 涉及到dom元素操作 要在这里
    this.initMap();
  }
  async initMap() {
    //   1.创建地图 放到对应div
    this.map = new BMap.Map("container");
    // 1-2.获取定位城市 //
    let city = await getCurrentCity();
    // 1-3创建地址解析器实例  将城市名转换为经纬度
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上
    // 2.移动到地图中心点经纬度
    myGeo.getPoint(
      city.label,
       (point)=> {
        if (point) {
          //  3.缩放   11 市区  13 县镇  15小区街道
          this.map.centerAndZoom(point, 11);
          // 4.添加控件
          this.map.addControl(new BMap.NavigationControl()); //平移缩放控件
          this.map.addControl(new BMap.ScaleControl()); //比例尺
          this.map.addControl(new BMap.OverviewMapControl()); //右下角缩略地图
          this.map.addControl(new BMap.MapTypeControl()); //地图类型 平面 三维 卫星
          this.map.addControl(new BMap.GeolocationControl()); //左下角定位控件   
          // 循环生成 覆盖物
          // 1.map传参 2.map 全局变量 3. map 注册在this上  this.map
          this.renderOverlays(city.value)
        }
      },
      city.label
    );
  }
  // 循环生成覆盖物
  renderOverlays= async (id)=>{
  let res = await axios.get('http://api-haoke-dev.itheima.net/area/map?id='+id)         
    console.log(res);
    res.data.body.forEach((item)=>{
      // 5.添加覆盖物   longitude经度   latitude纬度
      let point = new BMap.Point(item.coord.longitude,item.coord.latitude)
       var opts = {
         position: point, // 指定文本标注所在的地理位置
         offset: new BMap.Size(-35, -35), //设置文本偏移量
       };
       var label = new BMap.Label("", opts); // 创建文本标注对象
       label.setContent(`
       <div class="${styles.bubble}">
         <p class="${styles.name}">${item.label}</p>
         <p>${item.count}套</p>
       </div>
        `);
       label.setStyle({//外层样式 默认有padding与border
         padding:0,
         border:'none'
       }); 
       // 绑定点击事件
       label.addEventListener('click',()=>{
         console.log('点击了label覆盖物');

       })
       this.map.addOverlay(label);//添加覆盖
         })
  }
  render() {
    return (
      <div className="map">
        {/* 我是map组件 */}
        <NavHeader>
          {/* 地图找房 */}
          {"地图找房"}
        </NavHeader>
        <div id="container"></div>
      </div>
    );
  }
}
