import * as React from 'react';
import { Form, Pagination, Box, Divider, Button, Tag, Table, Message, Card } from '@alifd/next';
import { getStudentDetails } from '@/service/admin/api';
import Constant from '@/constant';
import CommonUtil from '@/utils/CommonUtils';
import Config from '@/config/config';
const maxDays = Config.scheduleMaxDays;
import moment from 'moment';
import { Slider, Icon } from '@alifd/next';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student: undefined,
            wallet: undefined,
            lessonTableData: {
                org: [],
                total: 0,
                pageSize: 8,
                currentPage: 1,
                list: [],
            },
            walletTableData: {
                org: [],
                total: 0,
                pageSize: 8,
                currentPage: 1,
                list: [],
            },
        };
    }

    componentDidMount() {
        console.log('search >>> componentDidMount');
        const studentId = CommonUtil.getQueryVariable('studentId');
        this.fetchStudentInfoById(studentId);
    }


    render() {
        const { student, wallet, lessonTableData, walletTableData } = this.state;
        if (!student) {
            return <div></div>;
        }
        return (
            <div>
                <Card free>
                    <Card.Header title="Student Info" />
                    <Card.Divider />
                    <Card.Content>
                        <Form >
                            <Form.Item label='account'>
                                { student.accountName }
                            </Form.Item>
                            <Form.Item label='name'>
                                { student.name }
                            </Form.Item>
                        </Form>
                    </Card.Content>
                </Card>
                <Card free>
                    <Card.Header title="Lesson" />
                    <Card.Divider style={{ marginBottom: '5px' }} />
                    <Card.Content>
                        <Table
                            dataSource={lessonTableData.list}
                            className="basic-table"
                            hasBorder={false}
                        >

                            <Table.Column title={"LessonId"} dataIndex="lessonId" />
                            <Table.Column title={"TutorId"} dataIndex="tutorId" />
                            <Table.Column title={"TutorName"} dataIndex="tutorName" />
                            <Table.Column title={"studentId"} dataIndex="stuId" />
                            <Table.Column title={"studentName"} dataIndex="stuName" />
                            <Table.Column title={"bookTime"} dataIndex="bookTime"
                                cell={(value, index, record) => {
                                    return moment(value).format('MM-DD HH:mm');
                                }} />
                            <Table.Column title={"lessonTime"} dataIndex="lessonTime"
                                cell={(value, index, record) => {
                                    return moment(value * 1000 * 60).format('MM-DD HH:mm');
                                }}
                            />
                            <Table.Column title={"status"} dataIndex="status" />
                            <Table.Column title={"TextBook"} dataIndex="textBook" />
                        </Table>
                        <div style={styles.paginationContainer}>
                            <Pagination
                                current={lessonTableData.currentPage}
                                pageSize={lessonTableData.pageSize}
                                total={lessonTableData.total}
                                onChange={this.onLessonPageChangePage.bind(this)}
                            />
                        </div>
                    </Card.Content>
                </Card>
                <Card free>
                    <Card.Header title="Wallet" />
                    <Card.Divider />
                    <Card.Content>
                        <Form.Item colSpan={4} label="Balance">
                            {wallet.balance} Coins
                        </Form.Item>
                        <Form.Item colSpan={4} label="transactions：">
                            <Table dataSource={walletTableData.list} size={'small'}>
                                <Table.Column title={"Time"} dataIndex="time"
                                    cell={(value, index, record) => {
                                        return moment(value).format('MM-DD HH:mm');
                                    }}
                                />
                                <Table.Column title={"action"} dataIndex="action"
                                    cell={(value, index, record) => {
                                        if (value) {
                                            return "increase"
                                        } else {
                                            return "decrease"
                                        }
                                    }}
                                />
                                <Table.Column title={"amount"} dataIndex="amount" />
                                <Table.Column title={"reson"} dataIndex="reason"
                                    cell={(value, index, record) => {
                                        switch (value) {
                                            case "Top Up": return "Top up";
                                            case "Book Lesson": return "Book Lesson";
                                            case "Gift": return "Gift";
                                            case "Cancel Lesson": return "Refund for cancel Lesson";
                                            case "Apply Refund": return "Apply refund";
                                            default: return "unknown";
                                        }
                                    }}
                                />
                                <Table.Column title={"current balance"} dataIndex="balance" />
                                <Table.Column title={"reference Lesson"} dataIndex="refLessonId" />
                            </Table>
                        </Form.Item>
                        <div style={styles.paginationContainer}>
                            <Pagination
                                current={walletTableData.currentPage}
                                pageSize={walletTableData.pageSize}
                                total={walletTableData.total}
                                onChange={this.onWalletPageChangePage.bind(this)}
                            />
                        </div>
                    </Card.Content>
                </Card>
            </div>
        );
    }

    clearTableData(table) {
        table.total = 0;
        table.currentPage = 1;
        table.org = [];
        table.list = [];
    }

    onLessonPageChangePage = (currentPage) => {
        const { lessonTableData } = this.state;
        this.tableChangePage(lessonTableData, currentPage);
        this.setState({ lessonTableData });
    };

    onWalletPageChangePage = (currentPage) => {
        const { walletTableData } = this.state;
        this.tableChangePage(walletTableData, currentPage);
        this.setState({ walletTableData });
    };

    tableChangePage(table, currentPage) {
        table.currentPage = currentPage;
        const start = (table.currentPage - 1) * table.pageSize;
        const end = table.currentPage * table.pageSize;
        table.list = table.org.slice(start, end);
    }

    fetchStudentInfoById = async (id) => {
        const data = await getStudentDetails(id);
        const { lessonTableData, walletTableData } = this.state;
        // student: undefined,
        // wallet: undefined,
        if (data) {
            try {
                const { student, wallet, lesson } = data;
                if (lesson != null && lesson.length > 0) {
                    lessonTableData.total = lesson.length;
                    lessonTableData.org = lesson;
                    const start = (lessonTableData.currentPage - 1) * lessonTableData.pageSize;
                    const end = lessonTableData.currentPage * lessonTableData.pageSize;
                    lessonTableData.list = lesson.slice(start, end);
                } else {
                    this.clearTableData(lessonTableData)
                }
                const transations = wallet.transations;
                if (transations != null && transations.length > 0) {
                    walletTableData.total = transations.length;
                    walletTableData.org = transations;
                    const start = (walletTableData.currentPage - 1) * walletTableData.pageSize;
                    const end = walletTableData.currentPage * walletTableData.pageSize;
                    walletTableData.list = transations.slice(start, end);
                } else {
                    this.clearTableData(walletTableData)
                }
                this.setState({ student, wallet, lessonTableData, walletTableData });
            } catch (e) {
                console.log("fetchStudentInfoById error " + e);
            }
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
