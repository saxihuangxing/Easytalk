/* eslint-disable @iceworks/best-practices/no-secret-info */
import React, { useState } from 'react';
import PropTypes, { string } from 'prop-types';
import { Input, Message, Form } from '@alifd/next';

import { useInterval } from './utils';
import styles from './index.module.scss';
import { StudentStructure, StudentEnrollResult, enroll } from '@/service/student/api';
import CONSTANT from '@/constant';
const { Item } = Form;

export interface RegisterProps {
  email: string;
  password: string;
  rePassword: string;
  phone: string;
  code: string;
  name: string;
}

export default function RegisterBlock() {
  const [postData, setValue] = useState({
    email: '',
    password: '',
    rePassword: '',
    phone: '',
    code: '',
  });

  const [isRunning, checkRunning] = useState(false);
  const [second, setSecond] = useState(59);

  useInterval(() => {
    setSecond(second - 1);
    if (second <= 0) {
      checkRunning(false);
      setSecond(59);
    }
  }, isRunning ? 1000 : null);

  const formChange = (value: RegisterProps) => {
    setValue(value);
  };

  const sendCode = (values: RegisterProps, errors: []) => {
    if (errors) {
      return;
    }
    // get values.phone
    checkRunning(true);
  };

  const checkPass = (rule: any, values: string, callback: (errors?: string) => void) => {
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

  const handleSubmit = async (values: RegisterProps, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    const data:StudentStructure = { accountName:values.phone, accountPassword:values.password,
       name:values.name }; 
    const res:StudentEnrollResult = await enroll(data);
    if(res.code == CONSTANT.RES_SUCCESS){
      Message.success('register successful');
      window.location.href = "#/home/main";   
    }else{
      let errReason:string = "";
      if(res.reason == CONSTANT.ENROLL_FAIL_REASON.EXIST_USERNAME){
        errReason = "the username already enrolled"; 
      }else if(res.reason == CONSTANT.ENROLL_FAIL_REASON.UNKNOWN){
        errReason = res.errDetails;
      }
      Message.error('register failed,' + 'reason:' + errReason);
    }
  };

  return (
    <div className={styles.RegisterBlock}>
      <div className={styles.innerBlock}>
        <p className={styles.desc}>注册新用户</p>

        <Form value={postData} onChange={formChange} size="large">
        <Item format="tel" required requiredMessage="必填" asterisk={false}>
            <Input
              name="phone"
              size="large"
              innerBefore={
                <span className={styles.innerBeforeInput}>
                  +86
                  <span className={styles.line} />
                </span>
              }
              maxLength={20}
              placeholder="手机号"
            />
          </Item>
         {/*  <Item required requiredMessage="必填">
            <Input
              name="code"
              size="large"
              innerAfter={
                <span className={styles.innerAfterInput}>
                  <span className={styles.line} />
                  <Form.Submit
                    text
                    type="primary"
                    style={{ width: 64 }}
                    disabled={!!isRunning}
                    validate={['phone']}
                    onClick={sendCode}
                    className={styles.sendCode}
                  >
                    {isRunning ? `${second}秒后再试` : '获取验证码'}
                  </Form.Submit>
                </span>
              }
              maxLength={20}
              placeholder="验证码"
            />
          </Item> */}
          <Item required requiredMessage="neccessary">
            <Input.Password
              name="password"
              size="large"
              htmlType="password"
              placeholder="最少六位,区分大小写"
            />
          </Item>
          <Item required requiredTrigger="onFocus" requiredMessage="neccessary" validator={checkPass}>
            <Input.Password
              name="rePassword"
              size="large"
              htmlType="password"
              placeholder="确认密码"
            />
          </Item>
          <Item required requiredTrigger="onFocus"  requiredMessage="neccessary">
            <Input
              name="name"
              size="large"
              placeholder="请使用英语名或拼音字母方便外教老师"
            />
          </Item>
          <Item>
            <Form.Submit
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              确认注册
            </Form.Submit>
          </Item>
        </Form>
      </div>
    </div>
  );
}

RegisterBlock.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  value: PropTypes.object,
};

RegisterBlock.defaultProps = {
  value: {},
};
