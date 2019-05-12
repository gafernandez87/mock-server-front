import React from 'react';
import axios from 'axios';
import { Row, Col, PageHeader, Input, Icon, Button, Steps } from 'antd';
import Endpoint from './Endpoint'
import EndpointCard from './EndpointCard'
import Constants from '../config/Constants'

const emptyEndpoint = {
    name: "new endpoint",
    httpRequest: {
        path: "",
        method: "GET"
    },
    httpResponse: {
        statusCode: 200
    },
    saveStatus: "",
    errorMessage: ""
}

const Step = Steps.Step;

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

        if ( updatedEndpoint.httpRequest.path.substring(0, 1) != "/" ) {
            this.setState({
                saveStatus: "error",
                errorMessage: 'The first character of the path must be "/"'
            })
            return updatedEndpoint;
        }
        updatedEndpoint.httpResponse.body = JSON.parse(this.state.currentEndpoint.stringBody)
        const mockId = this.props.getMockId()

        const url = this.state.newEndpoint ? `${Constants.API_URL}/mocks/${mockId}/endpoints` : `${Constants.API_URL}/mocks/${mockId}/endpoints/${updatedEndpoint._id}`;
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

        axios.delete(`${Constants.API_URL}/mocks/${mockId}/endpoints/${endpointId}`)
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

    changeHeader = (index, input, isKey, value) => {
        const newHeaders = {...this.state.currentEndpoint.newHeaders}
        console.log("newHeaders", newHeaders)
        console.log("newHeaders[index]", newHeaders[index])
        console.log("newHeaders[index][input]", newHeaders[index][input])

        newHeaders[index][input] = value
        //this.setState({newHeaders})
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
            errorMessage={this.state.errorMessage}
            closeAlert={this.closeAlert}
            bodyClass={this.state.bodyClass}
            isNewEndpoint={this.state.newEndpoint}
            changeHeader={this.changeHeader}
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
                    prefix={this.props.getMockPrefix()}
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
                stringBody: JSON.stringify(endpoint.httpResponse.body, null, 2),
                newHeaders: this.getNewHeaders(endpoint.httpResponse.headers)
            },
            newEndpoint: false
        })
    }

    getNewHeaders = (headers) => {
        if(headers){
            const newHeader = Object.keys(headers).map((key, i) => {
                const input = `input_${i}`
                let header = {}
                let subObject = {}
                //Al armar el objeto, la "key" (subObject[key]) no queda como String y despues se rompe todo
                subObject[key] = headers[key]
                header[input] = subObject
                return header
            })
            console.log(newHeader)
            return newHeader
        }else{
           return []
        }
        
    }

    newEndpoint = () => {
        this.setState({
            currentEndpoint: emptyEndpoint,
            newEndpoint: true
        })
    }

    getTitle = () => {
        return (`Mock GROUP: ${this.props.getMockName()}`)
    }

    getSubTitle = () => {
        return (`Path prefix: ${this.props.getMockPrefix()}`)
    }

    render(){
        const isNewEndpoint = this.state.newEndpoint

        return (
            <div>
                <Row>
                    <Col>
                        <PageHeader
                            onBack={() => this.props.changePage("mocks")}
                            title={this.getTitle()}
                            subTitle={this.getSubTitle()}
                        >
                            <div>
                                    <Button type="dashed" onClick={this.newEndpoint}><Icon type="plus" />Add Enpoint</Button>
                            </div>
                        </PageHeader>
                    </Col>
                </Row>
                <Row style={{marginTop: 10}}>
                    <Col span={8}>
                        <Steps current={1}>
                            <Step status="finish" title="Endpoint list" icon={<Icon type="ordered-list" />} />
                        </Steps>
                        {isNewEndpoint && <div className="blured">
                            {this.renderEndpointList()}
                        </div>}
                        {!isNewEndpoint && <div>
                            {this.renderEndpointList()}
                        </div>}
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