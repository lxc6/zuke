// 封装的axios 基地址
import axios from "axios";
import { baseURL } from "./baseURL";
import { getToken, delToken } from "./token";
let API = axios.create({
  baseURL,
});

// ----------------请求拦截 发送请求之前执行  谁需要token 给谁加token
API.interceptors.request.use(
  function (config) {
    // config={url,headers...} 所有请求信息  判断需要加token的地址
    if (
      config.url.startsWith("/user") &&
      config.url !== "/user/registered" &&
      config.url !== "/user/login"
    ) {
      // config.headers.名字(接口定的)=token
      config.headers.authorization = getToken();
    } else if (config.url.startsWith("/houses/image")) {
      config.headers.authorization = getToken();
      config.headers["Content-type"] = "multipart/form-data";
    }
    return config;
  }
  //   function (error) {
  //     // Do something with request error
  //     return Promise.reject(error);
  //   }
);

//-------------- 响应拦截 状态码判断  打印错误信息
API.interceptors.response.use(
  function (res) {
    // 400 token过期  401  500
    if (res.data.status === 400) {
      // token异常或过期  删除token
      console.log("token异常或过期 ");
      delToken();
    } else if (res.data.status === 500) {
      console.log("服务器出错");
    }
    return res;
  }
  //   function (error) {
  //     // Do something with response error
  //     return Promise.reject(error);
  //   }
);
export { API };
