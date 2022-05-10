import * as React from 'react';
import { Dialog, Avatar, Box, Divider, Button, Tag, Table, Message, Card } from '@alifd/next';
import { getTutorInfoById } from '@/service/common/api';
import { bookLesson, LessonStructure, getBookedLesson, getMyWallet } from '@/service/student/api'
import Constant from '@/constant';
import CommonUtil from '@/utils/CommonUtils';
import Config from '@/config/config';
const maxDays = Config.scheduleMaxDays;
import moment from 'moment';
import { getMyInfo } from '@/service/student/data';
import { Slider, Icon } from '@alifd/next';
import { getSystemConfig } from '@/service/systemConfig'
import { WindowsFilled } from '@ant-design/icons';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      bookedLessons: [],
      dlgVisible: false,
      dlgContent: "",
      balance:0,
    };
    this.inSufficentCoin = false;
    this.curSlotTime = null;
  }

  componentDidMount() {
    console.log('search >>> componentDidMount');
    const tutorId = CommonUtil.getQueryVariable('tutorId');
    this.fetchTutorInfoById(tutorId);
  }

  dataSource(scheduleMap) {
    const result = [];
    const schArr = new Array(maxDays).fill(0).map((_) => new Array());
    for (let key in scheduleMap) {
      const timeMs = parseInt(key) * 60 * 1000;
      const dt = this.daysDistance(timeMs);
      if (dt >= 0 && dt < maxDays) {
        schArr[dt].push(key);
      }
    }

    Array.from({ length: maxDays }, (_, i) => {
      // Obj['day' + j] = statusArr[i][j];
      result.push({
        time: moment().add('days', i).format('MMM DD(ddd)'),
        schedule: schArr[i],
      });
    });
    return result;
  }
  
  renderCell(rowIndex, value, record) {
    const { scheduleMap } = this.state.data;
    const { bookedLessons } = this.state;
    let color = 'grey';
    const Tags = value.map(ele => {
      const status = scheduleMap[ele];
      const time = moment(parseInt(ele) * 60 * 1000).format('HH:mm');
      switch (status) {
        case 1:
          color = 'blue';
          break;
        case 2:{
          color = 'yellow';
          for(let i in bookedLessons){
            if(bookedLessons[i].lessonTime == ele){
              color = 'red';
              break;
            }
          }
          break;
        }
        default:
          break;
      }
      return (<Tag /* key={`p_p_${color}`}  */
        type="primary"
        color={color}
        style={{ position: 'relative', marginLeft: '5px', marginTop: '3px' }}
        onClick={() => this.onSheduleClick(ele)}
      >
        {time}
      </Tag>)
    })
    return (
      <div>
        {Tags}
      </div>
    );
  }

  render() {
    const { data, balance } = this.state;
    const { lessonPrice }  = getSystemConfig();
    if (!data) {
      return <div></div>;
    }
    const timeArea = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const photoEles = data.photos.map((file) => {
      const url = Config.serverUrl + file;
      return (
        <div className="slider-img-wrapper">
          <img style={{ width: '500px', height: '300px' }} src={url} alt={""} />
        </div>
      )
    }
    );
    const MediaElements = [...photoEles];
    if (data.video) {
      const url = Config.serverUrl + data.video;
      const videoEle = (
        <div className="slider-img-wrapper">
          <video controls style={{ width: '500px', height: '300px' }} src={url} alt={""} />
        </div>
      )
      MediaElements.unshift(videoEle);
    }
    let dlgContent = "";
    if(balance >= lessonPrice){
      this.inSufficentCoin = false;
      dlgContent = <p>您当前余额为{balance}金币,预订本次课程将花费 {lessonPrice} 金币</p>
    }else{
      this.inSufficentCoin = true;
      dlgContent = <div><span>余额不足,您当前余额为{balance}金币,课程需要{lessonPrice}金币，是否去充值?</span> </div>
    }
    return (
      <div>
        <Card free>
          <Card.Header title="教师信息" />
          <Card.Divider />
          <Card.Content>
          <div style={{ width:'500px',height:'300px',display:'inline-block'}}> 
            <Slider style={{ width: '500px', height: '300px' }} arrowSize="medium">
              {MediaElements}
            </Slider>
           </div> 
          <div style={{ width:'400px',height:'300px',display:'inline-block' , marginLeft: '20px'}}> 
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}> {'名字:  ' + data.name} </span>
              <br></br>
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}> {'年龄:  ' + data.age} </span>
              <br></br>
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}> {'介绍:  ' + data.introduction} </span>
          </div>
          </Card.Content>
        </Card>
        <Card free>
          <Card.Header title="时间表" />
          <Card.Divider style = {{ marginBottom:'5px' }}/>
          <span   style={{ position: 'relative',marginLeft: '20px',marginRight: '2px' }} >可预订:</span>
          <Tag
            type="primary"
            color={'blue'}
            style={{ position: 'relative', width:'30px', height:'20px' }}
          />
          <span style={{ position: 'relative',marginLeft: '10px',marginRight: '2px' }} >已被其他人预订:</span>
          <Tag
            type="primary"
            color={'yellow'}
            style={{  width:'30px', height:'20px' }}
          />
          <span style={{ position: 'relative',marginLeft: '10px',marginRight: '2px' }} >你的预订:</span>
          <Tag
            type="primary"
            color={'red'}
            style={{ position: 'relative', width:'30px', height:'20px' }}
          />
          <Card.Content>
            {data.scheduleMap && (
              <Table dataSource={this.dataSource(data.scheduleMap)} size={'small'}>
                <Table.Column title={timeArea} dataIndex="time" width={"20%"} />
                <Table.Column
                  title={'schedule'}
                  dataIndex="schedule"
                  cell={(value, index, record) => {
                    return this.renderCell(index, value, record);
                  }}
                  width={220}
                />
              </Table>
            )}
          </Card.Content>
        </Card>
        <Dialog
          v2
          title="Book Lesson"
          visible={this.state.dlgVisible}
          onOk={this.dlgConfirm.bind(this)}
          onClose={this.dlgCancel.bind(this)}
        >
          { dlgContent }
        </Dialog>
      </div>
    );
  }

  dlgCancel() {
    this.setState({ dlgVisible: false });
  }

  dlgConfirm() {
    if(this.inSufficentCoin){
      this.setState({ dlgVisible: false });
      window.location.href = "#/home/topup";
      return;
    }else{
      this.setState({ dlgVisible: false });
      this.startBookLesson(this.curSlotTime);
    }
  }

  fetchTutorInfoById = async (id) => {
    let res = await getBookedLesson();
    if (res && res.code === Constant.RES_SUCCESS) {
        this.state.bookedLessons = res.data;
    }
    res = await getMyWallet();
      if (res && res.code === Constant.RES_SUCCESS) {
        if (res.data) {
          this.state.balance = res.data.balance;
        }
    }
    res = await getTutorInfoById(id, {});
    if (res && res.code === Constant.RES_SUCCESS) {
      if (res.data) {
        this.state.data = res.data;
      }
    }
    this.setState({state:this.state});
  };

  daysDistance(endTime) {
    const nowTime = new Date();
    nowTime.setHours(0, 0, 0, 0);
    const t = endTime - nowTime.getTime();
    const d = Math.floor(t / 1000 / 60 / 60 / 24);
    return d;
  }

  async onSheduleClick(slotTime) {
    const { data } = this.state;
    const { scheduleMap } = data;
    const status = scheduleMap[slotTime];
    //alert('status = ' + status);
    if (status === 1) {
      this.curSlotTime = slotTime;
      this.setState({ dlgVisible: true });
    }
  }

  async startBookLesson(slotTime) {
    const { data, bookedLessons } = this.state;
    const { lessonPrice }  = getSystemConfig();
    const { scheduleMap } = data;
    const myInfo = getMyInfo();
    const bookTime = (new Date()).getTime();
    const lesson: LessonStructure = {
      stuId: myInfo.id,
      stuName: myInfo.name,
      tutorId: data.id,
      tutorName: data.name,
      bookTime,
      lessonTime: slotTime,
      textBook: "",
      lessonType: Constant.LESSON_TYPE.BOOK,
    }
    const res = await bookLesson(lesson);
    if (res.code === Constant.RES_SUCCESS) {
      Message.success(" book successful !");
      scheduleMap[slotTime] = 2;
      bookedLessons.push(lesson);
      this.state.balance -=  lessonPrice;
      this.setState({ data, bookedLessons, balance:this.state.balance });
    } else {
      Message.success(" book failed !");
    }
  }
}
