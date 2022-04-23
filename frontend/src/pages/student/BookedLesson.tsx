import * as React from 'react';
import { Table, Avatar, Box, Divider, Button } from '@alifd/next';
import { getBookedLesson } from '@/service/student/api';
import Constant from '@/constant';
import moment from 'moment';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class BookedLesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    console.log('search >>> componentDidMount');
    this.fetchBookedLesson();
  }


  render() {
    const { data } = this.state;
    return (
      <div>
        <Table dataSource={data} size={'small'}>
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
             <Table.Column title={"TextBook"} dataIndex="textBook"  />
          </Table>
      </div>
    );
  }

  fetchBookedLesson = async () => {
    let res = await getBookedLesson();
    if (res && res.code === Constant.RES_SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.setState({ data: res.data });
      }
    }
  };
}
