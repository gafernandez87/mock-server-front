import React from 'react';
import axios from 'axios';
import { Row, Col, PageHeader } from 'antd';
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

    addNewHeader = () => {
        let currentEndpoint = {...this.state.currentEndpoint}
        let newHeaders = [...currentEndpoint.newHeaders]
        
        const l = Object.keys(newHeaders).length
        const input = `input_${l}`
        let subObject = {} 

        subObject[input] = {"":""}
        newHeaders[l] = subObject

        currentEndpoint.newHeaders = newHeaders
        this.setState({currentEndpoint})
    }

    deleteHeader = (index) => {
        let currentEndpoint = {...this.state.currentEndpoint}
        let newHeaders = [...currentEndpoint.newHeaders]
        delete newHeaders[index]
        currentEndpoint.newHeaders = newHeaders
        this.setState({currentEndpoint})
    }
    
    getNewHeaders = (headers) => {
        if(headers){
            const newHeader = Object.keys(headers).map((key, i) => {
                const input = `input_${i}`
                let header = {}
                let subObject = {}

                subObject[key] = headers[key]
                header[input] = subObject
                return header
            })
            return newHeader
        }else{
           return []
        }
    }

    changeHeader = (index, input, isKey, headerValue, headerKey, newHeaderKey) => {
        const newHeaders = {...this.state.currentEndpoint.newHeaders}
        
        if(!isKey){
            newHeaders[index][input][headerKey] = headerValue
        }else{
            delete newHeaders[index][input][headerKey]
            newHeaders[index][input][newHeaderKey] = headerValue
        }

        this.setState({newHeaders})
    }

    convertToHeader = () => {
        let newHeaders = {...this.state.currentEndpoint.newHeaders}
        let l = Object.keys(newHeaders).length
        console.log(newHeaders)
        let result = {}
        for(let i = 0; i < l; i++){
            try{
                const input = Object.keys(newHeaders[i])[0]
                result = Object.assign(newHeaders[i][input], result)
            }catch(e){
                //do nothing
            }
        }
        return result
    }

    saveEndpoint = () => {
        const updatedEndpoint = { ...this.state.currentEndpoint}
        updatedEndpoint.httpResponse.body = JSON.parse(this.state.currentEndpoint.stringBody)
        updatedEndpoint.httpResponse.headers = this.convertToHeader()

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
            addNewHeader={this.addNewHeader}
            changeHeader={this.changeHeader}
            deleteHeader={this.deleteHeader}
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
                stringBody: JSON.stringify(endpoint.httpResponse.body, null, 2),
                newHeaders: this.getNewHeaders(endpoint.httpResponse.headers)
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

    getTitle = () => {
        return (`Mock: ${this.props.getMockName()}`)
    }

    render(){
        return (
            <div>
                <Row>
                    <Col>
                        <PageHeader
                            onBack={() => this.props.changePage("mocks")}
                            title={this.getTitle()}
                        >
                        </PageHeader>
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