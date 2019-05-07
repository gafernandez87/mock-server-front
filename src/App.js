import React from 'react';
import './App.css';
import "antd/dist/antd.css";
import axios from 'axios';
import BodyContent from './components/BodyContent'
import { Layout, Menu } from 'antd';

const { Header, Content } = Layout;

class App extends React.Component {
  
  state = {
    mockList: [],
    endpointList: [],
    currentPage: "mocks"
  };

  componentDidMount = () => {
    axios.get(`http://localhost:8000/mocks`)
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
    axios.get(`http://localhost:8000/endpoints`)
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

  updateMockList = (mockList) => {
    this.setState({mockList})
  }

  refreshEndpointList = (mockId) => {
    axios.get(`http://localhost:8000/mocks/${mockId}/endpoints`)
    .then(response => {
      this.setState({endpointList: response.data})
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
            <Menu.Item onClick={() => {this.setState({currentPage: "mocks"})}} key="1">Mocks</Menu.Item>
            <Menu.Item onClick={this.showAllEndpoints} key="2">Endpoints</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{
              background: '#fff', padding: 24, margin: 0, minHeight: 280,
            }}
            >
              <BodyContent 
                page={this.state.currentPage}
                mockList={this.state.mockList}
                endpointList={this.state.endpointList }
                changePage={this.changePage}
                updateMockList={this.updateMockList}
                updateEndpointList={this.updateEndpointList}
                refreshEndpointList={this.refreshEndpointList}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}


export default App;
