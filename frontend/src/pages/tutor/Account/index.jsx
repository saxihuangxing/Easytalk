import * as React from 'react';
import { Box, Button, Card, Form, Input, Select, Radio, Field, Divider, Message, Tag } from '@alifd/next';
import { getTutorInfo, setTutorInfo } from '@/service/tutor/dataSource';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import  Constant  from '@/constant';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.field = new Field(this);
    this.state = {
      data: {},
      allowEdit:true
    }
  }

  handleSubmit = async () => {
    this.field.validate((errors, values) => {
      if (errors) {
        Message.error('Errors in form!!!');
        return;
      }
      setTutorInfo(values).then((res)=>{
        if(res && res.code == Constant.RES_SUCCESS){
          Message.success('update info successful!');
        }else{
          Message.error('update info error');
        }
      })
    });
  };

  handleEdit = () => {
    this.setState({ allowEdit:false });
  }

  componentDidMount() {
    console.log('search >>> componentDidMount');
    this.fetchTutorInfo();
  }



    /*applyStatus: { type: String},  // 'checking' || 'approved'
    status: { type: String },      // 'normal' || 'deactive'    
    name : { type: String },
    residence: { type: String },
    age: { type: Number },
    gender:{ type:Boolean },
    nationality:{ type:String },
    introduction : { type: String },*/


  render() {
    const init = this.field.init;
    const { data, allowEdit } = this.state;
    let status = 'unknow';
    let color = 'blue';
    if(data && data.applyStatus == 'checking'){
      status = 'checking'
    }
    if(data && data.applyStatus == 'approved'){
      if(data.status){
        status = status;
        if(status == 'normal'){
          color = 'green'
        }else if(status == 'deactive'){
          color = 'red';
        }
      }
    }
    return (
      <div>
       <Card free>
          <Card.Header title="Personal Info" />
          <Card.Divider />
          <label>Account status:</label> <Tag color={color}> {status} </Tag>
          <Card.Content>
            <Form field={this.field} responsive fullWidth labelAlign="top" disabled={allowEdit}>
              <Form.Item colSpan={4} label="Name">
                <Input name="name" defaultValue={data.name}  placeholder="nick name" />
              </Form.Item>
              <Form.Item colSpan={4} label="Age">
                <Input name="age" defaultValue={data.age}placeholder="" />
              </Form.Item>
              <Form.Item colSpan={4} label="Nationality">
                <Input name="nationality" defaultValue={data.nationality} placeholder="" />
              </Form.Item>
              <Form.Item colSpan={4} label="residence">
                <Input name="residence" defaultValue={data.residence} placeholder="Current residence" />
              </Form.Item>
              <Form.Item colSpan={4} label="gender">
              <Radio.Group name="gender" defaultValue={data.gender} aria-labelledby="self">
                <Radio id="male" value="male">
                  male
                </Radio>
                <Radio id="female" value="female">
                  female
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item colSpan={8} label="Self introduction">
              <Input.TextArea name="introduction"  defaultValue={data.introduction} placeholder="Input." showLimitHint maxLength={500} />
            </Form.Item>
            <Divider />
            <Form.Item colSpan={12}>
              <Box spacing={8} direction="row">
                <Form.Submit type="primary" onClick={this.handleEdit} validate>
                  Edit
                </Form.Submit>
                <Form.Submit type="primary" onClick={this.handleSubmit} validate>
                  Save
                </Form.Submit>
              </Box>
            </Form.Item>
            </Form>
          </Card.Content>
        </Card>
      </div>
    );
  }

  fetchTutorInfo = async () => {
    let res = await getTutorInfo({});
    if(res && res.code === Constant.RES_SUCCESS){
        if(res.data && res.data.length > 0){
          this.setState({ data:res.data[0] });
        }
    }
  } 
}
