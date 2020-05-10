// home 组件
import React,{ Component } from 'react'
import SearchHeader from '../../components/SearchHeader/index'
import Filter from './components/Filter'
import './Houselist.scss'
import { getCurrentCity } from "../../utils/currentCity";
import {API}from '../../utils/api'
export default class Houselist extends Component{
    state={
        cityname:'',
        count:0,
        list:null,
      }
      async componentDidMount() {
        // 调用封装函数获取id 数据库中没有的城市 返回上海
        let city = await getCurrentCity()
        // console.log(city);
        
        this.setState({
          cityname:city.label
        })
        // 获取filter并发请求
        // this.getFilter()
      }
    getFilter=async(filter)=>{
      console.log(filter); 
      // filter 涉及到两个函数 1.传参 2.全局变量 3.this.filter
      // 获取房源数据
      this.filter=filter
      this.getHouseList()
      
    }
    // 获取房源数据
    getHouseList=async(filter)=>{
      let city = await getCurrentCity()
      let res = await API.get('/houses',{
        params:{
          cityId:city.value,
          ...this.filter,//延展对象
          start:1,
          end:20
        }    
      })
      console.log(res);
      this.setState({
        list:res.data.body.list,
        count:res.data.body.count
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
            <Filter
            getFilter={this.getFilter}
            ></Filter>
            {/* 房子列表 */}
            <h1>
              房子列表
            </h1>
        </div>
    }
}