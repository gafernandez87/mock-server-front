import React from 'react';
import axios from 'axios';
import { Row, Col, Menu, Icon } from 'antd';
import Endpoint from './Endpoint'
import EndpointCard from './EndpointCard'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const emptyEndpoint = {
    name: "new endpoint",
    httpRequest: {
        path: "",
        method: "GET"
    },
    httpResponse: {
        statusCode: 200
    },
    saveStatus: ""
}

class EndpointsList extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            currentEndpoint: {...emptyEndpoint},
            mock_id: this.props.mock_id,
            newEndpoint: true
        }
    }

    closeAlert = () => {
        this.setState({saveStatus: ""})
    }

    saveEndpoint = () => {
        const updatedEndpoint = { ...this.state.currentEndpoint}
        updatedEndpoint.httpResponse.body = JSON.parse(this.state.currentEndpoint.stringBody)
        const mockId = this.props.getMockId()

        const url = this.state.newEndpoint ? `http://localhost:8000/mocks/${mockId}/endpoints` : `http://localhost:8000/mocks/${mockId}/endpoints/${updatedEndpoint._id}`;
        const method = this.state.newEndpoint ? "post" : "put";

        (axios[method])(url, updatedEndpoint)
        .then(_ => {
            this.setState({
                currentEndpoint: updatedEndpoint,
                saveStatus: "success"
            })
            this.props.refreshEndpointList(mockId)
            return updatedEndpoint
        })
        .then(updatedEndpoint => {
            this.selectEndpoint(updatedEndpoint)
        }).catch(err => {
            console.error(err)
            this.setState({
                saveStatus: "error"
            })
        })
    }

    deleteEndpoint = () => {
        const mockId = this.props.getMockId()
        const endpointId = this.state.currentEndpoint._id

        axios.delete(`http://localhost:8000/mocks/${mockId}/endpoints/${endpointId}`)
        .then(data => {
            console.log("Delete result", data)
            this.setState({currentEndpoint: emptyEndpoint})
            this.props.refreshEndpointList(mockId)
        }).catch(err => {
            console.error(err)
            this.setState({
                saveStatus: "error"
            })
        })
    }

    changeBody = (e) => {
        const body = e.target.value
        let bodyClass = ""
        try{
            JSON.parse(body)
        }catch(err){
            bodyClass = "error"
        }

        this.setState({bodyClass})
    }

    handleChange = (e, model) => {
        let currentEndpoint = { ...this.state.currentEndpoint };
        if(model) {
            currentEndpoint[model][e.target.name] = e.target.value;
        } else {
            if(e.target.name === "body"){
                this.changeBody(e)
                currentEndpoint.stringBody = e.target.value
            }else{
                currentEndpoint[e.target.name] = e.target.value;
            }
        }
        this.setState({ currentEndpoint }); 
    }

    renderEndpoint = () => {
        return (<Endpoint
            data={this.state.currentEndpoint}
            saveEndpoint={this.saveEndpoint}
            deleteEndpoint={this.deleteEndpoint}
            handleChange={this.handleChange}
            saveStatus={this.state.saveStatus}
            closeAlert={this.closeAlert}
            bodyClass={this.state.bodyClass}
            isNewEndpoint={this.state.newEndpoint}
        />)
    }

    renderEndpointList = () => {
        return this.props.list.map( (endpoint, index) => {
            return (
                <EndpointCard 
                    selectedId={this.state.currentEndpoint._id} 
                    key={index} 
                    endpoint={endpoint} 
                    index={index} 
                    selectEndpoint={this.selectEndpoint} />
            )
        })
    }

    selectEndpoint = (endpoint) => {
        this.setState({
            currentEndpoint: {
                ...endpoint,
                httpRequest: { ...endpoint.httpRequest },
                httpResponse: { ...endpoint.httpResponse },
                stringBody: JSON.stringify(endpoint.httpResponse.body, null, 2)
            },
            newEndpoint: false
        })
    }

    newEndpoint = () => {
        this.setState({
            currentEndpoint: emptyEndpoint,
            newEndpoint: true
        })
    }

    render(){
        return (
            <div>
                <Row>
                    <Col>
                        <Menu mode="horizontal">
                            <Menu.Item key="newEndpoint" onClick={this.newEndpoint}>
                                <Icon type="plus" />New Endpoint
                            </Menu.Item>
                            <SubMenu title={<span className="submenu-title-wrapper">Endpoints</span>}>
                                <MenuItemGroup  title="Endpoints">
                                {this.props.list.map(endpoint => {
                                    return (
                                        <Menu.Item key={endpoint._id} onClick={() => this.selectEndpoint(endpoint)}>
                                            {endpoint.httpRequest.method} {endpoint.httpRequest.path}
                                        </Menu.Item>
                                    )
                                })}
                                </MenuItemGroup>
                                
                            </SubMenu>
                        </Menu>
                    </Col>
                </Row>
                <Row style={{marginTop: 10}}>
                    <Col span={8}>
                        {this.renderEndpointList()}
                    </Col>
                    <Col span={16}>
                        {this.renderEndpoint()}
                    </Col>
                </Row>
                
            </div>
        )
    }
}

export default EndpointsList