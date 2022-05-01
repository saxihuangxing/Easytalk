import * as React from 'react';
import { Card, Form, NumberPicker, Button } from '@alifd/next';
import { TopupApply } from '@/service/student/api';
import Constant from '@/constant';
import { message } from 'antd';
import { getSystemConfig } from '@/service/systemConfig';
// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class Topup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice:0,        //unit RMB
            lessonTimes:0,
            totalCoins:0,
            discount:0,
        };
    }

    handleClickItem = async (index) => {
    };

    componentDidMount() {
        console.log('search >>> componentDidMount');
    }

    onNumberPickerChange(value) {
        const state = this.state;
        const systemConfig =  getSystemConfig();
        const { discountRules, lessonPrice } = systemConfig;
        let discount = 0;
        for(let i in discountRules){
            if(value >= discountRules[i].lessonAmount){
                discount = discountRules[i].discount;
                break;
            }
        }
        state.lessonTimes = value;
        state.totalCoins = value  * lessonPrice;
        state.discount = discount;
        state.totalPrice = state.totalCoins * (1 - discount);
        this.setState({ state });
    }

    async confirmTopup(){
        const res = await TopupApply(this.state.totalCoins);
        if(res.code == Constant.RES_SUCCESS){
           message.success('充值申请已提交，请等待管理员确认') 
        }else{
           message.error('充值申请提交失败，请联系管理员处理') 
        }
    }

    render() {
        const { lessonPrice, discountRules } =  getSystemConfig();
        let discountText = "优惠规则:"
        for(let i in discountRules){
            const times =  discountRules[i].lessonAmount;
            const discount = discountRules[i].discount;
            discountText += `${i+1}:购买${times}次课程以上，优惠${discount*100}%。`;
        }

        const { totalPrice, lessonTimes, totalCoins, discount } = this.state;
        return (
            <div>
                <Card free>
                    <Card.Header title="充值" />
                    <Card.Divider />
                    <Card.Content>
                        <Form.Item colSpan={4} label="规则">
                            <span>
                                要充值的朋友请先扫描加我微信。 请先通过微信付款后点击确认，我看到后会第一时间确认您的充值。
                                {discountText}
                            </span>
                        </Form.Item>
                        <Form.Item colSpan={4} label="扫描加我微信:" style={{ display: 'inline-block' }}>
                                 <img style={{ width:'200px',height:'200px' }} src='/qrcode/wechat_add.jpg' />
                        </Form.Item>
                        <Form.Item colSpan={4} style={{ display: 'inline-block',marginLeft:'20px' }} label="扫描付款:">
                                 <img style={{ width:'168px',height:'230px' }} src='/qrcode/wechat_pay.jpg' />
                        </Form.Item>
                        <Form.Item colSpan={4} label="购买">
                            <span> 单次课程价格:{lessonPrice}元</span>
                            <span> 购买课程次数: </span>
                            <NumberPicker onChange={this.onNumberPickerChange.bind(this)} hasTrigger={false} />
                            <span> 所需总金额:{totalPrice}元 </span>
                            <span> 获得金币数量:{totalCoins} </span>
                            <span> 当前优惠:{discount*100}% </span>
                        </Form.Item>                       
                        <Button type="primary" onClick={this.confirmTopup.bind(this)}>
                            确认充值
                        </Button>
                    </Card.Content>
                </Card>
            </div>
        );
    }

}
