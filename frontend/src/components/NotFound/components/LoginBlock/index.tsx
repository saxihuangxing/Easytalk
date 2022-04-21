import React, { useState } from 'react';
import { Input, message, Form, Divider, Checkbox, Button } from 'antd';
import {
  AliwangwangOutlined,
  DingdingOutlined,
  WeiboSquareOutlined,
} from '@ant-design/icons';
import { useInterval } from './utils';
import styles from './index.module.less';

const { Item } = Form;

export interface IDataSource {
  name: string;
  password: string;
  autoLogin: boolean;
  phone: string;
  code: string;
}

const DEFAULT_DATA: IDataSource = {
  name: '',
  password: '',
  autoLogin: true,
  phone: '',
  code: '',
};

interface LoginProps {
  dataSource?: IDataSource;
}

const LoginBlock: React.FunctionComponent<LoginProps> = (
  props = { dataSource: DEFAULT_DATA },
): JSX.Element => {
  const { dataSource = DEFAULT_DATA } = props;

  const [postData, setValue] = useState(dataSource);

  const [isRunning, checkRunning] = useState(false);
  const [isPhone, checkPhone] = useState(false);
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

  const formChange = (values: IDataSource) => {
    setValue(values);
  };

  const sendCode = (values: IDataSource, errors?: object[]) => {
    if (errors) {
      return;
    }
    // get values.phone
    checkRunning(true);
  };

  const handleSubmit = (values: IDataSource, errors?: object[]) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    message.success('登录成功');
  };

  const phoneForm = (
    <>
      <Item
        name="phone"
        validateTrigger="onBlur"
        rules={[
          {
            required: true,
            message: '手机号格式错误',
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
          },
        ]}
      >
        <Input
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
            message: '必填',
          },
        ]}
        style={{ marginBottom: 0 }}
      >
        <Input
          addonAfter={
            <span className={styles.innerAfterInput}>
              <span className={styles.line} />
              <Button
                type="text"
                style={{ width: 64 }}
                disabled={!!isRunning}
                className={styles.sendCode}
                size="small"
                onClick={() => setisPhoneSubmit(true)}
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
    </>
  );

  const accountForm = (
    <>
      <Item
        name="name"
        required
        rules={[
          {
            required: true,
            message: '必填',
          },
        ]}
      >
        <Input maxLength={20} placeholder="用户名" />
      </Item>
      <Item
        name="password"
        required
        rules={[
          {
            required: true,
            message: '必填',
          },
        ]}
        style={{ marginBottom: 0 }}
      >
        <Input.Password placeholder="密码" />
      </Item>
    </>
  );

  const byAccount = () => {
    checkPhone(false);
  };

  const byForm = () => {
    checkPhone(true);
  };

  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>
        <div className={styles.desc}>
          <span
            onClick={byAccount}
            className={isPhone ? undefined : styles.active}
          >
            账户密码登录
          </span>
          <Divider type="vertical" />
          <span
            onClick={byForm}
            className={isPhone ? styles.active : undefined}
          >
            手机号登录
          </span>
        </div>

        <Form
          initialValues={postData}
          onValuesChange={formChange}
          size="large"
          onFinish={(value) =>
            (isPhoneSubmit ? sendCode(value) : handleSubmit(value))
          }
          onFinishFailed={(value) =>
            (isPhoneSubmit
              ? sendCode(value.values, value.errorFields)
              : handleSubmit(value.values, value.errorFields))
          }
        >
          {isPhone ? phoneForm : accountForm}

          <div className={styles.infoLine}>
            <Item
              style={{ marginBottom: 0 }}
              name="autoLogin"
              valuePropName="checked"
            >
              <Checkbox className={styles.infoLeft}>自动登录</Checkbox>
            </Item>
            <div>
              <a href="/" className={styles.link}>
                忘记密码
              </a>
            </div>
          </div>

          <Item style={{ marginBottom: 10 }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => setisPhoneSubmit(false)}
              className={styles.submitBtn}
            >
              登录
            </Button>
          </Item>
          <div className={styles.infoLine}>
            <div className={styles.infoLeft}>
              其他登录方式 <AliwangwangOutlined />
              <DingdingOutlined />
              <WeiboSquareOutlined />
            </div>
            <a href="/" className={styles.link}>
              注册账号
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginBlock;
