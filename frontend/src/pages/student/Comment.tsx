import React, { useState } from 'react';
import { Input, Message, Form, Divider, Checkbox, Icon } from '@alifd/next';
import { commentLesson } from '@/service/student/api';
import CONSTANT from '@/constant';
import moment from 'moment';
const { Item } = Form;
import { Rate, Modal } from 'antd';

export interface LessonInfo {
    lessonId: String,
    tutorName: String,
    lessonTime: Number,   //in minute
    textBook: String,
    lessonType: String,
    stuRate: Number,
    stuComment: String ,
}


const DEFAULT_DATA: LessonInfo = {
    lessonId: "",
    tutorName: "",
    lessonTime: 0,   //in minute
    textBook: "",
    lessonType: '',
    stuRate: 0,
    stuComment: '' ,
};

interface LessonProps {
  dataSource?: LessonInfo;
  callback? : Function;
}

const LoginBlock: React.FunctionComponent<LessonProps> = (
  props = { dataSource: DEFAULT_DATA },
): JSX.Element => {
  const { dataSource = DEFAULT_DATA, callback = null } = props;
  let postData  = dataSource;
  const formChange = (values: LessonInfo) => {
    postData = values;
  };


  const handleSubmit = async (values: LessonInfo, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    const res = await commentLesson( postData.lessonId, postData.stuRate, postData.stuComment );
    if (res.code == CONSTANT.RES_SUCCESS) {
      Message.success('课程评价成功');
    } else {
      Message.error('课程评价失败');
    }
    if(callback){
        callback();
    }
  };


  return (
        <Form value={postData} onChange={formChange} size="large">
          <Item label='老师:'>
            { postData.tutorName}
          </Item>
          <Item label='上课时间:'>
            { moment( postData.lessonTime*1000*60 ).format('MM-DD HH:mm')}
          </Item>
          <Item label='教材:'>
            { postData.textBook }
          </Item>
          <Item required requiredMessage="必须" lable = '课程评分'>
            <Rate  name='stuRate' defaultValue={ postData.stuRate }/>
          </Item>

          <Item required requiredMessage="必须" lable = '课程评价'>
                <Input.TextArea
                  name="stuComment"
                  defaultValue={ postData.stuComment }
                  placeholder="请输入您的评价"
                  showLimitHint
                  maxLength={800}
                />
          </Item>
          <Item style={{ marginBottom: 10 }}>
            <Form.Submit
              type="primary"
              onClick={handleSubmit}
              validate
            >     
              提交  
            </Form.Submit>
          </Item>
        </Form>
  );
};

export default LoginBlock;
