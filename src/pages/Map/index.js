// 地图组件
import React, { Component } from "react";
import NavHeader from "../../components/NavHeader";
import { getCurrentCity } from "../../utils/currentCity";
// import axios from "axios";
import {API} from '../../utils/api'
import{ Toast } from 'antd-mobile'
// 导入局部样式
import "./map.scss";
import styles from "./map.module.scss";
// 1 当你引入 百度地图的js 后 就天生 有 BMap还有很多 地图的函数
// 2 react比较特别 凡是引入的js 要使用 需要加 window.
let BMap = window.BMap; // 每次加window很烦 先赋值一下
export default class Map extends Component {
  state = {
    count: 0,
    list: [],
    isshow: false,
  };
  componentDidMount() {
    // 必须保证页面 有对应div了 componentDidMount 页面初次渲染了 保证有div了
    //    1 发送请求 2 涉及到dom元素操作 要在这里
    this.initMap();
  }
  async initMap() {
    //   1.创建地图 放到对应div
    this.map = new BMap.Map("container");
    // 添加地图移动事件 进行房屋列表隐藏
    this.map.addEventListener("movestart", () => {
      this.setState({
        isshow: false,
      });
    });
    // 1-2.获取定位城市 //
    let city = await getCurrentCity();
    // 1-3创建地址解析器实例  将城市名转换为经纬度
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上
    // 2.移动到地图中心点经纬度
    myGeo.getPoint(
      city.label,
      (point) => {
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
          this.renderOverlays(city.value, "circle");
        }
      },
      city.label
    );
  }
  // 循环生成覆盖物  type参数判断圆形与矩形
  renderOverlays = async (id, type) => {
    Toast.loading('加载中---',0)
    let res = await API.get(
      "/area/map?id=" + id
    );
    Toast.hide()
    console.log(res);
    res.data.body.forEach((item) => {
      // 5.添加覆盖物   longitude经度   latitude纬度
      let point = new BMap.Point(item.coord.longitude, item.coord.latitude);
      var opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-35, -35), //设置文本偏移量
      };
      var label = new BMap.Label("", opts); // 创建文本标注对象
      // 判断圆形与矩形
      if (type === "circle") {
        label.setContent(`
       <div class="${styles.bubble}">
         <p class="${styles.name}">${item.label}</p>
         <p>${item.count}套</p>
       </div>
        `);
      } else if (type === "rect") {
        label.setContent(`
        <div class="${styles.rect}">
        <span class="${styles.housename}">${item.label}</span>
        <span class="${styles.housenum}">${item.count}</span>
        <i class="${styles.arrow}"></i>
      </div>
         `);
      }

      label.setStyle({
        //外层样式 默认有padding与border
        padding: 0,
        border: "none",
      });
      // 绑定点击事件  点击定位到县镇并显示房源
      label.addEventListener("click", (e) => {
        console.log("点击了label覆盖物");
        //  回调  通过11,13,15 进行缩放定位
        console.log(this.map.getZoom());
        let zoom = this.map.getZoom();
        if (zoom === 11) {
          this.map.centerAndZoom(point, 13); //缩放到13
          setTimeout(() => {
            //直接清除，百度会报错 延迟解决
            this.map.clearOverlays(); //清除所有覆盖物
          }, 10);
          this.renderOverlays(item.value,'circle');
        } else if (zoom === 13) {
          this.map.centerAndZoom(point, 15); //缩放到15
          // 样式变为矩形
          setTimeout(() => {
            this.map.clearOverlays(); //清除所有覆盖物
          }, 10);
          this.renderOverlays(item.value,'rect');
        } else if (zoom === 15) {
          console.log("位置移动到中心，弹出房屋列表", item.value);
          // 获取房源列表
          // 获取坐标 clientX距离手机屏幕左上角x坐标
          console.log(e);
          // 1.1当前坐标
          let clientX= e.changedTouches[0].clientX
          let clientY= e.changedTouches[0].clientY
          // 1.2 中心坐标
          let centerX= window.innerWidth/2
          let centerY= (window.innerHeight-330)/2
          // 1.3 移动的的距离
          let distanceX=clientX-centerX
          let distanceY=clientY-centerY
          // 1.4 移动
          this.map.panBy(-distanceX,-distanceY)
          
          this.getHouselist(item.value);
        }
      });
      this.map.addOverlay(label); //添加覆盖
    });
  };
  getHouselist = async (id) => {
    Toast.loading('加载中---',0)
    let res = await API.get(
      //获取房屋列表
      "/houses?cityId=" + id
    );
    Toast.hide()
    console.log("房子列表总数", res.data.body.count);
    console.log("房子列表", res.data.body.list);
    this.setState({
      count: res.data.body.count,
      list: res.data.body.list,
      isshow: true, //获取到房屋列表后显示
    });
  };
  renderHouse() {
    return this.state.list.map((item) => {
      return (
        <div key={item.houseCode} className={styles.house}>
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`http://api-haoke-dev.itheima.net${item.houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{item.title}</h3>
            <div className={styles.desc}>{item.desc}</div>
            <div>
              {/* ['近地铁', '随时看房'] */}
              {item.tags.map((v, i) => {
                return (
                  <span key={i} className={[styles.tag, styles.tag1].join(" ")}>
                    {v}
                  </span>
                );
              })}
            </div>
            <div className={styles.price}>
              <span className={styles.priceNum}>{item.price}</span> 元/月
            </div>
          </div>
        </div>
      );
    });
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
        {/* 房源列表 */}
        <div>
          {/* this.state.isshow?styles.show:'' 控制房屋列表显示隐藏 */}
          <div
            className={[
              styles.houseList,
              this.state.isshow ? styles.show : "",
            ].join(" ")}
          >
            <div className={styles.titleWrap}>
              <h1 className={styles.listTitle}>房屋列表</h1>
              <a className={styles.titleMore} href="/house/list">
                更多房源
              </a>
            </div>
            {/* 房子 */}
            <div className={styles.houseItems}>
              {/* 循环house */}
              {this.renderHouse()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
