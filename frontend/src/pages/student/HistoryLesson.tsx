import * as React from 'react';
import { Table, Avatar, Box, Divider, Button, Message, Dialog } from '@alifd/next';
import { getHistoryLesson } from '@/service/student/api';
import Constant from '@/constant';
import moment from 'moment';
import { Modal } from 'antd';
import Comment from '@/pages/student/Comment';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class HistoryLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyLessons: [],
            commentDlgVisible: false,
            curLesson: undefined,
        };
    }

    componentDidMount() {
        console.log('search >>> componentDidMount');
        this.fetchHistoryLesson();
    }

    onSubmit() {
        this.setState({ commentDlgVisible: false });
        this.fetchHistoryLesson();
    }

    render() {
        const { historyLessons, commentDlgVisible } = this.state;
        return (
            <div>
                <Table dataSource={historyLessons} size={'small'}>
                    <Table.Column title={"课程Id"} dataIndex="lessonId" />
                    <Table.Column title={"教师Id"} dataIndex="tutorId" />
                    <Table.Column title={"教师名字"} dataIndex="tutorName" />
                    <Table.Column title={"订课时间"} dataIndex="bookTime"
                        cell={(value, index, record) => {
                            return moment(value).format('MM-DD HH:mm');
                        }} />
                    <Table.Column title={"开课时间"} dataIndex="lessonTime"
                        cell={(value, index, record) => {
                            return moment(value * 1000 * 60).format('MM-DD HH:mm');
                        }}
                    />
                    <Table.Column title={"教材"} dataIndex="textBook" />
                    <Table.Column title={"操作"}
                        cell={(value, index, record) => {
                            let text = "待评价";    
                            if(record.stuComment && record.stuComment.length > 0){
                                text = '修改评价';    
                            }
                            return (
                                <div>
                                <Button
                                    onClick={() => {
                                        this.setState({ commentDlgVisible: true, curLesson: record })
                                    }}
                                >
                                    { text }
                                </Button>
                                <Button
                                onClick={() => {
                                        window.open('#/home/lessonDetails?lessonId='+record.lessonId);
                                    }}
                                >
                                    { '详情' }
                                </Button>
                                </div>
                            )
                        }}
                    />
                </Table>
                <Modal
                    title="课程反馈"
                    centered
                    visible={this.state.commentDlgVisible}
                    footer = {[]}
                    closable
                    onCancel={()=>{ this.setState({ commentDlgVisible:false })}}
                >
                    <Comment dataSource={this.state.curLesson} callback={this.onSubmit.bind(this)} />
                </Modal>
            </div>
        );
    }

    fetchHistoryLesson = async () => {
        const res = await getHistoryLesson();
        if (res && res.code === Constant.RES_SUCCESS) {
            if (res.data && res.data.length > 0) {
                this.setState({ historyLessons: res.data });
            }
        }
    };
}
