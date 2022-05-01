import * as React from 'react';
import { Card, Form, NumberPicker, Button, Table } from '@alifd/next';
import { TopupApply } from '@/service/student/api';
import Constant from '@/constant';
import { getMyWallet } from '@/service/student/api';
import { message } from 'antd';
import { getSystemConfig } from '@/service/systemConfig';
import { Link } from 'ice';
import moment from 'moment';
// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component

/*
    const TransactionSchema = new Schema({
    action: { type: Boolean },  //true: add  , false: decrease
    balance: { type: Number },
    amount: { type: Number },
    time: { type: Number },
    reason: { type: String }, // "Top Up" | "Book Lesson" | "Gift" | "Cancel Lesson" | "Apply Refund"
    refundRate: { type: Number },
    refLessonId: { type: String }, 
})

const WalletSchema = new Schema({
    id: { type: String },
    userId: { type: String },
    balance: { type: Number },
    transations: [ TransactionSchema ],
});

*/
export default class Topup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    handleClickItem = async (index) => {
    };

    componentDidMount() {
      //  console.log('search >>> componentDidMount');
      this.fetchWalletInfo();
    }



    render() {
        const { data } = this.state;
        return (
            <div>
                <Card free>
                    <Card.Header title="钱包" />
                    <Card.Divider />
                    <Card.Content>
                        <Form.Item colSpan={4} label="余额">
                            {data.balance} 金币    <Link to="/home/topup">去充值</Link>
                        </Form.Item>
                        <Form.Item colSpan={4} label="交易记录：">
                        <Table dataSource={data.transations} size={'small'}>
                            <Table.Column title={"时间"} dataIndex="time"
                                cell={(value, index, record) => {
                                    return moment(value).format('MM-DD HH:mm');
                                }} 
                             />
                            <Table.Column title={"操作"} dataIndex="action"
                                cell={(value, index, record) => {
                                    if(value){
                                        return "增加"
                                    }else{
                                        return "减少"
                                    }
                                }} 
                            />
                            <Table.Column title={"金额"} dataIndex="amount" />
                            <Table.Column title={"原因"} dataIndex="reason"
                                 cell={(value, index, record) => {
                                    switch(value){
                                        case "Top Up": return "充值";
                                        case "Book Lesson": return "订课";
                                        case "Gift": return "奖励";
                                        case "Cancel Lesson": return "取消课程退款";
                                        case "Apply Refund": return "申请退款";
                                        defaut: return "未知";
                                    }
                                }} 
                            />
                            <Table.Column title={"当前金额"} dataIndex="balance" />
                            <Table.Column title={"相关课程id"} dataIndex="refLessonId" />
                        </Table>
                        </Form.Item>
                    </Card.Content>
                </Card>
            </div>
        );
    }

    fetchWalletInfo = async () => {
        let res = await getMyWallet();
        if (res && res.code === Constant.RES_SUCCESS) {
          if (res.data) {
            this.setState({ data: res.data });
          }
        }
      };

}