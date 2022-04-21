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
      return callback('the password length must over 6');
    }
    else if (values && values !== postData.password) {
      return callback('the password not correspond');
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
    const data:StudentStructure = { accountName:values.email, accountPassword:values.password }; 
    const res:StudentEnrollResult = await enroll(data);
    if(res.code == CONSTANT.RES_SUCCESS){
      Message.success('register successful');
      window.location.href = "#/home";   
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
        <p className={styles.desc}>Register account</p>

        <Form value={postData} onChange={formChange} size="large">
          <Item format="email" required requiredMessage="neccessary">
            <Input name="email" size="large" maxLength={20} placeholder="email" />
          </Item>
          <Item required requiredMessage="neccessary">
            <Input.Password
              name="password"
              size="large"
              htmlType="password"
              placeholder="at least six password，distinguish captal and small letter"
            />
          </Item>
          <Item required requiredTrigger="onFocus" requiredMessage="neccessary" validator={checkPass}>
            <Input.Password
              name="rePassword"
              size="large"
              htmlType="password"
              placeholder="confirm password"
            />
          </Item>
          <Item>
            <Form.Submit
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              Register Account
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
