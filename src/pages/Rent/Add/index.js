import React, { Component } from "react";

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast,
} from "antd-mobile";

import NavHeader from "../../../components/NavHeader";
import HousePackge from "../../../components/HousePackage";

import styles from "./index.module.css";
import { API } from "../../../utils/api";
const alert = Modal.alert;

// 房屋类型
const roomTypeData = [
  { label: "一室", value: "ROOM|d4a692e4-a177-37fd" },
  { label: "二室", value: "ROOM|d1a00384-5801-d5cd" },
  { label: "三室", value: "ROOM|20903ae0-c7bc-f2e2" },
  { label: "四室", value: "ROOM|ce2a5daa-811d-2f49" },
  { label: "四室+", value: "ROOM|2731c38c-5b19-ff7f" },
];

// 朝向：
const orientedData = [
  { label: "东", value: "ORIEN|141b98bf-1ad0-11e3" },
  { label: "西", value: "ORIEN|103fb3aa-e8b4-de0e" },
  { label: "南", value: "ORIEN|61e99445-e95e-7f37" },
  { label: "北", value: "ORIEN|caa6f80b-b764-c2df" },
  { label: "东南", value: "ORIEN|dfb1b36b-e0d1-0977" },
  { label: "东北", value: "ORIEN|67ac2205-7e0f-c057" },
  { label: "西南", value: "ORIEN|2354e89e-3918-9cef" },
  { label: "西北", value: "ORIEN|80795f1a-e32f-feb9" },
];

// 楼层
const floorData = [
  { label: "高楼层", value: "FLOOR|1" },
  { label: "中楼层", value: "FLOOR|2" },
  { label: "低楼层", value: "FLOOR|3" },
];

export default class RentAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: {
        name: "",
        id: "",
      },
      // 价格
      price: "",
      // 面积
      size: 0,
      // 房屋类型
      roomType: "",
      // 楼层
      floor: "",
      // 朝向：
      oriented: "",
      // 房屋标题
      title: "",
      // 房屋图片
      houseImg: "",
      // 房屋配套：
      supporting: "",
      // 房屋描述
      description: "",
    };
  }
  componentDidMount() {
    console.log(this.props.location);
    if (this.props.location.state) {
      //防止 xxx of undefined报错
      let { state } = this.props.location; //获取小区名与id state:{name,id}
      this.setState({
        community: state,
      });
    }
  }
  // 取消编辑，返回上一页
  onCancel = () => {
    alert("提示", "放弃发布房源?", [
      {
        text: "放弃",
        onPress: async () => this.props.history.push('/home/default'),
      },
      {
        text: "继续编辑",
      },
    ]);
  };
  // 获取录入房屋信息
  getValue = (type, val) => {
    this.setState({
      [type]: val,
    });
    console.log(val);
  };
  // 获取本地图片（前端）
  getImage = (files, operationType, index) => {
    console.log("files", files); //文件地址
    // console.log('operationType',operationType);//操作 add，remove
    // console.log('index',index);//操作的索引
    this.setState({
      tempSlides: files,
    });
    this.getRealImage()//获取后端传回地址
  };
  onSelect = (res) => {
    console.log(res.join("|"));
    this.setState({
      supporting: res.join("|"),
    });
  };
  // 获取图片真是地址（后端）
  getRealImage= async()=>{
      // 获取图片真实地址
      let formdata = new FormData();//二进制数据处理
      if (this.state.tempSlides.length > 0) {
        //有图片
        this.state.tempSlides.forEach((item) => {
        //遍历图片append追加到formdata
          formdata.append("file", item.file); //二进制处理
        });
      }
      let res = await API.post("/houses/image", formdata);
      console.log('后端返回图片地址',res.data.body);
      this.setState({
        houseImg:res.data.body.join('|')
      })
  }
  // 提交
  addHouse = async () => {
    let house = { ...this.state };
    // console.log(house);
    delete house.tempSlides//删除对象中的属性
    delete house.community//删除对象中的属性
    console.log(house);
    
    let res = await API.post('/user/houses',house) 
    console.log(res);
    if(res.data.status===200){
      // 成功后 提示并跳转页面
      Toast.success('发布成功',1)
      this.props.history.push('/rent')
    }else{
      Toast.error('发布失败',1)
    }
    
  };
  render() {
    const Item = List.Item;
    const { history } = this.props;
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
    } = this.state;

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        <List
          className={styles.header}
          renderHeader={() => "房源信息"}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          {/* Route 组件  history有问题 要props传值 */}
          <Item
            extra={community.name || "请输入小区名称"}
            arrow="horizontal"
            onClick={() => history.replace("/rent/search")}
          >
            小区名称
          </Item>
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
            // onChange={this.getValue}//内部处理 直接val
            onChange={(val) => {
              //需要传val
              this.getValue("price", val);
            }}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={(val) => {
              //需要传val
              this.getValue("size", val);
            }}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={[roomType]}
            cols={1}
            onChange={(val) => {
              //需要传val
              console.log(val); //val为 数组 val[0]
              this.getValue("roomType", val[0]);
            }}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker
            data={floorData}
            value={[floor]}
            cols={1}
            onChange={(val) => {
              //需要传val
              this.getValue("floor", val[0]);
            }}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            data={orientedData}
            value={[oriented]}
            cols={1}
            onChange={(val) => {
              //需要传val
              this.getValue("oriented", val[0]);
            }}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => "房屋标题"}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(val) => {
              //需要传val
              this.getValue("title", val);
            }}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => "房屋图像"}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true} //多图
            className={styles.imgpicker}
            onChange={this.getImage}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => "房屋配置"}
          data-role="rent-list"
        >
          {/* HousePackge组件ul--li封装 */}
          <HousePackge select onSelect={this.onSelect} />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => "房屋描述"}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(val) => {
              //需要传val
              this.getValue("description", val);
            }}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    );
  }
}
