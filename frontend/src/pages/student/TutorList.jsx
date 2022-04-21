import * as React from 'react';
import { List, Avatar, Box, Divider, Button } from '@alifd/next';
import { getAllTutorInfo } from '@/service/student/api';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import Constant from '@/constant';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  handleClickItem = async () => {};

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
        const tutorInfo =  {
            title: item.name,
            description: item.introduction,
            author: "",
            img: "https://img.alicdn.com/tfs/TB1R5fio4v1gK0jSZFFXXb0sXXa-322-216.png"
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
