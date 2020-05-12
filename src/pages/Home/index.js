// home 组件
import React, { Component } from "react";
import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";
import "./index.css";
import Default from "../Default";
import Houselist from "../Houselist";
import News from "../News";
import Profile from "../Profile";

// 这个底部 一般不会大变化 数据比较死
const tabItems = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home/default",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/houselist",
  },
  {
    title: "资讯",
    icon: "icon-infom",
    path: "/home/news",
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/profile",
  },
];
export default class Home extends Component {
  state = {
    selectedTab: this.props.location.pathname,
    hidden: false, // 是否隐藏
  };
  // 在组件的更新阶段，获取到当前最新的 pathname ，然后，更新状态 selectedTab
  componentDidUpdate(prevProps) {
    // console.log("最新状态 this.props：", this.props);
    // console.log("更新前的props prevProps：", prevProps);
    const pathName = this.props.location.pathname;
    const prevPathName = prevProps.location.pathname;
    // 对比更新前后的两个 pathname ，只有在不同的情况下，更新状态即可
    if (pathName !== prevPathName) {
      this.setState({
        // 更新为当前路由的最新值
        selectedTab: pathName,
      });
    }
  }
  renderItem() {
    return tabItems.map((item, index) => {
      return (
        <TabBar.Item
          key={index} //key必须
          title={item.title} // 文字
          icon={<i className={`iconfont ${item.icon}`}></i>} //默认图标
          selectedIcon={<i className={`iconfont ${item.icon}`}></i>} //选中图标
          selected={this.state.selectedTab === item.path} //控制当前点击的高亮 true高亮 false不高亮
          onPress={() => {
            // 点击修改数据 切换单词 控制高亮 成一个 有意义的单词
            // this.setState({
            //   selectedTab: item.path,
            // });
            // 点击跳转
            this.props.history.push(item.path);
          }}
        ></TabBar.Item>
      );
    });
  }
  render() {
    return (
      <div className="home">
        {/* <h2>Home主页页面</h2> */}
        {/* 二级路由 */}
        <Route exact path="/home/default" component={Default}></Route>
        <Route exact path="/home/houselist" component={Houselist}></Route>
        <Route exact path="/home/news" component={News}></Route>
        <Route exact path="/home/profile" component={Profile}></Route>
        {/* tabbar 切换路由 组件*/}
        <TabBar
          unselectedTintColor="#bbb" //未选中文字颜色 默认文字颜色
          tintColor="#21b97a" // 选中的文字颜色
          barTintColor="white" // 大盒子背景色
          hidden={this.state.hidden} // 是否隐藏tabbar标签 true隐藏 false不隐藏
          noRenderContent={true} // 不渲染默认内容 true不渲染 false(默认)渲染
        >
          {/* 发现 四个 item 差不多 我们就想到 循环  */}
          {/* 循环 tabItems数组 生成四个 底部tab */}
          {/* react 经常把循环的大段代码 写在函数 调用 */}
          {this.renderItem()}
        </TabBar>
      </div>
    );
  }
}
