import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'


export default class FilterPicker extends Component {
  // constructor(props){ //数据不变 组件不关闭 切换只执行一次 通过key 解决
  //   super(props)
  //   this.state={
  //     value:this.props.defaultValue //当前(修改前)选择的值
  //   }
  // }
  state={ //
    value:this.props.defaultValue //当前(修改前)选择的值
  }
  render() {
    return (
      <>
        {/* 选择器组件： */}
        <PickerView 
        data={this.props.data} //下拉数据
        value={this.state.value} //再次打开选择的值
        cols={this.props.cols} //列数
        onChange={(val)=>{//切换选择值时会执行
          // console.log(val);
          this.setState({
            value:val//选择之后赋值给value
          })
        }}
        />

        {/* 底部按钮 */}
        <FilterFooter 
        onCancel={this.props.onCancel}//取消隐藏
        onSave={()=>{ 
          this.props.onSave(this.state.value)
        }}//却定隐藏 并将value传给filter
        />
      </>
    )
  }
}
