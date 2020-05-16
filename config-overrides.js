// 重写webpack覆盖  打包优化  具体代码ant-mobile官网
const { override, fixBabelImports } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    style: "css",
  })
);
