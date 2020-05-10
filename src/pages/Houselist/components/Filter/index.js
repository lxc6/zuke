import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
// import FilterMore from "../FilterMore";
import { API } from "../../../../utils/api";
import { getCurrentCity } from "../../../../utils/currentCity";
import styles from "./index.module.css";
const titleSelected = {
  area: false,
  mode: false,
  price: false,
  more: false,
};
export default class Filter extends Component {
  state = {
    titleSelected: titleSelected,
    openType: "", //通过其判断picker组件是否显示
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

  randerPicker = () => {
    let {
      openType,
      filterList: {
        area,
        roomType,
        subway,
        characteristic,
        floor,
        rentType,
        oriented,
        price,
      },
    } = this.state; //结构赋值
    if (openType === "area" || openType === "mode" || openType === "price") {
      let data = []; //根据条件判断数据中包含的对象
      let cols = 0;
      let defaultValue = this.state.selectedValus[openType] //当前选择的值
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
          key={openType}//通过key解决组件constructor只执行一次的bug
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
    this.setState({
      selectedValus: {
        ...this.state.selectedValus, //展开复制
        [type]: value,
      },
      openType: "",
    },
    ()=>{
      console.log(this.state.selectedValus);//执行完在打印不要直接打印
    });
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

          {this.randerPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    );
  }
}
