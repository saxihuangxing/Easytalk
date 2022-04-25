import React, { Component } from 'react';
import { Table, Icon, MenuButton, Button, Message } from '@alifd/next';
import moment from 'moment';
import styles from './index.module.css';
import { getTutorSchedule, setTutorSchedule } from '@/service/tutor/dataSource';
import Constant from '@/constant';
import Config from '@/config/config';
const { Item } = MenuButton;
const times = [
  '0:00-0:30 am',
  '0:30-1:00 am',
  '1:00-1:30 am',
  '1:30-2:00 am',
  '2:00-2:30 am',
  '2:30-3:00 am',
  '3:00-3:30 am',
  '3:30-4:00 am',
  '4:00-4:30 am',
  '4:30-5:00 am',
  '5:00-5:30 am',
  '5:30-6:00 am',
  '6:00-6:30 am',
  '6:30-7:00 am',
  '7:00-7:30 am',
  '7:30-8:00 am',
  '8:00-8:30 am',
  '8:30-9:00 am',
  '9:00-9:30 am',
  '9:30-10:00 am',
  '10:00-10:30 am',
  '10:30-11:00 am',
  '11:00-11:30 am',
  '11:30-12:00 am',
  '0:00-0:30 pm',
  '0:30-1:00 pm',
  '1:00-1:30 pm',
  '1:30-2:00 pm',
  '2:00-2:30 pm',
  '2:30-3:00 pm',
  '3:00-3:30 pm',
  '3:30-4:00 pm',
  '4:00-4:30 pm',
  '4:30-5:00 pm',
  '5:00-5:30 pm',
  '5:30-6:00 pm',
  '6:00-6:30 pm',
  '6:30-7:00 pm',
  '7:00-7:30 pm',
  '7:30-8:00 pm',
  '8:00-8:30 pm',
  '8:30-9:00 pm',
  '9:00-9:30 pm',
  '9:30-10:00 pm',
  '10:00-10:30 pm',
  '10:30-11:00 pm',
  '11:00-11:30 pm',
  '11:30-12:00 pm',
];

const maxDays = Config.scheduleMaxDays;

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.statusArr = new Array(48).fill(0).map((_) => new Array(maxDays).fill(0));
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    this.todayStartTime = parseInt(date.getTime() / 1000 / 60);
  }

  async fetchTutorSchedule() {
    const scheduleMap = await getTutorSchedule();
    const statusArr = this.state.statusArr;
    const date = new Date();
    const advanceTime = 30; // it represent slot's time should more than this amount minutes to enable operate.
    const curTime = parseInt(date.getTime() / 1000 / 60);
    for (let i = 0; i < 48; i++) {
      for (let j = 0; j < maxDays; j++) {
        const slotTime = this.todayStartTime + j * 24 * 60 + i * 30;
        if (slotTime < curTime + advanceTime) {
          statusArr[i][j] = -1;
        } else {
          if (scheduleMap && scheduleMap[`${slotTime}`] != undefined) {
            statusArr[i][j] = scheduleMap[`${slotTime}`];
          } 
        }
      }
    }
    this.setState({ statusArr });
  }

  onClose = () => {};

  componentWillMount() {
    this.fetchTutorSchedule();
  }

  componentDidMount() {}

  renderCell(rowIndex, colIndex, value) {
    let classStyle;
    switch (value) {
      case -1:
        classStyle = styles.slotPassed;
        break;
      case 0:
        classStyle = styles.slotUnavailable;
        break;
      case 1:
        classStyle = styles.slotAvailable;
        break;
      case 2:
        classStyle = styles.lostBooked;
        break;
      default:
        break;
    }
    return (
      <div className={`${styles.slot} ${classStyle}`} onClick={() => { this.setSlot(rowIndex, colIndex, value) }}>
        {' '}
      </div>
    );
  }

  render() {
    const timeArea = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <div>
        <Button onClick={this.uploadSchedule.bind(this)} type="primary" className={styles.ConfirmButton}>
          Confirm Schdule
        </Button>
        <Table dataSource={this.dataSource()} size={'small'}>
          <Table.Column title={timeArea} dataIndex="time" width={220} />
          {Array.from({ length: maxDays }, (_, i) => (
            <Table.Column
              title={moment().add('days', i).format('MMM DD(ddd)')}
              key={i}
              dataIndex={`day${i}`}
              width={200}
              cell={(value, index, record) => {
                return this.renderCell(index, i, value, record);
              }}
              style={{ padding: 0 }}
            />
          ))}
        </Table>
      </div>
    );
  }

  dataSource() {
    const result = [];
    const statusArr = this.state.statusArr;
     
    for (let i = 0; i < 48; i++) {
      const Obj = {};
      Array.from({ length: maxDays }, (_, j) => {
        Obj['day' + j] = statusArr[i][j];
      });
      result.push({
        time: times[i],
        ...Obj
        /* day0: statusArr[i][0],
        day1: statusArr[i][1],
        day2: statusArr[i][2],
        day3: statusArr[i][3],
        day4: statusArr[i][4],
        day5: statusArr[i][5],
        day6: statusArr[i][6], */
      });
    }
    return result;
  }

  async uploadSchedule(){
    let scheduleMap = {};
    const { statusArr } = this.state;
    for (let i = 0; i < 48; i++) {
      for (let j = 0; j < maxDays; j++) {
        const slotTime = this.todayStartTime + j * 24 * 60 + i * 30;
        if(statusArr[i][j] !== -1 && statusArr[i][j] !== 0 ){
          scheduleMap[slotTime] = statusArr[i][j];
        }
      }
    }
    const res = await setTutorSchedule(scheduleMap);
    if(res && res.code == Constant.RES_SUCCESS){
      Message.success('update schedule success');
    }else{
      Message.error('update schedule failed');
      this.fetchTutorSchedule();
    }
  }

  setSlot(rowIndex, colIndex, value) {
    console.log("rowIndex " +rowIndex + " colIndex " + colIndex + " value " + value);
    if (value == -1 || value == 2) {
      return;
    }
    const newValue = value == 0 ? 1 : 0;
    const statusArr = this.state.statusArr;
    statusArr[rowIndex][colIndex] = newValue;
    this.setState({ statusArr });
  }
}
