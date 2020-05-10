import React from "react";

import { Flex } from "antd-mobile";

import styles from "./index.module.css";

// 条件筛选栏标题数组：
const titleList = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" },
];

export default function FilterTitle(props) {
  // console.log("filter传过来的值", props);
  let { titleSelected,changeLight } = props;
  // props 只读不能修改  需要子传父修改父数据
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map((item) => {
        // 当前项的选中状态
        let isSelected=titleSelected[item.type]
        return (
          <Flex.Item key={item.type}
            onClick={()=>{
              changeLight(item.type)
            }}
          >
            {/* 选中类名： selected  styles.selected*/}
            <span className={[styles.dropdown, isSelected?styles.selected:""].join(" ")}>
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        );
      })}
    </Flex>
  );
}
