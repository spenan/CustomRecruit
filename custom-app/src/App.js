import { NoticeBar, WhiteSpace, Icon, Tag, List, Card, WingBlank, PullToRefresh, Toast,Button } from 'antd-mobile';
import { get, post } from './request'
import './App.css'
import React, { Component } from 'react';


const Item = List.Item;
class App extends Component {
  constructor() {
    super();
    this.state = {
      dataList: [],
      pageIndex: 0, //累加10
      pageSize: 10,
      isShowContent: false, // 控制页面再数据请求后显示
      refreshing: false, // 是否显示刷新状态
      isLoading: false, // 是否显示加载状态
      height: document.documentElement.clientHeight,
      loadingText:"加载更多..."
    }
  }
  componentDidMount() {
    this.requestCouponsList();
  }
  requestCouponsList() {
    let { pageIndex, pageSize, dataList } = this.state;
    get("/work", { "pageIndex": pageIndex, "pageSize": pageSize }).then(res => {
      if (res.code == 200 && res.msg == "success") {
        res.Data.map((item, index) => {
          item.ClassType = item.ClassType.split("|").filter((fitem) => {
            return fitem && fitem != " "
          });
        });

        let couponList = [...this.state.dataList, ...res.Data];
        this.setState({
          isShowContent: true,
          pageIndex: pageIndex + 10,
          dataList: couponList,
          refreshing: false,
          isLoading: false,
        })
      }
      else {
        this.setState({
          isShowContent: true,
          pageIndex: pageIndex + 10,
          refreshing: false,
          isLoading: false,
          loadingText:"没有更多数据了"
        })
      }

    })
  }
  // 下拉刷新
  onRefresh = () => {
    Toast.loading();
    this.setState({
      pageIndex: 0,
      dataList: [],
    }, () => {
      this.requestCouponsList();
    })
  };
  // 加载更多
  onEndReached = () => {
    
    if (this.state.isLoading) {
      Toast.hide();
      return;
    }
    this.setState({
      isLoading: true,
    },()=>{
      this.requestCouponsList()
    });
  };
  render() {
    let { dataList, refreshing,isLoading,loadingText } = this.state;
    return (
      <div className="App">
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          Copyright © 「www.spenan.com」 This site is created by spenan and is not used in any business
            </NoticeBar>

        <PullToRefresh         
          damping={200}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}          
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          distanceToRefresh={80}>
          {
            dataList && dataList.map((item, index) => {
              return (
                <WingBlankCard dataList={item} key={index} refreshing={refreshing}></WingBlankCard>
              )
            })
          }
          <Button loading={isLoading}  onClick={this.onEndReached}>{loadingText}</Button>
        </PullToRefresh>

      </div>
    )
  }
}

class WingBlankCard extends Component {
  onRefresh() {
    console.log("123")
  }
  render() {
    let dataList = this.props.dataList;
    return (

      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Card>
          <Card.Header
            title={dataList.Station}

            extra={<span>{dataList.Salary}</span>}
          />
          <Card.Body>
            <div>
              {
                dataList.ClassType.map((item, index) => {
                  return (
                    <Tag key={index}>{item}</Tag>
                  )

                })
              }
              <List className="my-list">
                <Item extra={<div>{dataList.Company} {dataList.JobTime} {dataList.Education}</div>}></Item>
              </List>
            </div>
          </Card.Body>
          <Card.Footer content={dataList.Welfare} />
        </Card>
        <WhiteSpace size="lg" />
      </WingBlank>



    )
  }
}

export default App;
