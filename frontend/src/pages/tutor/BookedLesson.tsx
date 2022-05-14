import * as React from 'react';
import { Table, Avatar, Box, Divider, Button, Message } from '@alifd/next';
import { getBookedLesson, getCanceledLesson } from '@/service/tutor/dataSource';
import Constant from '@/constant';
import moment from 'moment';
import CommonUtil from '@/utils/CommonUtils';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class BookedLesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookedLessons: [],
      canceledLessons:[],
    };
  }

  componentDidMount() {
    console.log('search >>> componentDidMount');
    this.fetchBookedLesson();
  }



  render() {
    const { bookedLessons, canceledLessons } = this.state;
    return (
      <div>
        <span> Booked Lesson Table </span>
        <Table dataSource={bookedLessons} size={'small'}>
            <Table.Column title={"LessonId"} dataIndex="lessonId"  />
            <Table.Column title={"TutorId"} dataIndex="tutorId"  />
            <Table.Column title={"TutorName"} dataIndex="tutorName"  />
            <Table.Column title={"bookTime"} dataIndex="bookTime" 
              cell={(value, index, record) => {
                    return moment(value).format('MM-DD HH:mm');
              }} />
            <Table.Column title={"lessonTime"} dataIndex="lessonTime"
               cell={(value, index, record) => {
                    return moment(value*1000*60).format('MM-DD HH:mm');
              }}
            />
            <Table.Column title={"status"} dataIndex="status"
               cell={(value, index, record) => {
                    if(value === Constant.LESSON_STATUS.WAITING){
                       return "waiting...";
                    }else if(value === Constant.LESSON_STATUS.TAKING){
                       return "runing...";
                    }
              }}
            />
             <Table.Column title={"TextBook"} dataIndex="textBook"  />
          </Table>

        <span> Canceled Lesson Table </span>
        <Table dataSource={canceledLessons} size={'small'}>
            <Table.Column title={"LessonId"} dataIndex="lessonId"  />
            <Table.Column title={"Student Id"} dataIndex="stuId"  />
            <Table.Column title={"Student Name"} dataIndex="stuName"  />
            <Table.Column title={"Book Time"} dataIndex="bookTime" 
              cell={(value, index, record) => {
                    return moment(value).format('MM-DD HH:mm');
              }}/>
            <Table.Column title={"Lesson Time"} dataIndex="lessonTime"
               cell={(value, index, record) => {
                    return moment(value*1000*60).format('MM-DD HH:mm');
              }}
            />
             <Table.Column title={"TextBook"} dataIndex="textBook"  />
          </Table>    

      </div>
    );
  }

  fetchBookedLesson = async () => {
    let res = await getBookedLesson();
    if (res && res.code === Constant.RES_SUCCESS) {
      if (res.data && res.data.length > 0) {
        CommonUtil.sortArray(res.data, 'lessonTime', false);
        this.setState({ bookedLessons: res.data });
      }
    }

    res = await getCanceledLesson();
    if (res && res.code === Constant.RES_SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.setState({ canceledLessons: res.data });
      }
    }
  };
}
