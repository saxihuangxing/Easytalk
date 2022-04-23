import React, { useState } from 'react';
import { Input, Message, Form, Divider, Checkbox, Icon } from '@alifd/next';
import { useHistory } from "react-router-dom";
import { useInterval } from './utils';
import styles from './index.module.scss';
import { StudentStructure, login } from '@/service/student/api';
import CONSTANT from '@/constant';
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
  // eslint-disable-next-line @iceworks/best-practices/no-secret-info
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
  const [second, setSecond] = useState(59);

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

  const sendCode = (values: IDataSource, errors: []) => {
    if (errors) {
      return;
    }
    // get values.phone
    checkRunning(true);
  };

  const handleSubmit = async (values: IDataSource, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    const data:StudentStructure = { accountName:values.name, accountPassword:values.password }; 
    const res = await login(data);
    //const history = useHistory(); 
    if(res.code == CONSTANT.RES_SUCCESS){
      Message.success('login successful');
      window.location.href = "#/home/main";   
    //  history.push("/tutor/userInfo"); 
    }else{
      Message.error('Login failed, Username or password error');
    }
  
  };


  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        <Form value={postData} onChange={formChange} size="large">
          <Item required requiredMessage="neccesary">
            <Input name="name" maxLength={20} placeholder="UserName" />
          </Item>
          <Item required requiredMessage="neccesary" style={{ marginBottom: 0 }}>
            <Input.Password name="password" htmlType="password" placeholder="Password" />
          </Item>
          <div className={styles.infoLine}>
            <Item style={{ marginBottom: 0 }}>
              <Checkbox name="autoLogin" className={styles.infoLeft}>
                auto login
              </Checkbox>
            </Item>
            <div>
              <a href="/" className={styles.link}>
                forget password
              </a>
            </div>
          </div>

          <Item style={{ marginBottom: 10 }}>
            <Form.Submit
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              Login
            </Form.Submit>
          </Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginBlock;
