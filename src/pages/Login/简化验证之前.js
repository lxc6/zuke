import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile";

import { Link } from "react-router-dom";

import NavHeader from "../../components/NavHeader";

import styles from "./index.module.css";
import { API } from "../../utils/api";
// 导入 withFromik 进行表单效验
import { withFormik } from "formik";
// 导入yup   * as 导入所有并取名字 Yup
import * as Yup from "yup";
console.log("Yup新版本有bug开头一定要加.string()才能生效", Yup);
// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    // values---数据
    // handleChange 自带实现赋值  ---onchange对应的函数
    // handleSubmit 表单提交事件 内部实现阻止默认跳转行为
    let {
      errors,
      handleSubmit,
      handleChange,
      values: { username, password },
    } = this.props;
    console.log("login的props", this.props);

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              {/* value+onChange */}
              <input
                value={username}
                onChange={handleChange}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
           {errors.username?<div className={styles.error}>{errors.username}</div>:''}
            
            <div className={styles.formItem}>
              <input
                value={password}
                onChange={handleChange}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {errors.password?<div className={styles.error}>{errors.password}</div>:''}
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
// 绑定之后 this.props 中存在formik数据和方法和效验结果等等
export default withFormik({
  mapPropsToValues: () => {
    //相当于配置表单数据 state  原有state到这里
    return { username: "", password: "" };
  },
  // 表单提交   两个参数 values   obj {}
  handleSubmit: async (values, { setSubmitting }) => {
    // 内部实现阻止默认跳转行为
    let { username, password } = values;
    let res = await API.post("/user/login", { username, password });
    console.log("登录结果", res.data);
    if (res.data.status === 200) {
      localStorage.setItem("my-token", res.data.body.token); //存入缓存
      Toast.success("登陆成功~~", 2);
    } else {
      Toast.fail("登录失败~~", 2);
    }
    //
    // setTimeout(() => {
    //   alert(JSON.stringify(values, null, 2));
    //   setSubmitting(false);
    // }, 1000);
  },
  // 效验  validationSchema:Yup.Object().shap({}) 规定写法   版本有问题
  validationSchema: Yup.object().shape({
    // required() 必填  新版本 开头一定要加.string()才能生效  number
    // matches() 自己配置正则  错误提示在this.props.errors中
    username: Yup.string()
      .required("用户名不能为空！")
      .matches(/^\w{5,8}$/, "用户名必须5-8位 数字，字母，下划线"),
    password: Yup.string()
      .required("密码不能为空！")
      .matches(/^\w{5,12}$/, "密码必须5-12位 数字，字母，下划线"),
  }),
})(Login);
