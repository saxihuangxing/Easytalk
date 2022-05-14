/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Table, Pagination, Icon, Message, Button } from '@alifd/next';
import { Link } from 'react-router-dom';
import { getAllTutorInfo } from '@/service/common/api';
import { setTutorStatus, deleteTutorById } from '@/service/admin/api';
import CommonUtil from '@/utils/CommonUtils';
import Constant from '@/constant';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default class TutorManage extends Component {
  static displayName = 'Tutor List';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      tableData: {
        org: [],
        total: 0,
        pageSize: 8,
        currentPage: 1,
        list: [],
      },
      isLoading: false,
    };
    this.currentPage = 1;
  }

  componentDidMount() {
    //  this.fetchTutorsListData(1);
  }

  componentWillMount() {
    this.fetchTutorsListData(1);
  }

  /**
   * 获取房间列表
   */

  fetchTutorsListData = async (page) => {
    const _this = this;
    const tableData = this.state.tableData;
    this.currentPage = page;
    _this.setLoadingVisible(true);
    const res = await getAllTutorInfo();
    let data = null;
    if (res.code === Constant.RES_SUCCESS) {
      data = res.data;
    }
    if (data != null && data.length > 0) {
      let list = [];
      CommonUtil.ganerateListFromTree(data, list, 1);
      tableData.total = list.length;
      tableData.currentPage = page;
      tableData.org = data;

      let min = (page - 1) * tableData.pageSize;
      let max = tableData.pageSize * page;
      let newList = [];
      if (list.length > min) {
        for (let i = min; i < max; i++) {
          if (typeof list[i] == 'undefined') {
            break;
          }
          newList.push(list[i]);
        }
      }
      tableData.list = newList;
      this.setState({
        tableData: tableData,
        isLoading: false,
      });
    } else {
      tableData.total = 0;
      tableData.currentPage = 1;
      tableData.org = [];
      tableData.list = [];
      this.setState({
        tableData: tableData,
        isLoading: false,
      });
      console.log('fetchTutorsListData failed.', data);
    }
  };

  renderOperations = (value, index, record) => {
    const nextStatus = record.status == Constant.TUTOR_STATUS.ACTIVE ? 'deactive' : 'active';
    return (
      <div className="operation-table-operation" style={styles.operationTable}>
        <Button
          type="primary"
          style={styles.button}
          onClick={() => {
           // window.location.href = `#/admin/home/tutorDetail?tutorId=${record.id}`;
              window.open(`#/admin/home/tutorDetail?tutorId=${record.id}`);
          }}
        >
          details
        </Button>
        <Button
          type="primary"
          style={styles.button}
          onClick={() => {
            this.deleteTutor(record.id);
          }}
        >
          delete
        </Button>
        <Button
          type="primary"
          style={styles.button}
          onClick={async () => {
            const res = await setTutorStatus(record.id, nextStatus);
            if(res.code === Constant.RES_SUCCESS){
              Message.success(`${nextStatus} user success`);
              const { tableData } = this.state;
              const indexInList = index + (tableData.currentPage - 1) * tableData.pageSize;
              tableData.list[indexInList].status = nextStatus;
              this.setState({ tableData });
            }else{
              Message.success(`${nextStatus} user failed`);
            }
          }}
        >
          {nextStatus}
        </Button>
      </div>
    );
  };

  setLoadingVisible = (isLoading) => {
    this.setState({
      isLoading,
    });
  };

  /**
   * 翻页处理
   */
  onChangePage = (currentPage) => {
    this.fetchTutorsListData(currentPage);
  };

  render() {
    const { tableData, isLoading } = this.state;
    return (
      <div className="operation-table">
        <Table
          dataSource={tableData.list}
          loading={isLoading}
          className="basic-table"
          style={styles.basicTable}
          hasBorder={false}
        >
          <Table.Column title="Id" dataIndex="id" width={100} alignHeader="left" align="left" />
          <Table.Column title="Name" dataIndex="name" width={100} alignHeader="left" align="left" />
          <Table.Column title="status" dataIndex="status" width={100} alignHeader="left" align="left" />
          <Table.Column title="nationality" dataIndex="nationality" width={100} alignHeader="left" align="left" />
          <Table.Column title="Operator" dataIndex="operation" width={300} alignHeader="center" align="center" cell={this.renderOperations} />
        </Table>
        <div style={styles.paginationContainer}>
          <Pagination
            current={tableData.currentPage}
            pageSize={tableData.pageSize}
            total={tableData.total}
            onChange={this.onChangePage}
          />
        </div>
      </div>
    );
  }

  deleteTutor(tutorId) {
    const self = this;
    Modal.confirm({
      title: 'Delete tutor?',
      icon: <ExclamationCircleOutlined />,
      content: 'are u sure delete tutor,once it deleted , the data cant recover',
      onOk() {
        deleteTutorById(tutorId).then((res)=>{
              if(res.code == Constant.RES_SUCCESS){
                Message.success(`delete tutor successful!`) ;
                self.fetchTutorsListData(self.currentPage);
              }else{
                Message.error('delete tutor failed'); 
              }
          });
      },
      onCancel() {},
  });
  }
}

const styles = {
  button: {
    marginRight: '5px',
    marginBottom: '5px',
  },
  cardContainer: {
    padding: '10px 10px 20px 10px',
  },
  titleCol: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleText: {
    marginLeft: '10px',
    lineHeight: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  paginationContainer: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};
