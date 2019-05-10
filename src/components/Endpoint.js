import React from 'react'
import { Card,  Form, Input, Select, Button, Affix, Alert, Modal, Icon } from 'antd';

const { Option } = Select;
const confirm = Modal.confirm;


let id = 0;


class Endpoint extends React.Component{

    getSaveMessage = () => {
        return this.props.isNewEndpoint ? "Endpoint created successfully" : "Endpoint saved successfully"
    }

    getButtonText = () => {
        return this.props.isNewEndpoint ? "Create" : "Save"
    }
    
    showAlert = () => {
        switch(this.props.saveStatus){
            case "success":
                return <Alert 
                        message={this.getSaveMessage()}
                        type="success" banner closable
                        onClose={this.props.closeAlert}/>
            case "error":
                return <Alert 
                    message="An error occurred while saving the endpoint. Please try again" 
                    type="error" banner closable
                    onClose={this.props.closeAlert}/>
            default:
                break;
        }
    }

    showDeleteConfirm = (deleteEndpoint) => {
        confirm({
            title: 'Are you sure delete this Endpoint?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteEndpoint()
            }
        });
    }

    renderHeaders = (headers) => {
        if(headers){
            return (
                <Form.Item label="Headers">
                    <Button type="dashed" onClick={this.addNewHeader}><Icon type="plus" />Add header</Button>
                    {headers.map( (header, index) => {
                        const inputNum = Object.keys(header)[0] //Ej: Input_0
                        const key = Object.keys(header[inputNum])[0]
                        const value = header[inputNum][key]
                        console.log("header", header)
                        console.log("inputNum", inputNum)
                        console.log("key", key)
                        console.log("value", value)

                        return(
                            <div key={index}>
                                <Input
                                    style={{width: 200, marginRight: 20}}
                                    key={`${inputNum}_key`} value={key} name={key}
                                    onChange={(e) => this.props.changeHeader(e, 'headers')}
                                />
                                <Input
                                    style={{width: 200}}
                                    key={`${inputNum}_value`} value={value} name={value}
                                    onChange={(e) => this.props.changeHeader(e, 'headers')}
                                />
                                <br />

                            </div>
                        )
                    })}
                    
                </Form.Item>
            )
        }
    }

    render() {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 }
            }
        };
        const isNewEndpoint = this.props.isNewEndpoint

        return (
            <Affix offsetTop={10}>
                {this.showAlert()}
                <Card>
                    <Form {...formItemLayout}>
                        <h2>Request</h2>
                        <Form.Item label="Name">
                            <Input 
                                id="name" value={this.props.data.name} name="name"
                                onChange={(e) => this.props.handleChange(e)}
                            />
                        </Form.Item>
                        <Form.Item label="Author">
                            <Input 
                                id="author" value={this.props.data.author} 
                                name="author" readOnly={!isNewEndpoint}
                                onChange={(e) => this.props.handleChange(e)}
                            />
                        </Form.Item>
                        <Form.Item label="Method">
                            <Select defaultValue={this.props.data.httpRequest.method} style={{ width: "17%" }} 
                                onChange={(e) => this.props.handleChange({ target: { name: "method", value: e } }, 'httpRequest')}
                                id="method" value={this.props.data.httpRequest.method} name="method"
                            >
                                <Option value="GET">GET</Option>
                                <Option value="POST">POST</Option>
                                <Option value="PUT">PUT</Option>
                                <Option value="DELETE">DELETE</Option>
                            </Select>
                            <Input 
                                id="path" value={this.props.data.httpRequest.path} name="path"
                                onChange={(e) => this.props.handleChange(e, 'httpRequest')}
                                style={{width: "81%", marginLeft: 10}}
                            />
                        </Form.Item>
                        
                        <hr />

                        <h2>Response</h2>
                        <Form.Item label="Status">
                            <Input style={{ width: 60 }}
                                id="statusCode" value={this.props.data.httpResponse.statusCode} name="statusCode"
                                onChange={(e) => this.props.handleChange(e, 'httpResponse')}
                            />
                        </Form.Item>
                        
                        {this.renderHeaders(this.props.data.newHeaders)}
                        
                        <Form.Item label="Body" className={this.props.bodyClass}>
                            <Input.TextArea 
                                rows={6} id="body" 
                                value={this.props.data.stringBody} name="body"
                                onChange={(e) => this.props.handleChange(e)}
                            />
                            {this.props.bodyClass === "error" ? <p>Invalid JSON. Please fix it before hitting save</p> : ""}
                        </Form.Item>
                        <Button type="primary" onClick={() => this.props.saveEndpoint()} style={{float: "right"}}>{this.getButtonText()}</Button>
                        {!this.props.isNewEndpoint && <Button type="danger" onClick={() => this.showDeleteConfirm(this.props.deleteEndpoint)}>Delete</Button> }
                    </Form>
                </Card>
            </Affix>
        )
    }
}

export default Endpoint