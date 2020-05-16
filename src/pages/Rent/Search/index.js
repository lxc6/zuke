import React, { Component } from "react";

import { SearchBar } from "antd-mobile";

import { getCurrentCity } from "../../../utils/currentCity";

import { API } from "../../../utils/api";
import styles from "./index.module.css";

export default class Search extends Component {
  // 当前城市id
  // cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: "",
    tipsList: [],
  };
  // 值改变事件
  onChange = (val) => {
    // searchBar组件内部处理了 直接得到的为输入框的值
    console.log("输入的值", val);
    this.setState({ searchTxt: val }); //赋值文本
    if(!val){
      this.setState({tipsList:[]})//1.val为空清空列表
      return;//终止后面代码
    }
    
    clearTimeout(this.timer);//2.定时器  实现防抖
    this.timer = setTimeout(async () => {
      let city = await getCurrentCity();
      let res = await API.get("/area/community", {
        params: {
          name: val,
          id: city.value,
        },
      });
      console.log("搜索列表", res);
      this.setState({ tipsList: res.data.body }); //赋值列表
    }, 500);
  };
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state;

    return tipsList.map((item) => (
      <li 
      key={item.community} 
      className={styles.tip}
      onClick={()=>{
        // 跳转并传参
        this.props.history.push('/rent/add',{
          name:item.communityName,//小区名
          id:item.community//小区id
        })
      }}
      >
        {item.communityName}
      </li>
    ));
  };

  render() {
    const { history } = this.props;
    const { searchTxt } = this.state;

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.onChange}
          showCancelButton={true}
          onCancel={() => history.replace("/rent/add")}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    );
  }
}
