import * as React from 'react';
import { Card, Form, Input, Message } from '@alifd/next';
import { Link } from 'ice';
import { getMyInfo } from '@/service/student/data';
import { ModifyPassWordStru } from '@/service/common/data'
import { modifyPassword } from '@/service/common/api'
import CONSTANT from '@/constant';

const postData = {
    oldPassword:"",
    password:""
}

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    componentDidMount() {
        //  console.log('search >>> componentDidMount');
        // this.fetchWalletInfo();
    }



     async handleSubmit(values , errors: []){
        if (errors) {
          console.log('errors', errors);
          return;
        }
        const myInfo = getMyInfo();
        const data:ModifyPassWordStru = { oldPsw:postData.oldPassword, newPsw:postData.password,
            accountName:myInfo.accountName, role:"student" }; 
        const res = await modifyPassword(data);
        if(res && res.code == CONSTANT.RES_SUCCESS){
          Message.success('修改密码成功!');
        }else{
          Message.error('修改密码失败!');
        }
      };
     
    formChange(values){
    postData.password = values.password;
    postData.oldPassword = values.oldPassword;
    }

     checkPass(rule: any, values: string, callback: (errors?: string) => void) {
        if(values.length < 6){
          return callback('密码长度必须大于6位');
        }
        else if (values && values !== postData.password) {
          return callback('再次输入密码不一致');
        } 
        else {
          return callback();
        }
      };

    render() {
        const myInfo = getMyInfo();
        return (
            <div>
                <Card free>
                    <Card.Header title="账号信息" />
                    <Card.Divider />
                    <Card.Content>
                        <Form.Item colSpan={4} label="账号">
                            {myInfo.accountName}
                            <Link to="/"> 退出账号 </Link>
                        </Form.Item>    
                        <Form.Item colSpan={4} label="姓名">
                            {myInfo.name}   
                        </Form.Item>                         
                        <Form.Item colSpan={4} label="修改密码" style = {{ width:'30%' }}>
                            <Form value={postData} onChange={this.formChange} size="large">
                                <Form.Item required requiredMessage="neccessary">
                                    <Input.Password
                                        name="oldPassword"
                                        size="large"
                                        htmlType="password"
                                        placeholder="输入原密码"
                                    />
                                </Form.Item>
                                <Form.Item required requiredMessage="neccessary">
                                    <Input.Password
                                        name="password"
                                        size="large"
                                        htmlType="password"
                                        placeholder="输入新密码，最少六位,区分大小写"
                                    />
                                </Form.Item>
                                <Form.Item required requiredTrigger="onFocus" requiredMessage="neccessary" validator={this.checkPass}>
                                    <Input.Password
                                        name="rePassword"
                                        size="large"
                                        htmlType="password"
                                        placeholder="确认新密码"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Form.Submit
                                        type="primary"
                                        onClick={this.handleSubmit}
                                        validate
                                    >
                                        确认修改
                                    </Form.Submit>
                                </Form.Item>
                            </Form>
                        </Form.Item>
                    </Card.Content>
                </Card>
            </div>
        );
    }

}