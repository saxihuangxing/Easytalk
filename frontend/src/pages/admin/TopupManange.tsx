/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Table, Pagination, Icon, Message, Button, Dialog, Input, NumberPicker } from '@alifd/next';
import { getTopupApplyInfo,setTopupApplyResult } from '@/service/admin/api';
import CommonUtil from '@/utils/CommonUtils';
import Constant from '@/constant';
import moment from 'moment';

export default class studentManage extends Component {
  static displayName = 'Student List';

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
    //  this.fetchApplytListData(1);
  }

  componentWillMount() {
    this.fetchApplytListData(1);
  }


  fetchApplytListData = async (page) => {
    const _this = this;
    const tableData = this.state.tableData;

    _this.setLoadingVisible(true);
    const data = await getTopupApplyInfo({ status:'waiting' });
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
      console.log('fetchApplytListData failed.', data);
    }
  };

  renderOperations = (value, index, record) => {
    return (
      <div className="operation-table-operation" style={styles.operationTable}>
        <Button type="primary" style={styles.button} onClick = {()=>{ this.topupApprove(record.id,true)}}>
          Approve
        </Button>
        <Button type="primary"   style={styles.button}
            onClick = {()=>{ this.topupApprove(record.id,false)}}
        >
          Reject
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
    this.fetchApplytListData(currentPage);
    this.currentPage = currentPage;
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
          <Table.Column
            title="Id"
            dataIndex="id"
            width={200}
            alignHeader="left"
            align="left"
          />
          <Table.Column
            title="Student Id"
            dataIndex="stuId"
            width={200}
            alignHeader="left"
            align="left"
          />
          <Table.Column
            title="Student Name"
            dataIndex="stuName"
            width={200}
            alignHeader="left"
            align="left"
          />
           <Table.Column
            title="Amount"
            dataIndex="amount"
            width={150}
            alignHeader="left"
            align="left"
          />
            <Table.Column
            title="Time"
            dataIndex="time"
            width={150}
            alignHeader="left"
            align="left"
            cell ={ (value, index, record)=>{return moment(value).format('MM-DD HH:mm');}}
          />
          <Table.Column title="Operate" dataIndex="operation" width={250} align="left" cell={this.renderOperations.bind(this)} />
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

  async topupApprove(id:String,result:Boolean){
    const res = await setTopupApplyResult(id,result);
    if(res.code == Constant.RES_SUCCESS){
      Message.success("operator commit sucess!");
      this.fetchApplytListData(this.currentPage);
    }else{
      Message.error("top up failed!");
    }
  }
}

const styles = {
  button:{
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
