// 城市定位  获取城市和id
// 频繁发送请求 会浪费资源 可用本地存储定位信息 localstorage
import axios from "axios";
export let getCurrentCity = () => {
  let city = JSON.parse(localStorage.getItem("current-city"));
  if (!city) {
    // 定位为异步操作 无法return 需要配合Promise使用
    // 返回的promise 通过await获取resolve
    return new Promise((resolve, reject) => {
      // 定位
      var myCity = new window.BMap.LocalCity();
      myCity.get(async (result) => {
        var cityName = result.name;
        console.log(cityName);
        //发送请求获取定位城市的id等信息
        let res = await axios.get(
          "http://api-haoke-dev.itheima.net/area/info?name=" + cityName
        );
        //  存入本地
        localStorage.setItem("current-city", JSON.stringify(res.data.body));
        // 不能return 只能用promise返回 在通过await获取resolve
        resolve(res.data.body);
      });
    });
  } else {
    // return city;
    //   对应promise   简写
    return Promise.resolve(city);
  }
};
