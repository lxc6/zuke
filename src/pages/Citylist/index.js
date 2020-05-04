// citylist 组件
import React, { Component } from "react";
import { Toast } from "antd-mobile";
import axios from "axios";
import "./citylist.scss";
import { getCurrentCity } from "../../utils/currentCity";
// 导入可视区域渲染
import { List, AutoSizer } from "react-virtualized";
import NavHeader from '../../components/NavHeader'
export default class Home extends Component {
  state = {
    citylist: {}, //左侧城市数据
    cityIndex: [], //右侧字母数据
    activeIndex: 0, //选中状态
  };
  // 通过ref 获取 List组件dom
  listRef = React.createRef();
  componentDidMount() {
    this.getCitylist();
  }
  // ------城市渲染----------
  rowRenderer = ({
    key, // 唯一key
    index, //索引 每一条数据的索引
    isScrolling, //是否正在滚动 true正在滚动  false 没有滚动
    isVisible, // 是否可见 true看见了
    style, // style 每行div的 行内样式 他是组件控制的 我们必须写
  }) => {
    // 1.通过索引获取单词
    let word = this.state.cityIndex[index];
    // 2.通过单词获取城市
    let citys = this.state.citylist[word];
    return (
      // 每一个单词城市
      <div className="city" key={key} style={style}>
        {/* 单词 */}
        <div className="title">{this.formatWord(word)}</div>
        {/* 城市 */}

        {citys.map((item) => {
          return (
            <div
              key={item.value}
              className="name"
              onClick={() => {
                // 点击切换城市 只可 北上广深
                let arr = ["北京", "上海", "广州", "深圳"];
                if (arr.indexOf(item.label) !== -1) {
                  // 切换定位城市 跳转回主页
                  localStorage.setItem("current-city", JSON.stringify(item));
                  this.props.history.push("/home/default");
                } else {
                  // antd-mobile 自带
                  Toast.info("该城市暂无房源~~~", 1);
                }
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };
  // 格式化单词
  formatWord = (word) => {
    switch (word) {
      case "#":
        return "当前定位";
      case "hot":
        return "热门城市";
      default:
        return word.toUpperCase();
    }
  };
  //   获取全部城市数据
  async getCitylist() {
    let res = await axios.get(
      "http://api-haoke-dev.itheima.net/area/city?level=1"
    );
    // console.log(res.data.body);
    //1.拿到的 并非想要的数据格式 需要加工处理
    let { citylist, cityIndex } = this.formatCity(res.data.body);
    // console.log(citylist, cityIndex);
    // 2.添加热门城市
    let resHot = await axios.get("http://api-haoke-dev.itheima.net/area/hot");
    citylist["hot"] = resHot.data.body;
    cityIndex.unshift("hot");
    // 3.定位城市 返回的promise 通过await获取resolve
    let locationCity = await getCurrentCity();
    // citylist["current"] = locationCity;// 对应为数组不能直接写resCurrent对象
    citylist["#"] = [locationCity];
    cityIndex.unshift("#");

    // 4.赋值
    this.setState({
      citylist,
      cityIndex,
    });
  }
  //  格式化数据
  formatCity(list) {
    let citylist = {};
    list.forEach((item) => {
      // console.log("每一项数据", item)
      //截取字符串首字母判断  "bj" ====>"b"
      let word = item.short.substr(0, 1);
      // 对象获取值 obj. =值    obj['x']===>存在=值 ，不存在=undefined
      if (citylist[word]) {
        // 有追加
        citylist[word].push(item);
      } else {
        // 没有则 赋值当前对象为一个数组
        citylist[word] = [item]; //第一次进来不能为空 应顺便将数据存入
      }
    });
    // Object.keys(citylist) 获取对象中的键组成数组
    // 按abcd顺序排序 sort()
    let cityIndex = Object.keys(citylist).sort();
    return {
      citylist,
      cityIndex,
    };
  }
  //计算高度 自带参数格式 {index：number} return number
  getHeight = ({ index }) => {
    // console.log(index);
    // 1.通过索引获取单词
    let word = this.state.cityIndex[index];
    // 2.通过单词获取城市
    let citys = this.state.citylist[word];
    return 36 + citys.length * 50;
  };
  // 循环右侧列表
  cityRight = () => {
    return this.state.cityIndex.map((item, index) => {
      return (
        <li
          key={index}
          className={this.state.activeIndex === index ? "active" : ""}
          onClick={() => {
            // 通过ref 获取 List组件dom
            // 通过list组件的 scrollToRow() 方法实现切换
            console.log(this.listRef.current);
            // 默认滚动底部对齐 要设置顶部对齐
            this.listRef.current.scrollToRow(index);
          }}
        >
          {item === "hot" ? "热" : item.toUpperCase()}
        </li>
      );
    });
  };
  // 左侧滚动执行的函数  参数为一个对象
  // ({ overscanStartIndex: number,
  // overscanStopIndex: number,
  // startIndex: number, stopIndex: number }): void
  onRowsRendered = ({
    overscanStartIndex, //预渲染开始
    overscanStopIndex, //预渲染结束
    startIndex, //可视单词顶部索引
    stopIndex, //可视单词底部索引
  }) => {
    // 优化重复索引时 不需要修改
    console.log("顶部单词队形的索引", startIndex);
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      });
    }
  };
  render() {
    return (
      <div className="citylist">
        <NavHeader>
            城市列表
        </NavHeader>
        {/* 内容 */}

        {/* AutoSizer动态计算占满剩余屏幕宽高 height，width */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.listRef}
              scrollToAlignment="start" //滚动顶部对齐
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length} //总条数
              rowHeight={this.getHeight} //动态计算高度 可传数据和函数
              rowRenderer={this.rowRenderer} //每条数据渲染的函数
              onRowsRendered={this.onRowsRendered} //当列表滚动式执行的函数
            />
          )}
        </AutoSizer>
        {/* 右侧列表 */}
        <ul className="city-right">{this.cityRight()}</ul>
      </div>
    );
  }
}
