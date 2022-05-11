import React, { useState } from 'react';
import { Input, Message, Form, Divider, Checkbox, Icon } from '@alifd/next';
import styles from '@/pages/admin/UserLogin/userLogin.module.scss';
import { login } from '@/service/admin/api';
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
  const formChange = (values: IDataSource) => {
    setValue(values);
  };

  const handleSubmit = async (values: IDataSource, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    const data = { accountName:values.name, accountPassword:values.password }; 
    const res = await login(data);
    //const history = useHistory();
    if(res.code == CONSTANT.RES_SUCCESS){
      Message.success('login successful');
      window.location.href = "#/admin/home/tutorManage";   
    //  history.push("/tutor/userInfo"); 
    }else{
      Message.success('Login failed, Username or password error');
    }
  
  };


  return (
    <div className={styles.LoginBlock} style={{ zIndex:9}}>
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
