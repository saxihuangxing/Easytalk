/* eslint-disable @iceworks/best-practices/no-secret-info */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, message, Form, Button } from 'antd';
import { useInterval } from './utils';
import styles from './index.module.less';

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
  const [isPhoneSubmit, setisPhoneSubmit] = useState(false);

  useInterval(
    () => {
      setSecond(second - 1);
      if (second <= 0) {
        checkRunning(false);
        setSecond(59);
      }
    },
    isRunning ? 1000 : null,
  );

  const formChange = (value: RegisterProps) => {
    setValue(value);
  };

  const sendCode = (values: RegisterProps, errors?: object[]) => {
    if (errors) {
      return;
    }
    // get values.phone
    checkRunning(true);
  };

  const handleSubmit = (values: RegisterProps, errors?: object[]) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    message.success('注册成功');
  };
  const [form] = Form.useForm();
  return (
    <div className={styles.RegisterBlock}>
      <div className={styles.innerBlock}>
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>
        <p className={styles.desc}>注册账号</p>

        <Form
          initialValues={postData}
          onValuesChange={formChange}
          size="large"
          form={form}
          onFinish={(value) =>
            (isPhoneSubmit ? sendCode(value) : handleSubmit(value))
          }
          onFinishFailed={(value) =>
            (isPhoneSubmit
              ? sendCode(value.values, value.errorFields)
              : handleSubmit(value.values, value.errorFields))
          }
        >
          <Item
            required
            rules={[
              {
                required: true,
                message: '请填写正确的邮箱',
                pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              },
            ]}
            name="email"
          >
            <Input size="large" maxLength={20} placeholder="邮箱" />
          </Item>
          <Item
            required
            name="password"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: '请填写六位或以上的密码',
                pattern: /^\d{6}/,
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="至少六位密码，区分大小写"
            />
          </Item>
          <Item
            required
            validateTrigger="onBlur"
            name="rePassword"
            rules={[
              {
                required: true,
                message: '请再次输入密码',
                // validator:{checkPass}
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('两次密码输入不一致,请检查后重新输入'),
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="确认密码" />
          </Item>
          <Item
            validateTrigger="onBlur"
            name="phone"
            rules={[
              {
                required: true,
                message: '请输入正确的手机号',
                pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
              },
            ]}
          >
            <Input
              size="large"
              addonBefore={
                <span className={styles.innerBeforeInput}>
                  +86
                  <span className={styles.line} />
                </span>
              }
              maxLength={20}
              placeholder="手机号"
            />
          </Item>
          <Item
            required
            name="code"
            rules={[
              {
                required: !isPhoneSubmit,
                message: '请输入正确的验证码',
              },
            ]}
          >
            <Input
              size="large"
              addonAfter={
                <span className={styles.innerAfterInput}>
                  <span className={styles.line} />
                  <Button
                    type="text"
                    size="small"
                    disabled={!!isRunning}
                    onClick={() => setisPhoneSubmit(true)}
                    className={styles.sendCode}
                    htmlType="submit"
                  >
                    {isRunning ? `${second}秒后再试` : '获取验证码'}
                  </Button>
                </span>
              }
              maxLength={20}
              placeholder="验证码"
            />
          </Item>
          <Item>
            <Button
              type="primary"
              onClick={() => setisPhoneSubmit(false)}
              htmlType="submit"
              className={styles.submitBtn}
            >
              注册账号
            </Button>
          </Item>
          <Item style={{ textAlign: 'center' }}>
            <a href="/" className={styles.link}>
              使用已有账号登录
            </a>
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
