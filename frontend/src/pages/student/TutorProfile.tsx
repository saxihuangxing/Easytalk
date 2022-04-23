import * as React from 'react';
import { List, Avatar, Box, Divider, Button, Tag, Table, Message } from '@alifd/next';
import { getTutorInfoById } from '@/service/common/api';
import { bookLesson, LessonStructure } from '@/service/student/api'
import Constant from '@/constant';
import CommonUtil from '@/utils/CommonUtils';
import Config from '@/config/config';
const maxDays = Config.scheduleMaxDays;
import moment from 'moment'; 
import styles from './tutorProfile.module.css';
import { getMyInfo } from '@/service/student/data';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
    };
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

 /*  renderCell(rowIndex, value, record) {
    let classStyle;
    const { scheduleMap } = this.state.data;
    const available = 'forestgreen';
    const bookByOthers = 'crimson';
    const bookBySelf = 'orange';
    let color = 'grey';
    const Tags = value.map((ele) => {
      const status = scheduleMap[ele];
      const time = moment(parseInt(ele) * 60 * 1000).format('HH:mm');
      switch (status) {
        case 1:
          classStyle = styles.slotAvailable;
          break;
        case 2:
          classStyle = styles.bookedByOthers;
          break;
        default:
          classStyle = styles.slotAvailable;
          break;
      }
      return (
        <div
          className={`${styles.slot} ${classStyle}`}
          onClick={() => {
            this.setSlot(rowIndex, colIndex, value);
          }}
        >
          {time}
        </div>
      );
    });
    return (<div>{Tags}</div>);
  } */

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
    const timeArea = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!data) {
      return <div>'unknown tutor'</div>;
    }
    return (
      <div>
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
      </div>
    );
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
    const myInfo = getMyInfo();
    const bookTime = (new Date()).getTime();
    //alert('status = ' + status);
    if (status === 1) {
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
}
