// home 组件
import React, { Component } from "react";
// 轮播组件
import { Carousel, Grid, Flex } from "antd-mobile";
// axios
// import axios from "axios";
import {API} from '../../utils/api'
// 导入样式
import "./index.scss";
// 导入图片
import nav1 from "../../assets/images/nav-1.png";
import nav2 from "../../assets/images/nav-2.png";
import nav3 from "../../assets/images/nav-3.png";
import nav4 from "../../assets/images/nav-4.png";
// 导入定位
import { getCurrentCity } from "../../utils/currentCity";
let navs = [
  { title: "整租", imgSrc: nav1, path: "/home/houselist" },
  { title: "合租", imgSrc: nav2, path: "/home/houselist" },
  { title: "地图找房", imgSrc: nav3, path: "/map" },
  { title: "出去租", imgSrc: nav4, path: "/rent/add" },
];

let baseurl = 'http://api-haoke-dev.itheima.net'
export default class Default extends Component {
  state = {
    swiperData: [],
    imgHeight: 176,
    isplay: false,
    groups: [], //租房小组数据
    news: [], //最新资讯数据
    cityname: '',
  };
  async componentDidMount() {
    // 轮播
    this.getSwiper();
    // 租房小组
    this.getGroups();
    // 最新资讯
    this.getNews();
    // 调用封装函数获取id 数据库中没有的城市 返回上海
    let city = await getCurrentCity()
    this.setState({
      cityname:city.label
    })
    
  }
  //   请求轮播数据
  async getSwiper() {
    // let res = await axios("http://api-haoke-dev.itheima.net/home/swiper");
    let res = await API.get("/home/swiper");

    // this.setState是异步操作 不能保证 isplay有数据
    // 需要用到setState的第二参数 保证数据isplay是最新的
    this.setState(
      {
        swiperData: res.data.body,
        //   isplay:true
      },
      () => {
        this.setState({
          isplay: true,
        });
      }
    );
  }
  //发送请求 获取 租房小组数据
  async getGroups() {
    let res = await API.get("/home/groups?area=AREA%7C88cff55c-aaa4-e2e0");
    console.log("租房小组", res);
    if (res.data.status === 200) {
      // 成功就赋值
      this.setState({
        groups: res.data.body,
      });
    }
  }
  // 发送请求 获取 最新资讯数据
  async getNews() {   
    let res = await API.get("/home/news?area=AREA%7C88cff55c-aaa4-e2e0");
    console.log("最新资讯", res);
    // 赋值
    this.setState({
      news: res.data.body, // 新闻数据
    });
  }
  //   封装循环组件
  renderSwiper() {
    return this.state.swiperData.map((item, index) => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{
          display: "inline-block",
          width: "100%",
          height: this.state.imgHeight,
        }}
      >
        <img
          src={baseurl + item.imgSrc}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event("resize"));
            this.setState({ imgHeight: "auto" });
          }}
        />
      </a>
    ));
  }
  // 封装导航
  renderNavs() {
    return navs.map((item, index) => {
      return (
        <div
          key={index}
          // 点击跳转
          onClick={() => {
            this.props.history.push(item.path);
          }}
          className="nav_item"
        >
          <img src={item.imgSrc} alt="" />
          <p>{item.title}</p>
        </div>
      );
    });
  }
  // 封装最新资讯
  renderNews() {
    return this.state.news.map((item, index) => {
      return (
        <li key={item.id}>
          <div className="imgBox">
            <img
              src={baseurl+item.imgSrc}
              alt=""
            />
          </div>
          <div className="news-text">
            <h4>{item.title}</h4>
            <p>
              <span>{item.from}</span>
              <span>{item.date}</span>
            </p>
          </div>
        </li>
      );
    });
  }
  render() {
    return (
      <div className="default">
        {/* 搜索栏 */}
        <Flex className="searchBox">
          <Flex className="searchLeft">
            <div
              className="location"
              // 点击跳转城市列表
              onClick={() => {
                this.props.history.push("/citylist");
              }}
            >
              {/* 不能写死 定位的 那个城市才对 */}
              <span>{this.state.cityname}</span>
              <i className="iconfont icon-arrow" />
            </div>
            <div className="searchForm">
              <i className="iconfont icon-seach" />
              <span>请输入小区或地址</span>
            </div>
          </Flex>
          {/* 右侧地图图标 点击跳到 /map */}
          <i
            className="iconfont icon-map"
            onClick={() => {
              // 点击跳到 /map
              this.props.history.push("/map");
            }}
          />
        </Flex>

        {/* 轮播 */}
        {/* autoplay自带bug 需要用setState的第二参数处理 */}
        <Carousel autoplay={this.state.isplay} infinite>
          {/* 调用循环体 */}
          {this.renderSwiper()}
        </Carousel>

        {/* 导航 */}
        <div className="nav">
          {/* 调用导航组件 */}
          {this.renderNavs()}
        </div>

        {/* 租房小组 */}
        <div className="group">
          {/* 标题 */}
          <div className="title">
            <h3>租房小组</h3>
            <span>更多</span>
          </div>
          {/* Grid组件布局 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false} //是否固定正方形 true 正方形 false 矩形
            activeStyle={true} //点击是否有灰色样式 true 有 false 没有
            hasLine={false} //是否有边框线  true 有 false没有
            renderItem={(item, index) => (
              <div className="gird_item">
                <div className="text">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img
                  src={baseurl+item.imgSrc}
                  alt=""
                />
              </div>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3>最新资讯</h3>
          {/* 内容 */}
          <ul>{this.renderNews()}</ul>
        </div>
      </div>
    );
  }
}
