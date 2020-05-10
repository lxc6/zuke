// home 组件
import React,{ Component } from 'react'
import SearchHeader from '../../components/SearchHeader/index'
import Filter from './components/Filter'
import './Houselist.scss'
import { getCurrentCity } from "../../utils/currentCity";
export default class Houselist extends Component{
    state={
        cityname:''
      }
      async componentDidMount() {
        // 调用封装函数获取id 数据库中没有的城市 返回上海
        let city = await getCurrentCity()
        this.setState({
          cityname:city.label
        })
      }
    render(){
        return<div className='houselist'>
            {/* 顶部导航 */}
            <div className='header'>
            {/* 左侧箭头 */}
            <i className="iconfont icon-back" onClick={()=>{this.props.history.goBack()}}></i>
            <SearchHeader cityname={this.state.cityname}></SearchHeader>
            </div>
            {/* 分类筛选 区域 */}
            <Filter></Filter>
        </div>
    }
}