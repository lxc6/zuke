import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace } from "antd-mobile";

import { Link } from "react-router-dom";

import NavHeader from "../../components/NavHeader";

import styles from "./index.module.css";
import { API } from "../../utils/api";
// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: "",
    password: "",
  };
  //  onChange 文本框值改变时候执行的函数
  getValue = (e) => {
    console.log(e.target.name);
    if (e.target.name === "username") {
      this.setState({
        username: e.target.value,
      });
    } else {
      this.setState({
        password: e.target.value,
      });
    }
  };
  //按钮 submit 提交的 form 标签上的 onSubmit事件
  onSubmit = async (e) => {
    // 阻止默认跳转行为
    e.preventDefault();
    //发送请求
    let { username, password } = this.state;
    let res = await API.get("/user/login", { username, password });
    console.log("登录结果", res);
  };
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={this.onSubmit}>
            <div className={styles.formItem}>
              {/* value+onChange */}
              <input
                value={this.state.username}
                onChange={this.getValue}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                value={this.state.password}
                onChange={this.getValue}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              {/* submit 对应onSubmmit方法 */}
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}

export default Login;
