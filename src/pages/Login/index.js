import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile";

import { Link } from "react-router-dom";

import NavHeader from "../../components/NavHeader";

import styles from "./index.module.css";
import { API } from "../../utils/api";
// 导入 withFromik 进行表单效验
import { withFormik, Form, Field, ErrorMessage } from "formik";
// 导入yup   * as 导入所有并取名字 Yup
import * as Yup from "yup";
import{setToken} from '../../utils/token'
class Login extends Component {
  render() {
    // console.log("login的props", this.props);
    // Form, Field, ErrorMessage 替换form input标签 和错误提示
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              {/* value+onChange */}
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            <ErrorMessage
              className={styles.error}
              name="username"//提示对应错误字段
              component="div"
            />
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            <ErrorMessage
              className={styles.error}
              name="password"
              component="div"
            />
            <div className={styles.formSubmit}>
              {/* submit 对应onSubmmit方法 */}
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>

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
  // 表单提交   两个参数 values   obj {prpps, XXX,XXX,...}
  handleSubmit: async (values, { props }) => {
    // 内部实现阻止默认跳转行为
    let { username, password } = values;
    let res = await API.post("/user/login", { username, password });
    // console.log("登录结果", res.data);
    if (res.data.status === 200) {
      // 调用封装的token
      setToken(res.data.body.token); //存入缓存
      Toast.success("登陆成功~~", 1);
      // props.history.push('/home/profile')//跳转到用户 
      props.history.go(-1)//应该 跳转到上一页 及正在浏览的
    } else {
      Toast.fail("登录失败~~", 2);
    }
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
