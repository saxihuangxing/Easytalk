import * as React from 'react';
import { List, Avatar, Box, Divider, Button } from '@alifd/next';
import { getAllTutorInfo } from '@/service/common/api';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import Constant from '@/constant';
import Config from '@/config/config';
import { studentInit } from '@/service/student/data';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    studentInit(); 
  }

  handleClickItem = async (index) => {
    const { data } = this.state;
    const itemData = data[index];
    if(itemData){
          const url = `#/home/tutorDetail?tutorId=${itemData.id}`
          window.location.href = url;
    }else{
      alert("can't find item data");
    }
  };

  componentDidMount() {
    console.log('search >>> componentDidMount');
    this.fetchAllTutorInfo();
  }

  /*applyStatus: { type: String},  // 'checking' || 'approved'
    status: { type: String },      // 'normal' || 'deactive'    
    name : { type: String },
    residence: { type: String },
    age: { type: Number },
    gender:{ type:Boolean },
    nationality:{ type:String },
    introduction : { type: String },*/

  render() {
    const { data } = this.state;
    const tutorInfoArr = data.map((item) => {
      let imgUrl = "";
      if(item.photos && item.photos.length > 0){
        imgUrl = Config.serverUrl +  item.photos[0];
      }
      console.log("imgUrl -  " + imgUrl);
      const tutorInfo =  {
          title: item.name + "1",
          description: item.introduction,
          author: "",
          img: imgUrl
        }
      return tutorInfo;
    })
    return (
      <div>
        <List
          dataSource={tutorInfoArr}
          renderItem={(item, i) => (
            <List.Item
              key={i}
              media={<img width="161" height="108" src={item.img} />}
              title={item.title}
              onClick = {() => { this.handleClickItem(i)}}
            >
              <p style={{ margin: '12px 0' }}>{item.description}</p>
              <div>{item.author}</div>
            </List.Item>
          )}
        />
      </div>
    );
  }

  fetchAllTutorInfo = async () => {
    let res = await getAllTutorInfo({});
    if (res && res.code === Constant.RES_SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.setState({ data: res.data });
      }
    }
  };
}
