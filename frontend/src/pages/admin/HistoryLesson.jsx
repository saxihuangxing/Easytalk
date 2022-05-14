/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Table, Pagination, Icon, Message, Button } from '@alifd/next';
import { Link } from 'react-router-dom';
import { getLessonInfo } from '@/service/admin/api';
import CommonUtil from '@/utils/CommonUtils';
import Constant from '@/constant';
import moment from 'moment';
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
  }

  componentWillMount() {
    this.fetchBookLessonListData(1);
  }

  /**
   * 获取房间列表
   */

  fetchBookLessonListData = async (page) => {
    const _this = this;
    const tableData = this.state.tableData;

    this.setState({ isLoading: true });
    const data = await getLessonInfo({ status: Constant.LESSON_STATUS.FINISHED });
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
      console.log('fetchBookLessonListData failed.', data);
    }
  };

  renderOperations = (value, index, record) => {
    return (
      <div className="operation-table-operation" style={styles.operationTable}>
      </div>
    );
  };

  onChangePage = (currentPage) => {
    this.fetchBookLessonListData(currentPage);
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
          
          <Table.Column title={"LessonId"} dataIndex="lessonId"  />
            <Table.Column title={"TutorId"} dataIndex="tutorId"  />
            <Table.Column title={"TutorName"} dataIndex="tutorName"  />
            <Table.Column title={"studentId"} dataIndex="stuId"  />
            <Table.Column title={"studentName"} dataIndex="stuName"  />
            <Table.Column title={"bookTime"} dataIndex="bookTime" 
              cell={(value, index, record) => {
                    return moment(value).format('MM-DD HH:mm');
              }} />
            <Table.Column title={"lessonTime"} dataIndex="lessonTime"
               cell={(value, index, record) => {
                    return moment(value*1000*60).format('MM-DD HH:mm');
              }}
            />
            <Table.Column title={"status"} dataIndex="status"
               cell={(value, index, record) => {
                    return value
              }}
            />
             <Table.Column title={"TextBook"} dataIndex="textBook"  />
             <Table.Column title={"Operation"} dataIndex="textBook"
                        cell={(value, index, record) => {
                            return (
                                <div>
                                    <Button
                                        onClick={() => {
                                            window.open('#/admin/home/lessonDetails?lessonId='+record.lessonId);
                                        }}
                                    >
                                        { 'details' }
                                    </Button>
                            </div>
                            )
                        }} /> 
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
