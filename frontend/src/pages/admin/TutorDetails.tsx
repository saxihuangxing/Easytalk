import * as React from 'react';
import { Dialog, Avatar, Box, Divider, Button, Tag, Table, Message, Card } from '@alifd/next';
import { getTutorInfoById } from '@/service/common/api';
import Constant from '@/constant';
import CommonUtil from '@/utils/CommonUtils';
import Config from '@/config/config';
const maxDays = Config.scheduleMaxDays;
import moment from 'moment';
import { Slider, Icon } from '@alifd/next';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
export default class tutorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      dlgVisible: false,
      dlgContent: "",
      balance:0,
    };
  }

  componentDidMount() {
    console.log('search >>> componentDidMount');
    const tutorId = CommonUtil.getQueryVariable('tutorId');
    this.fetchTutorInfoById(tutorId);
  }

  dataSource(scheduleMap) {
    const result = [];
    const schArr = new Array(maxDays).fill(0).map((_) => new Array());
    for (let key in scheduleMap) {
      const timeMs = parseInt(key) * 60 * 1000;
      const dt = this.daysDistance(timeMs);
      if (dt >= 0 && dt < maxDays) {
        schArr[dt].push(key);
      }
    }

    Array.from({ length: maxDays }, (_, i) => {
      // Obj['day' + j] = statusArr[i][j];
      result.push({
        time: moment().add('days', i).format('MMM DD(ddd)'),
        schedule: schArr[i],
      });
    });
    return result;
  }
  
  renderCell(rowIndex, value, record) {
    const { scheduleMap } = this.state.data;
    let color = 'grey';
    const Tags = value.map(ele => {
      const status = scheduleMap[ele];
      const time = moment(parseInt(ele) * 60 * 1000).format('HH:mm');
      switch (status) {
        case 1:
          color = 'blue';
          break;
        case 2:{
          color = 'red';
          break;
        }
        default:
          break;
      }
      return (<Tag /* key={`p_p_${color}`}  */
        type="primary"
        color={color}
        style={{ position: 'relative', marginLeft: '5px', marginTop: '3px' }}
      >
        {time}
      </Tag>)
    })
    return (
      <div>
        {Tags}
      </div>
    );
  }

  render() {
    const { data } = this.state;
    if (!data) {
      return <div></div>;
    }
    const timeArea = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const photoEles = data.photos.map((file) => {
      const url = Config.serverUrl + file;
      return (
        <div className="slider-img-wrapper">
          <img style={{ width: '500px', height: '300px' }} src={url} alt={""} />
        </div>
      )
    }
    );
    const MediaElements = [...photoEles];
    if (data.video) {
      const url = Config.serverUrl + data.video;
      const videoEle = (
        <div className="slider-img-wrapper">
          <video controls style={{ width: '500px', height: '300px' }} src={url} alt={""} />
        </div>
      )
      MediaElements.unshift(videoEle);
    }
    return (
      <div>
        <Card free>
          <Card.Header title="Teacher Info" />
          <Card.Divider />
          <Card.Content>
          <div style={{ width:'500px',height:'300px',display:'inline-block'}}> 
            <Slider style={{ width: '500px', height: '300px' }} arrowSize="medium">
              {MediaElements}
            </Slider>
           </div> 
          <div style={{ width:'400px',height:'300px',display:'inline-block' , marginLeft: '20px'}}> 
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}> {'名字:  ' + data.name} </span>
              <br></br>
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}> {'年龄:  ' + data.age} </span>
              <br></br>
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}> {'介绍:  ' + data.introduction} </span>
          </div>
          </Card.Content>
        </Card>
        <Card free>
          <Card.Header title="Schedule" />
          <Card.Divider style = {{ marginBottom:'5px' }}/>
          <span   style={{ position: 'relative',marginLeft: '20px',marginRight: '2px' }} >Opened:</span>
          <Tag
            type="primary"
            color={'blue'}
            style={{ position: 'relative', width:'30px', height:'20px' }}
          />
          <span style={{ position: 'relative',marginLeft: '10px',marginRight: '2px' }} >Booked:</span>
          <Tag
            type="primary"
            color={'red'}
            style={{ position: 'relative', width:'30px', height:'20px' }}
          />
          <Card.Content>
            {data.scheduleMap && (
              <Table dataSource={this.dataSource(data.scheduleMap)} size={'small'}>
                <Table.Column title={timeArea} dataIndex="time" width={"20%"} />
                <Table.Column
                  title={'schedule'}
                  dataIndex="schedule"
                  cell={(value, index, record) => {
                    return this.renderCell(index, value, record);
                  }}
                  width={220}
                />
              </Table>
            )}
          </Card.Content>
        </Card>
      </div>
    );
  }

  dlgCancel() {
    this.setState({ dlgVisible: false });
  }


  fetchTutorInfoById = async (id) => {
    const res = await getTutorInfoById(id, {});
    if (res && res.code === Constant.RES_SUCCESS) {
      if (res.data) {
        this.state.data = res.data;
      }
    }
    this.setState({state:this.state});
  };

  daysDistance(endTime) {
    const nowTime = new Date();
    nowTime.setHours(0, 0, 0, 0);
    const t = endTime - nowTime.getTime();
    const d = Math.floor(t / 1000 / 60 / 60 / 24);
    return d;
  }
}
