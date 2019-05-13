import React from 'react';
import './App.css';
import "antd/dist/antd.css";
import axios from 'axios';
import BodyContent from './components/BodyContent'
import { Layout, Menu } from 'antd';
import Constants from './config/Constants'

const { Header, Content } = Layout;

class App extends React.Component {
  
  state = {
    mockList: [],
    endpointList: [],
    currentPage: "mocks"
  };

  componentDidMount = () => {
    axios.get(`${Constants.API_URL}/mocks`)
    .then(response => {
        this.setState({mockList: response.data})
    }).catch(err => {
      // TODO: "Handle this case"
      console.error(err)
    })

  }

  changePage = (newPage) => {
    this.setState({currentPage: newPage})
  }

  showAllEndpoints = () => {
    axios.get(`${Constants.API_URL}/endpoints`)
    .then(response => {
      this.setState({
        endpointList: response.data,
        currentPage: "endpoints"
      })
    })
    .catch(err => {
      // TODO: "Handle this case"
      console.error(err)
      this.setState({currentPage: "mocks"})
    })
  }

  updateEndpointList = (endpointList) => {
    this.setState({endpointList})
  }

  deleteMock = (mockId) => {
    axios.delete(`${Constants.API_URL}/mocks/${mockId}`)
    .then(data => {
        console.log("Delete result", data)
        return axios.get(`${Constants.API_URL}/mocks`)
    })
    .then(result => {
      this.setState({mockList: result.data})
    }).catch(err => {
        console.error(err)
        this.setState({
            saveStatus: "error"
        })
    })
  }

  refreshEndpointList = (mockId) => {
    axios.get(`${Constants.API_URL}/mocks/${mockId}/endpoints`)
    .then(response => {
      this.setState({endpointList: response.data})
    }).catch(err => {
      console.error(err)
      this.setState({currentPage: "mocks"})
    })
  }

  refreshMockList = () => {
    axios.get(`${Constants.API_URL}/mocks`)
    .then(response => {
      this.setState({mockList: response.data})
    }).catch(err => {
      console.error(err)
      this.setState({currentPage: "mocks"})
    })
  }

  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item onClick={() => {this.setState({currentPage: "mocks"})}} key="1">Home</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          
          <Layout style={{ padding: '20px' }}>
            <Content style={{
              background: '#fff', padding: 24, margin: 0, minHeight: 280,
            }}
            >
              <BodyContent 
                page={this.state.currentPage}
                mockList={this.state.mockList}
                endpointList={this.state.endpointList }
                changePage={this.changePage}
                updateEndpointList={this.updateEndpointList}
                refreshEndpointList={this.refreshEndpointList}
                refreshMockList={this.refreshMockList}
                deleteMock={this.deleteMock}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}


export default App;
