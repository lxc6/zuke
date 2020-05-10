import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    selectedValue:this.props.defaultValue//选中的标签
  };
  // 渲染标签
  renderFilters(arr) {   
    // 高亮类名： styles.tagActive
    
    return arr.map((item) => {
      let isAcative = this.state.selectedValue.indexOf(item.value)!==-1//高亮
      return (
        <span
          key={item.value}
          onClick={()=>{
              let newSelect = [...this.state.selectedValue]//修改数组用新数组进行修改
              let index = newSelect.indexOf(item.value)//点击选取和取消
             if(index===-1){
              newSelect.push(item.value)           
             }else{
              newSelect.splice(index,1)
             }
             this.setState({
              selectedValue:newSelect
            })
          }}
          className={[styles.tag, isAcative?styles.tagActive:''].join(" ")}
        >
          {item.label}
        </span>
      );
    });
  }

  render() {
    console.log(this.props.data);
    console.log(this.props.defaultValue);
    
    let { data } = this.props;
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(data.roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(data.oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(data.floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>
              {this.renderFilters(data.characteristic)}
            </dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText='清空'// 传啥是啥 不传默认消
          onCancel={//单独清空处理
            ()=>{       
              this.setState({
                selectedValue:[]//清空数据
              })
            }
          }
          onSave={() => {
            this.props.onSave(this.state.selectedValue);
          }}
        />
      </div>
    );
  }
}
