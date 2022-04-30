import * as React from 'react';
import { Table, Avatar, Box, Divider, Button, Message } from '@alifd/next';
import { getBookedLesson, cancelLesson, getCanceledLesson } from '@/service/student/api';
import Constant from '@/constant';
import moment from 'moment';

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


  renderOperator (value, index, record){
    const onCancelButtonClick = async () => {
        const res = await cancelLesson(record.lessonId);
        if( res.code === Constant.RES_SUCCESS ){
          Message.success(" cancel lesson succssful! ");
          const { bookedLessons, canceledLessons } = this.state;
          const lesson = bookedLessons[index];
          lesson.status = Constant.LESSON_STATUS.CANCELED;
          bookedLessons.splice(index,1);
          canceledLessons.unshift(lesson);
          this.setState({ bookedLessons,canceledLessons });
        }else{
          Message.error(`cancel lesson failed, reason: ${res.reason}` );
        }
    }
    return (
      <Button onClick={onCancelButtonClick.bind(this)} > Cancel </Button>
    )
  };

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
             <Table.Column cell={this.renderOperator.bind(this)} />
          </Table>

        <span> Canceled Lesson Table </span>
        <Table dataSource={canceledLessons} size={'small'}>
            <Table.Column title={"LessonId"} dataIndex="lessonId"  />
            <Table.Column title={"TutorId"} dataIndex="tutorId"  />
            <Table.Column title={"TutorName"} dataIndex="tutorName"  />
            <Table.Column title={"bookTime"} dataIndex="bookTime" 
              cell={(value, index, record) => {
                    return moment(value).format('MM-DD HH:mm');
              }}/>
            <Table.Column title={"lessonTime"} dataIndex="lessonTime"
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
