import * as React from 'react';
import { Dialog, Avatar, Box, Divider, Button, Tag, Table, Message } from '@alifd/next';
import { getTutorInfoById } from '@/service/common/api';
import { bookLesson, LessonStructure } from '@/service/student/api'
import Constant from '@/constant';
import CommonUtil from '@/utils/CommonUtils';
import Config from '@/config/config';
const maxDays = Config.scheduleMaxDays;
import moment from 'moment'; 
import { getMyInfo } from '@/service/student/data';
import { Slider, Icon } from '@alifd/next';
import { getSystemConfig } from '@/service/systemConfig'

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      dlgVisible:false,
    };
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
       let color = 'grey'; 
       const Tags = value.map(ele => {
         const status = scheduleMap[ele];
         const time = moment(parseInt(ele)*60*1000).format('HH:mm');
         switch(status){
             case 1: 
                color = 'blue';
                break;
             case 2: 
                color = 'red';
                break; 
             default:
                 break;
         }
         return(<Tag /* key={`p_p_${color}`}  */
                type="primary" 
                color={color}
                style = {{ position:'relative', marginLeft:'5px',marginTop: '3px' }}
                onClick = {() => this.onSheduleClick(ele)}
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
    const { data } = this.state;
    const { lessonPrice } =  getSystemConfig();
    const timeArea = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!data) {
      return <div>'unknown tutor'</div>;
    }
    const photoEles = data.photos.map((file)=>{
      const url = Config.serverUrl + file;
      return(
        <div  className="slider-img-wrapper">
          <img style={{ width:'500px', height:'300px'}}  src={url} alt={""} />
        </div>
      )
      } 
    );
    const MediaElements = [...photoEles];
    if(data.video){
      const url = Config.serverUrl + data.video;
      const videoEle = (
        <div  className="slider-img-wrapper">
              <video  controls style={{ width:'500px', height:'300px'}} src={url} alt={""} />
        </div>
      )
      MediaElements.unshift(videoEle);
    }
    
    return (
      <div>
        <Slider style={{ width:'500px', height:'300px',marginLeft:'300px' }} arrowSize="medium">
          {MediaElements}
        </Slider>
        <span> {'Name:'} </span>
        <span> {data.name} </span>
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
        <Dialog
          v2
          title="Book Lesson"
          visible={ this.state.dlgVisible }
          onOk={this.dlgConfirm.bind(this)}
          onClose={this.dlgCancel.bind(this)}
        >
          <p>预订本次课程将花费 ${lessonPrice} 金币</p>
        </Dialog>
      </div>
    );
  }

  dlgCancel(){
    this.setState({dlgVisible:false});
  }

  dlgConfirm(){
    this.setState({dlgVisible:false});
    this.startBookLesson(this.curSlotTime);
  }

  fetchTutorInfoById = async (id) => {
    let res = await getTutorInfoById(id, {});
    if (res && res.code === Constant.RES_SUCCESS) {
      if (res.data) {
        this.setState({ data: res.data });
      }
    }
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
      this.setState({dlgVisible:true});
    }     
  }

  async startBookLesson(slotTime){
    const { data } = this.state;
    const { scheduleMap } = data;
    const status = scheduleMap[slotTime];
    const myInfo = getMyInfo();
    const bookTime = (new Date()).getTime();
    const lesson:LessonStructure = {
      stuId: myInfo.id,
      stuName: myInfo.name,
      tutorId: data.id,
      tutorName: data.name,
      bookTime,
      lessonTime: slotTime,
      textBook: "have't decide",
      lessonType: Constant.LESSON_TYPE.BOOK, 
    }
    const res = await bookLesson(lesson);
    if(res.code === Constant.RES_SUCCESS){
        Message.success(" book successful !");
        scheduleMap[slotTime] = 2;
        this.setState({data});
    }else{
        Message.success(" book failed !");
    }
  }
}
