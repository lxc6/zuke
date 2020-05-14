// 封装token的曾删改  与判断ture&false

let getToken = () => {
  return localStorage.getItem("my-token");
};
let setToken = (val) => {
  localStorage.setItem("my-token", val);
};
let delToken = () => {
  localStorage.removeItem("my-token");
};

// 判断登陆
let isLogin = () => {
  return !!getToken(); //非非 返回 布尔值
};
export { getToken, setToken, delToken, isLogin };
