import * as React from 'react';
import { Table, Avatar, Box, Divider, Button, Message, Dialog, Card } from '@alifd/next';
import { getBookedLesson, cancelLesson, getCanceledLesson } from '@/service/student/api';
import Constant from '@/constant';
import moment, { relativeTimeRounding } from 'moment';
import { getSystemConfig } from '@/service/systemConfig';
import CommonUtil from '@/utils/CommonUtils';
// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class BookedLesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookedLessons: [],
      canceledLessons: [],
      dlgVisible: false,
      dlgContent: "",
    };
    this.bookedLessonIndex = 0;
    this.canceledLessonIndex = 0;
  }

  componentDidMount() {
    console.log('search >>> componentDidMount');
    this.fetchBookedLesson();
  }

  async cancelLesson() {
    const { bookedLessons, canceledLessons } = this.state;
    const lessonId = bookedLessons[this.bookedLessonIndex].lessonId;
    const res = await cancelLesson(lessonId);
    if (res.code === Constant.RES_SUCCESS) {
      Message.success("取消课程成功");
      const lesson = bookedLessons[this.bookedLessonIndex];
      lesson.status = Constant.LESSON_STATUS.CANCELED;
      bookedLessons.splice(this.bookedLessonIndex, 1);
      canceledLessons.unshift(lesson);
      this.setState({ bookedLessons, canceledLessons });
    } else {
      Message.error(`取消课程失败, 原因: ${res.reason}`);
    }
  }

  async dlgConfirm() {
    await this.cancelLesson();
    this.setState({ dlgVisible: false });
  }

  dlgCancel() {
    this.setState({ dlgVisible: false });
  }


  renderOperator(value, index, record) {
    const onCancelButtonClick = async () => {
      const { cancelLessonRules } = getSystemConfig();
      const lessonDistance = record.lessonTime - (new Date().getTime()) / 1000 / 60;
      let curRule = null;
      for (let i in cancelLessonRules) {
        const rule = cancelLessonRules[i];
        if (lessonDistance >= rule.time) {
          curRule = rule;
          break;
        }
      }
      if (!curRule) {
        Message.error(`距离上课时间过近，只有${parseInt(lessonDistance)}分钟，无法取消`)
        return;
      }
      let dlgContent = "";
      if (curRule.refundRate < 1) {
        dlgContent = `由于距离开课时间只有${parseInt(lessonDistance)}分钟，只能退款${100 * curRule.refundRate}%,
          一共可退回${curRule.refundRate * record.cost}金币，确定取消吗？`
      } else {
        dlgContent = `本次可退款100%，一共${record.cost}金币,确定取消吗？`
      }
      this.setState({ dlgVisible: true, dlgContent });
      this.bookedLessonIndex = index;
    }
    return (
      <Button type={'primary'} onClick={onCancelButtonClick.bind(this)} > Cancel </Button>
    )
  };

  render() {
    const { bookedLessons, canceledLessons } = this.state;
    return (
      <div>
        <Card free>
          <Card.Header title="预订课程" />
          <Card.Divider />
          <Card.Content>
            <Table dataSource={bookedLessons} size={'small'}>
              <Table.Column title={"课程Id"} dataIndex="lessonId" />
              <Table.Column title={"老师Id"} dataIndex="tutorId" />
              <Table.Column title={"老师姓名"} dataIndex="tutorName" />
              <Table.Column title={"开课时间"} dataIndex="lessonTime"
                cell={(value, index, record) => {
                  return moment(value * 1000 * 60).format('MM-DD HH:mm');
                }}
              />
              <Table.Column title={"状态"} dataIndex="status"
                cell={(value, index, record) => {
                  if (value === Constant.LESSON_STATUS.WAITING) {
                    return "等待开课";
                  } else if (value === Constant.LESSON_STATUS.TAKING) {
                    return "进行中...";
                  }
                }}
              />
              <Table.Column title={"教材"} dataIndex="textBook" />
              <Table.Column cell={this.renderOperator.bind(this)} />
            </Table>
            </Card.Content>
        </Card>
        <Card free>
          <Card.Header title="已取消预定课程" />
          <Card.Divider />
          <Card.Content>
            <Table dataSource={canceledLessons} size={'small'}>
              <Table.Column title={"课程Id"} dataIndex="lessonId" />
              <Table.Column title={"老师Id"} dataIndex="tutorId" />
              <Table.Column title={"老师姓名"} dataIndex="tutorName" />
              <Table.Column title={"开课时间"} dataIndex="lessonTime"
                cell={(value, index, record) => {
                  return moment(value * 1000 * 60).format('MM-DD HH:mm');
                }}
              />
              <Table.Column title={"教材"} dataIndex="textBook" />
            </Table>
            <Dialog
              v2
              title="取消课程"
              visible={this.state.dlgVisible}
              onOk={this.dlgConfirm.bind(this)}
              onClose={this.dlgCancel.bind(this)}
            >
              <p> {this.state.dlgContent}</p>
            </Dialog>
            </Card.Content>
        </Card>
      </div>
    );
  }

  fetchBookedLesson = async () => {
    let res = await getBookedLesson();
    if (res && res.code === Constant.RES_SUCCESS) {
      const array = res.data;
      CommonUtil.sortArray(array, 'lessonTime', false);
      if (res.data && res.data.length > 0) {
        this.setState({ bookedLessons: array });
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
