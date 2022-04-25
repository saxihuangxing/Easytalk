import * as React from 'react';
import { Table, Avatar, Box, Divider, Button, Message } from '@alifd/next';
import { getHistoryLesson } from '@/service/student/api';
import Constant from '@/constant';
import moment from 'moment';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class HistoryLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyLessons: []
        };
    }

    componentDidMount() {
        console.log('search >>> componentDidMount');
        this.fetchHistoryLesson();
    }



    render() {
        const { historyLessons } = this.state;
        return (
            <div>
                <Table dataSource={historyLessons} size={'small'}>
                    <Table.Column title={"LessonId"} dataIndex="lessonId" />
                    <Table.Column title={"TutorId"} dataIndex="tutorId" />
                    <Table.Column title={"TutorName"} dataIndex="tutorName" />
                    <Table.Column title={"bookTime"} dataIndex="bookTime"
                        cell={(value, index, record) => {
                            return moment(value).format('MM-DD HH:mm');
                        }} />
                    <Table.Column title={"lessonTime"} dataIndex="lessonTime"
                        cell={(value, index, record) => {
                            return moment(value * 1000 * 60).format('MM-DD HH:mm');
                        }}
                    />
                    <Table.Column title={"TextBook"} dataIndex="textBook" />
                </Table>
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
