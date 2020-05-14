import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile";

import { Link } from "react-router-dom";

import NavHeader from "../../components/NavHeader";

import styles from "./index.module.css";
import { API } from "../../utils/api";
// 导入 withFromik 进行表单效验
import { withFromik } from "formik";
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
    // submit会跳转 阻止默认跳转行为
    e.preventDefault();
    //发送请求
    let { username, password } = this.state;
    let res = await API.post("/user/login", { username, password });
    console.log("登录结果", res.data);
    if (res.data.status === 200) {
      localStorage.setItem("my-token", res.data.body.token); //存入缓存
      Toast.success("登陆成功~~", 2);
    } else {
      Toast.fail("登录失败~~", 2);
    }
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
// withFromik({表单相关配置-效验方法})(组件) 
// 绑定之后 this.props 中存在formik数据和方法
export default withFromik({
  mapPropsToValues: () => {//相当于配置表单数据 state  原有state到这里
    return { name :''}
 },
 handleSubmit: (values, { setSubmitting }) => {
   setTimeout(() => {
     alert(JSON.stringify(values, null, 2));
     setSubmitting(false);
   }, 1000);
 }
})(Login);
