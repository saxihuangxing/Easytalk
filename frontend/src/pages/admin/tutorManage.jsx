/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Table, Pagination, Icon, Message, Button } from '@alifd/next';
import { Link } from 'react-router-dom';
import { getAllTutorInfo } from '@/service/common/api';
import CommonUtil from '@/utils/CommonUtils';

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

    _this.setLoadingVisible(true);
    const data = await getAllTutorInfo();
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
    return (
      <div className="operation-table-operation" style={styles.operationTable}>
        <Link to={''} className={styles.action}>
          details
        </Link>
        <Button
          onClick={() => {
            this.deleteTutor(record.tutorId);
          }}
        >
          {' '}
          delete{' '}
        </Button>
        <Button> deactive </Button>
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
          <Table.Column
            title="Name"
            dataIndex="name"
            //cell={this.renderCourseNameTitle}
            width={200}
            alignHeader="left"
            align="center"
          />
          <Table.Column title="nationality" dataIndex="nationality" width={120} alignHeader="center" align="center" />
          <Table.Column title="操作" dataIndex="operation" width={150} align="center" cell={this.renderOperations} />
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

  deleteTutor(tutorId) {}
}

const styles = {
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
