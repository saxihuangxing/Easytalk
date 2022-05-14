import * as React from 'react';
import {  Pagination, Box, Divider, Button, Tag, Table, Message, Card } from '@alifd/next';
import { getLessonById } from '@/service/common/api';
import Constant from '@/constant';
import CommonUtil from '@/utils/CommonUtils';
import Config from '@/config/config';
const maxDays = Config.scheduleMaxDays;
import moment from 'moment';
import { Slider, Icon } from '@alifd/next';
import { Form, Rate } from 'antd'
 
// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class LessonDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    console.log('search >>> componentDidMount');
    const lessonId = CommonUtil.getQueryVariable('lessonId');
    this.fetchLessonInfoById(lessonId);
  }

  /*     lessonId: { type: String, unique:true },
    stuId: { type: String },
    stuName: { type: String },
    tutorId: { type: String },
    tutorName: { type: String},
    bookTime: { type: Number },     //in ms
    lessonTime: { type: Number },   //in minute
    textBook: { type: String },
    lessonType: { type: String, enum:['book','sudden'] },
    status: { type: String, enum:['waiting', 'taking', 'finished', 'canceled', 'dispute', 'refund'] },
    cost: { type: Number },    
    refundCoin: { type: Number},
    stuRate: { type: Number, min:1 ,max:5 },
    stuComment: { type : String },
    tutorComment: { type: String }, */

  //lessonType: { type: String, enum:['book','sudden'] },
  // status: { type: String, enum:['waiting', 'taking', 'finished', 'canceled', 'dispute', 'refund'] },
  render() {
    const { data } = this.state;
    if (!data) {
      return (<div> </div>)
    }
    return (
      <div>
        <Card free>
          <Card.Header title="Lesson Info" />
          <Card.Divider />
          <Card.Content>
            <Form layout={'inline'} size={'middle'} labelCol = {{ 'span': '25' }}
                wrapperCol = {{ 'span': '15' }}  >
              <Form.Item label="Lesson Id:">{data.lessonId}</Form.Item>
              <Form.Item label="Student Id:">{data.stuId}</Form.Item>
              <Form.Item label="Student Name:">{data.stuName}</Form.Item>
              <Form.Item label="Tutor Id:">{data.tutorId}</Form.Item>
              <Form.Item label="Book Time:">{moment(data.bookTime).format('MM-DD HH:MM')}</Form.Item>
              <Form.Item label="Lesson Time:">{moment(data.lessonTime * 1000 * 60).format('MM-DD HH:MM')}</Form.Item>
              <Form.Item label="TextBook: ">{data.textBook}</Form.Item>
              <Form.Item label="Lesson Type: ">{data.lessonType}</Form.Item>
              <Form.Item label="Lesson  Status: ">{data.status}</Form.Item>
          {/*     <Form.Item label="Lesson Cost Coin: ">{data.cost}</Form.Item>
              <Form.Item label="Lesson Refund: ">{data.refundCoin}</Form.Item> */}
            </Form>
          </Card.Content>
        </Card>
        <Card free>
          <Card.Header title="FeedBack" />
          <Card.Divider style={{ marginBottom: '5px' }} />
          <Card.Content>
            <Form.Item label="Rate:">
              <Rate defaultValue={ data.stuRate } disabled={true} />
            </Form.Item>
            <Form.Item label="Studend Comment:">{data.stuComment}</Form.Item>
            <Form.Item label="Tutor Comment:">{data.tutorComment}</Form.Item>
          </Card.Content>
        </Card>
      </div>
    );
  }

  fetchLessonInfoById = async (id) => {
    const data = await getLessonById(id);
    if (data) {
      this.setState({ data });
    }
  };
}

const styles = {
  cardContainer: {
    padding: '10px 10px 20px 10px',
  },
  titleCol: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleText: {
    marginLeft: '10px',
    lineHeight: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  paginationContainer: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};
