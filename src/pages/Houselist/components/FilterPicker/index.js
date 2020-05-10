import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'


export default class FilterPicker extends Component {
  state={
    value:null //选择的值
  }
  render() {
    return (
      <>
        {/* 选择器组件： */}
        <PickerView 
        data={this.props.data} //下拉数据
        value={this.state.value} //选择的值
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
          console.log('点击确定时的props',this.props);
          
          this.props.onSave(this.state.value)
          console.log('点击确定时的props2',this.props);
        }}//却定隐藏 并将value传给filter
        />
      </>
    )
  }
}
