// home 组件
import React, { Component } from "react";
import SearchHeader from "../../components/SearchHeader/index";
import Filter from "./components/Filter";
// 导入可视区域渲染 列表
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";
import { getCurrentCity } from "../../utils/currentCity";
import { API } from "../../utils/api";
import { Spring } from "react-spring/renderprops"; //导入动画组件
import Stikcy from "../../components/Stikcy/index";
import "./Houselist.scss";
import styles from "./houselist.module.scss";

export default class Houselist extends Component {
  state = {
    cityname: "",
    count: 0,
    list: [],
  };

  async componentDidMount() {
    // 调用封装函数获取id 数据库中没有的城市 返回上海
    let city = await getCurrentCity();
    this.setState({
      cityname: city.label,
    });
    // 进入页面 为空 没有filter 获取所有数据
    this.filter = {};
    this.getHouseList();
  }

  getFilter = (filter) => {
    // console.log(filter);
    // filter 涉及到两个函数 1.传参 2.全局变量 3.this.filter
    // 获取房源数据
    this.filter = filter;
    this.getHouseList();
  };
  // 获取房源数据
  getHouseList = async () => {
    let city = await getCurrentCity();
    let res = await API.get("/houses", {
      params: {
        cityId: city.value,
        ...this.filter, //延展对象
        start: 1,
        end: 20,
      },
    });
    // console.log(res);
    this.setState(
      {
        list: res.data.body.list,
        count: res.data.body.count,
      },
      () => {
        console.log(this.state.count);
      }
    );
  };

  // 可视区域渲染
  rowRenderer = ({
    key, // 唯一key
    index, //索引 每一条数据的索引
    style, // style 每行div的 行内样式 他是组件控制的 我们必须写
  }) => {
    // 通过索引获取每条数据
    let house = this.state.list[index];
    // console.log(house);
    
    // house滑下去可能会undefined 报错  因为数据渲染较慢 还没有完成  需要判断
    if (!house) {
      return (
        <div key={key} style={style} className={styles.loading}>
          正在加载中......
        </div>
      );
    } else {
      return (
        // 每一个房屋数据 绑定 点击跳转事件并将id传过去
        <div 
        key={key} 
        style={style} 
        className={styles.house}
        onClick={()=>{
          this.props.history.push('/detail/'+house.houseCode)
        }}
        >
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`http://api-haoke-dev.itheima.net${house.houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{house.title}</h3>
            <div className={styles.desc}>{house.desc}</div>
            <div>
              {/* ['近地铁', '随时看房'] */}
              {house.tags.map((item, index) => {
                return (
                  <span
                    key={index}
                    className={[styles.tag, styles.tag1].join(" ")}
                  >
                    {item}
                  </span>
                );
              })}
            </div>
            <div className={styles.price}>
              <span className={styles.priceNum}>{house.price}</span> 元/月
            </div>
          </div>
        </div>
      );
    }
  };

  // InfiniteLoader相关
  // 当前数据是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]; // !!返回自身的布尔值
  };
  // 是否加载更多数据 返回promise 并resolve
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async (resolve, reject) => {
      // 发请求获取新数据 加到原数据后面
      console.log(startIndex, stopIndex);
      let city = await getCurrentCity();
      let res = await API.get("/houses", {
        params: {
          cityId: city.value,
          ...this.filter, //延展对象
          start: startIndex,
          end: stopIndex,
        },
      });
      // console.log(res);
      this.setState({
        count: res.data.body.count,
        list: [...this.state.list, ...res.data.body.list], //合并数组
      });
      resolve(); //返回  **必须**
    });
  };
  render() {
    return (
      <div className="houselist">
        {/* 顶部导航 */}
        {/* 动画实现顶部导航栏 */}
        <Spring
          from={{ opacity: 0, background: "pink" }}
          to={{ opacity: 1, background: "skyblue" }}
          config={{ duration: 2000 }}
        >
          {(props) => {
            return (
              // 通过props控制动画样式
              <div style={props} className="header">
                {/* 左侧箭头 */}
                <i
                  className="iconfont icon-back"
                  onClick={() => {
                    this.props.history.goBack();
                  }}
                ></i>
                <SearchHeader cityname={this.state.cityname}></SearchHeader>
              </div>
            );
          }}
        </Spring>

        {/* 分类筛选 区域 */}
        {/* 吸顶功能 */}
        <Stikcy height={40}>
          <Filter getFilter={this.getFilter}></Filter>
        </Stikcy>
        {/* 房子列表 */}
        {/* InfiniteLoader 无限滚动 */}
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded} //----当前数据是否加载完成
          loadMoreRows={this.loadMoreRows} //----加载更多数据
          rowCount={this.state.count} //---总条数
        >
          {({ onRowsRendered, registerChild }) => (
            //  WindowScroller 窗口滚动
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                // AutoSizer动态计算占满剩余屏幕宽高 height，width
                <AutoSizer>
                  {({ width }) => (
                    <List
                      // InfiniteLoader附带方法
                      onRowsRendered={onRowsRendered} //---监听滚动
                      ref={registerChild} //----获取list
                      // windowScroller附带方法
                      autoHeight //-----自适应窗口宽高
                      isScrolling={isScrolling} //---是否滚动
                      onScroll={onChildScroll} //----监听当前List 跟随窗口滚动
                      scrollTop={scrollTop} //----页面滚上去的距离
                      // list
                      width={width}
                      height={height}
                      rowCount={this.state.count} //----总条数
                      rowHeight={120} //----动态计算高度 可传数据和函数
                      rowRenderer={this.rowRenderer} //---每条数据渲染的函数
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </div>
    );
  }
}
