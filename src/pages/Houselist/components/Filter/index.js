import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
// import FilterMore from "../FilterMore";
import { API } from "../../../../utils/api";
import { getCurrentCity } from "../../../../utils/currentCity";
import styles from "./index.module.css";
import FilterMore from "../FilterMore";
const titleSelected = {
  area: false,
  mode: false,
  price: false,
  more: false,
};
export default class Filter extends Component {
  state = {
    titleSelected: titleSelected,
    openType: "", //通过其判断picker，more组件是否显示
    filterList: [],
    selectedValus: {
      //存四个选择条件的默认值
      area: ["area", "null"],
      mode: ["null"],
      price: ["null"],
      more: [],
    },
  };
  componentDidMount() {
    this.getFilter();
  }
  //获取所有数据
  getFilter = async () => {
    let city = await getCurrentCity(); //注意 await
    let res = await API.get("/houses/condition?id=" + city.value);
    // console.log(res.data.body);
    this.setState({
      filterList: res.data.body,
    });
  };
  // 样式
  changeLight = (type) => {
    console.log("触发了父元素点击事件", type);
    this.setState({
      titleSelected: {
        ...titleSelected, //全部拷贝
        [type]: true, //[type]才为变量  type只是单纯的字符串属性
      },
      openType: type, //获取当前点击的标题  area mode price
    });
  };
  // 判断显示picker组件
  renderPicker = () => {
    let {
      openType,
      filterList: { area, subway, rentType, price },
    } = this.state; //结构赋值
    if (openType === "area" || openType === "mode" || openType === "price") {
      let data = []; //根据条件判断数据中包含的对象
      let cols = 0;
      let defaultValue = this.state.selectedValus[openType]; //当前选择的值
      switch (openType) {
        case "area":
          data = [area, subway];
          cols = 3;
          break;
        case "mode":
          data = rentType;
          cols = 1;
          break;
        case "price":
          data = price;
          cols = 1;
          break;

        default:
          break;
      }
      return (
        <FilterPicker
          key={openType} //通过key解决组件constructor只执行一次的bug
          data={data}
          cols={cols}
          defaultValue={defaultValue}
          onCancel={this.onCancel} //取消隐藏
          onSave={this.onSave} //却定隐藏
        />
      );
    } else {
      return null;
    }
  };
  // more组件
  renderMore = () => {
    let {
      openType,
      filterList: { roomType, characteristic, floor, oriented },
    } = this.state;
    let data = { roomType, characteristic, floor, oriented };
    let defaultValue = this.state.selectedValus["more"]; //当前选择的值
    if (openType === "more") {
      return (
        <FilterMore
          data={data}
          defaultValue={defaultValue}
          onSave={this.onSave} //确定触发
        />
      );
    } else {
      return null;
    }
  };
  // footer-->picker--->点击取消隐藏
  onCancel = () => {
    this.setState({
      openType: "",
    });
  };
  // footer-->picker--->点击确定隐藏
  onSave = (value) => {
    //获取到的值存入selectedVlues
    let type = this.state.openType;
    this.setState(
      {
        selectedValus: {
          ...this.state.selectedValus, //展开复制
          [type]: value,
        },
        openType: "",
      },
      () => {
        console.log(this.state.selectedValus); //setState第二参数实现 最新数据
        // 处理数据格式 并传给houselist 进行发送请求
        // 得到的格式
        // {
        //   area: (3)[
        //     ("area", "AREA|e716d8e3-fd5b-88bb", "AREA|ef8f445a-dfd6-eecd")
        //   ];
        //   mode: ["null"];
        //   price: ["null"];
        //   more: [];
        // }
        // 需求的格式
        // { area:'AREA|67fad918-fe-123' , 或者 subwar:'subway|67fad918-fe-123'
        //  mode:'true',//或者'null' 或者'false'
        //  price:'PRICE|2000',
        //  more:'ROOM|d4a692e4-a177-37fd,FLOOR|2' }
        let filter = {};
        let { area, mode, price, more } = this.state.selectedValus;
        let areaName = area[0];//键
        let areaValue = "null";//值
        if (area.length === 3) {
          areaValue = area[2] !== "null" ? area[2] : area[1];//判断area 的value值
        }
        filter[areaName] = areaValue
        filter.mode = mode[0];
        filter.price = price[0];
        filter.more = more.join(",");
        // 子传父
        this.props.getFilter(filter)
      }
    );
  };
  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}

        <div className={styles.content}>
          {/* 标题栏  传值判断选中*/}
          <FilterTitle
            titleSelected={this.state.titleSelected}
            changeLight={this.changeLight}
          />

          {/* 前三个菜单对应的内容： */}

          {this.renderPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderMore()}
        </div>
      </div>
    );
  }
}
