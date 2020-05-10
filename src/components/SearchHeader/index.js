// search
import React, { Component } from "react";
import { Flex } from "antd-mobile";
import "./index.scss";
// 1.封装组件导入时 history路由没有 要用需导入withRouter
import { withRouter } from "react-router-dom";
// 2.通过prop-types 验证type类型 防止随意传值
import PropTypes from "prop-types";

class SearchHeader extends Component {

  render() {
    return (
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
            <span>{this.props.cityname}</span>
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
    );
  }
}
// 2.导出组件之前验证
// 验证参数    this.props.参数
SearchHeader.propTypes = {
  cityname: PropTypes.string,
};
// 3.默认值
SearchHeader.defaultProps = {
  cityname: "北京",
};
export default withRouter(SearchHeader);
