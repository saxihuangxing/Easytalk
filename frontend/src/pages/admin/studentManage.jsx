/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Table, Pagination, Icon, Message, Button, Dialog, Input, NumberPicker } from '@alifd/next';
import { Link } from 'react-router-dom';
import { getAllStudentInfo } from '@/service/common/api';
import { walletTopup } from '@/service/admin/api';
import { getWalletInfo } from '@/service/admin/api';
import CommonUtil from '@/utils/CommonUtils';
import Constant from '@/constant';

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
      topupDlgVisible: false,
    };
    this.currentPage = 1;
  }

  componentDidMount() {
    //  this.fetchStudentListData(1);
  }

  componentWillMount() {
    this.fetchStudentListData(1);
  }


  fetchStudentListData = async (page) => {
    const _this = this;
    const tableData = this.state.tableData;

    _this.setLoadingVisible(true);
    const data = await getAllStudentInfo();
    const wallets = await getWalletInfo();
    if (data != null && data.length > 0) {
      data.map((item)=>{
        for(let i in wallets){
          if(wallets[i].id == item.walletId){
            item.balance = wallets[i].balance;
          }
        }
      });
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
      console.log('fetchStudentListData failed.', data);
    }
  };

  renderOperations = (value, index, record) => {
    return (
      <div className="operation-table-operation" style={styles.operationTable}>
        <Button type="primary" style={styles.button}>
          details
        </Button>
        <Button type="primary"  style={styles.button}
          onClick={() => {
            this.deleteStudent(record.id);
          }}
        >
          delete
        </Button>
        <Button type="primary"  style={styles.button}
          onClick={() => {
            //this.deleteStudent(record.id);
            this.setState({ topupDlgVisible: true });
            this.selectRecord = record;
            this.selectIndex = index;
          }}
        >
          topup
        </Button>
        <Button type="primary"   style={styles.button} >
          deactive
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
    this.fetchStudentListData(currentPage);
    this.currentPage = currentPage;
  };

  render() {
    const { tableData, isLoading } = this.state;
    function onNumberPickerChange(value) {
      console.log("changed", value);
      this.topupValue = value;
    }
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
            title="Account"
            dataIndex="accountName"
            width={200}
            alignHeader="left"
            align="left"
          />
          <Table.Column
            title="Name"
            dataIndex="name"
            width={200}
            alignHeader="left"
            align="left"
          />
           <Table.Column
            title="Balance"
            dataIndex="balance"
            width={150}
            alignHeader="left"
            align="left"
          />
          <Table.Column title="Operate" dataIndex="operation" width={250} align="left" cell={this.renderOperations} />
        </Table>
        <div style={styles.paginationContainer}>
          <Pagination
            current={tableData.currentPage}
            pageSize={tableData.pageSize}
            total={tableData.total}
            onChange={this.onChangePage}
          />
        </div>
        <Dialog
          v2
          title="Top up"
          visible={ this.state.topupDlgVisible }
          onOk={this.topupConfirm.bind(this)}
          onClose={this.topupCancel.bind(this)}
        >
          Input the amount wanna topup:
          <NumberPicker hasTrigger={false} onChange={onNumberPickerChange.bind(this)} />
        </Dialog>
      </div>
    );
  }

  async topupConfirm(){
    const res = await walletTopup(this.selectRecord.walletId,this.topupValue);
    if(res.code == Constant.RES_SUCCESS){
      Message.success("top up sucess!");
      this.fetchStudentListData(this.currentPage);
    }else{
      Message.error("top up failed!");
    }
    this.setState({ topupDlgVisible:false })
  }
  topupCancel(){
    this.setState({ topupDlgVisible:false })
  }
  deleteStudent(tutorId) {}
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
