import * as React from 'react';
import { Box, Button, Card, Form, Input, Select, Radio, Field, Divider, Message, Tag, Upload } from '@alifd/next';
import { getTutorInfo, setTutorInfo, deletePhoto, deleteVideo } from '@/service/tutor/dataSource';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import Constant from '@/constant';
import Config from '@/config/config';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.field = new Field(this);
    this.state = {
      data: undefined,
      allowEdit: true,
    };
  }

  handleSubmit = async () => {
    this.field.validate((errors, values) => {
      if (errors) {
        Message.error('Errors in form!!!');
        return;
      }
      setTutorInfo(values).then((res) => {
        if (res && res.code == Constant.RES_SUCCESS) {
          Message.success('update info successful!');
        } else {
          Message.error('update info error');
        }
      });
    });
  };

  handleEdit = () => {
    this.setState({ allowEdit: false });
  };

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
    if(!data){
      return <></>
    }
    if (data && data.applyStatus == 'checking') {
      status = 'checking';
    }
    if (data && data.applyStatus == 'approved') {
      if (data.status) {
        status = status;
        if (status == 'normal') {
          color = 'green';
        } else if (status == 'deactive') {
          color = 'red';
        }
      }
    }

    function onPreview(info) {
      console.log("onPreview callback : ", info);
    }
    
    function onChange(info) {
      console.log("onChange callback : ", info);
    }
    
    function onSuccess(res, file) {
      console.log("onSuccess callback : ", res, file);
    }
    
    function onError(file) {
      console.log("onError callback : ", file);
    }
    function onRemove(file){
      console.log("onRemove callback : ", file);
      deletePhoto(file.name);
    }

    function onVideoError(file) {
      console.log("onVideoError callback : ", file);
    }

    function onVideoRemove(file){
      console.log("onVideoRemove callback : ", file);
      deleteVideo(file.name);
    }
    let uid = 0;
    const photos = data.photos.map((photo) => {
      return {
        uid: uid++,
        name: photo.substring(photo.lastIndexOf('/')+1),
        state: 'done',
        url: Config.serverUrl + photo,
        imgURL: Config.serverUrl + photo,
      }
    })
    const videoDefault = [];
    if(data.video){
      const video = {
        name: data.video.substring(data.video.lastIndexOf('/')+1),
        state: "done",
        downloadURL:data.video,
        fileURL:data.video,
      }
      videoDefault.push(video);
    }
    return (
      <div>
        <Card free>
          <Card.Header title="Personal Info" />
          <Card.Divider />
          <label>Account status:</label> <Tag color={color}> {status} </Tag>
          <Card.Content>
          <Card.Divider />
          <Form.Item colSpan={4} label="Video">
              <Upload
                action="/api/tutor/upload-video"
                accept="video/mp4"
                limit={1}
                multiple
                listType="text"
                onError={onVideoError}
                onRemove={ onVideoRemove }
                defaultValue={videoDefault}
              >
              <Button type="primary" style={{ margin: "0 0 10px" }}>
                Upload Video
              </Button>
            </Upload>
         </Form.Item>
          <Form.Item colSpan={4} label="Photos">
            <Upload.Card
              listType="card"
              action="/api/tutor/upload-photo"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
              onPreview={onPreview}
              onChange={onChange}
              onSuccess={onSuccess}
              onError={onError}
              onRemove={ onRemove }
              showDownload={false}
              reUpload
              defaultValue={photos}
            />
         </Form.Item>
            <Form field={this.field} responsive fullWidth labelAlign="top" disabled={allowEdit}>
              <Form.Item colSpan={4} label="Name">
                <Input name="name" defaultValue={data.name} placeholder="nick name" />
              </Form.Item>
              <Form.Item colSpan={4} label="Age">
                <Input name="age" defaultValue={data.age} placeholder="" />
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
                <Input.TextArea
                  name="introduction"
                  defaultValue={data.introduction}
                  placeholder="Input."
                  showLimitHint
                  maxLength={500}
                />
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
    if (res && res.code === Constant.RES_SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.setState({ data: res.data[0] });
      }
    }
  };
}
