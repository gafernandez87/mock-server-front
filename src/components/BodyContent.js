import React from 'react'
import MockList from './MockList';
import EndpointList from './EndpointList';
import axios from 'axios';


class BodyContent extends React.Component{

    showMock = (mockId) => {
        axios.get(`http://localhost:8000/mocks/${mockId}/endpoints`)
        .then(response => {
          this.setState({mock_id: mockId})
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
                  getMockId={this.getMockId} />)
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