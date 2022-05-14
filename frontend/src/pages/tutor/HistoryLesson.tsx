import * as React from 'react';
import { Table, Form, Box, Divider, Button, Message, Dialog, Input } from '@alifd/next';
import { getHistoryLesson, tutorCommentLesson } from '@/service/tutor/dataSource';
import Constant from '@/constant';
import moment from 'moment';
import { Modal } from 'antd';
import { WindowsFilled } from '@ant-design/icons';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class HistoryLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyLessons: [],
            commentDlgVisible: false,
            postData: {},
        };
    }

    componentDidMount() {
        console.log('search >>> componentDidMount');
        this.fetchHistoryLesson();
    }



    render() {
        const { historyLessons, postData } = this.state;
        const handleSubmit = async (values, errors: []) => {
            if (errors) {
                console.log('errors', errors);
                return;
            }
            const res = await tutorCommentLesson(values.lessonId, values.tutorComment);
            if (res.code == Constant.RES_SUCCESS) {
                Message.success('课程评价成功');
            } else {
                Message.error('课程评价失败');
            }
            this.setState({ commentDlgVisible: false })
            this.fetchHistoryLesson();

        };

        const formChange = (values) => {
            this.state.postData = values;
        };

        console.log(" postData.tutorComment = " + postData.tutorComment);
        return (
            <div>
                <Table dataSource={historyLessons} size={'small'}>
                    <Table.Column title={"LessonId"} dataIndex="lessonId" />
                    <Table.Column title={"Student Id"} dataIndex="stuId" />
                    <Table.Column title={"Student Name"} dataIndex="stuName" />
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
                    <Table.Column title={"Operation"} dataIndex="textBook"
                        cell={(value, index, record) => {
                            let text = "Comment";
                            if (record.tutorComment && record.tutorComment.length > 0) {
                                text = 'Edit Comment';
                            }
                            return (
                                <div>
                                    <Button
                                        onClick={() => {
                                            this.setState({ commentDlgVisible: true, postData: record })
                                        }}
                                    >
                                        { text }
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            window.open('#/tutor/home/lessonDetails?lessonId='+record.lessonId);
                                        }}
                                    >
                                        { 'details' }
                                    </Button>
                            </div>
                            )
                        }} />
                </Table>
                <Modal
                    title="Lesson feedback"
                    centered
                    visible={this.state.commentDlgVisible}
                    footer={[]}
                    closable
                    onCancel={() => { this.setState({ commentDlgVisible: false }) }}
                >
                     <Form value={postData} onChange={formChange} size="large">
                        <Form.Item required requiredMessage="neccesary" lable='Comment'>
                            <Input.TextArea
                                name="tutorComment"
                                defaultValue={postData.tutorComment}
                                placeholder="Input your comment"
                                showLimitHint
                                maxLength={800}
                            />
                        </Form.Item>
                         <Form.Item style={{ marginBottom: 10 }}>
                            <Form.Submit
                                type="primary"
                                onClick={handleSubmit}
                                validate
                            >
                                Submit
                            </Form.Submit>
                        </Form.Item>
                    </Form>
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
