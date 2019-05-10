import React from 'react'
import MockList from './MockList';
import EndpointList from './EndpointList';
import axios from 'axios';
import Constants from '../config/Constants'

class BodyContent extends React.Component{

  showMock = (mockId, name) => {
      axios.get(`${Constants.API_URL}/mocks/${mockId}/endpoints`)
      .then(response => {
        this.setState({mock_id: mockId, mock_name: name})
        this.props.updateEndpointList(response.data)
        this.props.changePage("endpoints")
      })
      .catch(err => {
        // TODO: "Handle this case"
        console.error(err)
        this.props.changePage("mocks")
      })
  }

  getMockId = () => {
    return this.state.mock_id
  }

  getMockName = () => {
    return this.state.mock_name
  }

  renderBody = (page) => {
      switch(page){
          case "mocks":
            return (<MockList 
                list={this.props.mockList} 
                showMock={this.showMock} 
                deleteMock={this.props.deleteMock} 
                refreshMockList={this.props.refreshMockList}/>)

          case "endpoints":
            return (<EndpointList 
                list={this.props.endpointList} 
                refreshEndpointList={this.props.refreshEndpointList}
                getMockId={this.getMockId}
                getMockName={this.getMockName}
                changePage={this.props.changePage} />)
          default:
            return (<div>You should not be here... RUN!</div>)
      }
  }
  

  render(){
      return(
          <div>{this.renderBody(this.props.page)}</div>
      )
  }
}

export default BodyContent