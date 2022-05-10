import * as React from 'react';
import { Card, Form, NumberPicker, Button } from '@alifd/next';
import { TopupApply } from '@/service/student/api';
import Constant from '@/constant';
import { message } from 'antd';
import { getSystemConfig } from '@/service/systemConfig';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class Topup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice:0,        //unit RMB
            discountPrice:0,
            lessonTimes:0,
            totalCoins:0,
            discount:0,
        };
    }

    handleClickItem = async (index) => {
    };

    componentDidMount() {
        console.log('search >>> componentDidMount');
        this.onNumberPickerChange(1);
    }

    onNumberPickerChange(value) {
        const state = this.state;
        const systemConfig =  getSystemConfig();
        const { discountRules, lessonPrice, coinRate } = systemConfig;
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
        state.totalPrice = state.totalCoins/coinRate;
        state.discountPrice = state.totalPrice * (1 - discount);
        this.setState({ state });
    }

    async confirmTopup(){
        const { totalCoins, discountPrice, lessonTimes  } = this.state;
        Modal.confirm({
            title: '确认充值?',
            icon: <ExclamationCircleOutlined />,
            content: `确认已将${discountPrice}RMB转账到管理员账号,此次充值${totalCoins}金币，
            价值${lessonTimes}节课`,
            onOk() {
                TopupApply(totalCoins).then((res)=>{
                    if(res.code == Constant.RES_SUCCESS){
                        message.success('充值申请已提交，请等待管理员确认') 
                    }else{
                        message.error('充值申请提交失败，请联系管理员处理') 
                    }
                });
            },
            onCancel() {},
        });
    }

    render() {
        const { lessonPrice, discountRules, oneClassTime, coinRate } =  getSystemConfig();
        let discountText = "优惠规则:"
        for(let i in discountRules){
            const times =  discountRules[i].lessonAmount;
            const discount = discountRules[i].discount;
            discountText += `${parseInt(i)+1}:购买${times}次课程以上，优惠${discount*100}%;`;
        }

        const { totalPrice, lessonTimes, totalCoins, discount, discountPrice } = this.state;
        return (
            <div>
                <Card free>
                    <Card.Header title="充值" />
                    <Card.Divider />
                    <Card.Content>
                        <Form.Item colSpan={4} label="规则">
                            <div>
                                要充值的同学请先加我微信，方便今后更好的为您服务，买课流程：输入需要买课的次数，然后转账优惠后金额到我的微信，转账时如需验证姓名输入(黄新)，我看到后会第一时间确认您的充值,
                                到账后您可以在钱包中看到记录。
                                {discountText}
                            </div>
                        </Form.Item>
                        <Form.Item colSpan={4} label="扫描加我微信:" style={{ display: 'inline-block' }}>
                                 <img style={{ width:'200px',height:'200px' }} src='/qrcode/wechat_add.jpg' />
                        </Form.Item>
                        <Form.Item colSpan={4} style={{ display: 'inline-block',marginLeft:'20px' }} label="扫描付款:">
                                 <img style={{ width:'168px',height:'230px' }} src='/qrcode/wechat_pay.jpg' />
                        </Form.Item>
                        <Form.Item colSpan={4} label="购买">
                            <span> 单次课程时间{oneClassTime}分钟，价格:{lessonPrice}金币({lessonPrice/coinRate}RMB),1 RMB 等于 {coinRate} 金币</span> 
                            <br/>
                            <span> 购买课程次数: </span>
                            <NumberPicker onChange={this.onNumberPickerChange.bind(this)} step={1} defaultValue={1} min={1} max={1000} hasTrigger={false} />
                            <br/>
                            <span> 当前优惠:{discount*100}% </span>
                            <br/>
                            <span> 原价{totalPrice}, 优惠后金额:{discountPrice}元,平均每节课{discountPrice/lessonTimes}RMB </span>
                             <br/>
                            <span> 获得金币数量:{totalCoins} </span>
                            <br/>      
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
