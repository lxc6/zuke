// citylist 组件
import React, { Component } from "react";
import { NavBar, Icon } from "antd-mobile";
import axios from "axios";
import "./citylist.scss";
import { getCurrentCity } from "../../utils/currentCity";
// 导入可视区域渲染
import { List } from "react-virtualized";

export default class Home extends Component {
 
  state = {
    citylist: {}, //左侧城市数据
    cityIndex: [], //右侧字母数据
  };
  componentDidMount() {
    
    this.getCitylist();
  }
  // ------
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    return (
      <div key={key} style={style}>
        {this.state.cityIndex[index]}------hahhhahha
      </div>
    );
  };
  //   获取全部城市数据
  async getCitylist() {
    let res = await axios.get(
      "http://api-haoke-dev.itheima.net/area/city?level=1"
    );
    // console.log(res.data.body);
    //1.拿到的 并非想要的数据格式 需要加工处理
    let { citylist, cityIndex } = this.formatCity(res.data.body);
    console.log(citylist, cityIndex);
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
  render() {
    return (
      <div className="citylist">
        <NavBar
          className="navbar"
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            console.log(this.props.history);
            this.props.history.goBack();
          }}
        >
          城市列表
        </NavBar>
        {/* 内容 */}
        <div className="content">
          <List
            width={300}
            height={600}
            rowCount={this.state.cityIndex.length}
            rowHeight={100}
            rowRenderer={this.rowRenderer}
          />
        </div>
      </div>
    );
  }
}
