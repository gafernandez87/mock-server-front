import React from 'react';
import { Row, Col, Table, Menu, Icon, Modal, Form, Input, Select, Button, Alert, Popover, Timeline } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import Constants from '../config/Constants'
import { object } from 'prop-types';

const {Option} = Select
const emptyMock = {
    name: "New mock",
    author: "",
    description: "",
    brand: "",
    product: ""
}
const brandList = ["AR", "UY", "ES", "MX"]
const productList = ["WELP", "PRESTO", "POSTA", "MANGO", "LUQUITAS"]
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

const content = (
  <Timeline>
    <Timeline.Item>Create a new MOCK group or edit one.</Timeline.Item>
    <Timeline.Item>Add or edit endpoints to your group.</Timeline.Item>
    <Timeline.Item>Define the endpoint path, the http response status, http verb,<br/> response body, and the response headers.</Timeline.Item>
    <Timeline.Item color="green">Use them to mock up your project.</Timeline.Item>
  </Timeline>
);

const confirm = Modal.confirm;

class MockList extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            modalVisible: false,
            confirmLoading: false,
            saveStatus: "",
            newMock: emptyMock,
            searchText: ""
        }
    }

    showDeleteConfirm = (mockId, deleteMock) => {
        confirm({
            title: 'Are you sure delete this Mock?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteMock(mockId)
            }
        });
    }

    showModal = () => {
        this.setState({modalVisible: true});
    }

    closeAlert = () => {
        this.setState({saveStatus: ""})
    }

    createMock = () => {
        this.setState({ confirmLoading: true});
        
        axios.post(`${Constants.API_URL}/mocks`, this.state.newMock)
        .then(_ => {
            this.props.refreshMockList()
            
            this.setState({
                confirmLoading: false,
                newMock: emptyMock,
                saveStatus: "success"
            });
            
        }).catch(err => {
            console.error(err)
            this.setState({saveStatus: "error"})
        })
    }
    
    handleCancel = () => {
        this.setState({modalVisible: false});
    }

    handleChange = (e) => {
        let newMock = {...this.state.newMock}
        newMock[e.target.name] = e.target.value
        this.setState({newMock})
    }

    showAlert = () =>{
        switch(this.state.saveStatus){
            case "success":
                return <Alert 
                        message="Mock created successfully"
                        type="success" banner closable
                        onClose={this.closeAlert}/>
            case "error":
                return <Alert 
                    message="An error occurred while creating the mock. Please try again" 
                    type="error" banner closable
                    onClose={this.closeAlert}/>
            default:
                break;
        }
    }
    
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
          setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => { this.searchInput = node; }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex] !== undefined ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: (text) => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text !== undefined ? text.toString() : ""}
          />
        ),
    })
    
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }
    
    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    generateTableStructure(structure){
        return structure.map(column => {
            let obj = {}

            if(column.name != "actions") {
                obj = {
                    ...this.getColumnSearchProps(column.name)
                }
            }

            obj.title = column.title
            obj.dataIndex = column.name
            obj.key = column.name
            obj.width = column.width
            
            return obj
        })
    }

    generateActions = (mockId, name) => {
        return (<div>
            <a href="javascript:;" onClick={() => this.props.showMock(mockId, name)}>Show</a> | <a href="javascript:;" onClick={() => this.showDeleteConfirm(mockId, this.props.deleteMock)}>Delete</a>
            </div>)
    }

    render(){
        const data = this.props.list.map( (mock, index) => {
            return {
                key: index,
                name: mock.name,
                description: mock.description,
                author: mock.author,
                brand: mock.brand,
                product: mock.product,
                creation_date: mock.creation_date,
                actions: this.generateActions(mock._id, mock.name)
            }
        })
        const columns = this.generateTableStructure([
            {title: "Name", name: "name", width:"15%"},
            {title: "Description", name: "description", width:"25%"},
            {title: "Author", name: "author", width:"15%"},
            {title: "Brand", name: "brand", width:"10%"},
            {title: "Product", name: "product", width:"5%"},
            {title: "Creation date", name: "creation_date", width:"15%"},
            {title: "Actions", name: "actions", width:"10%"}])

        return (
            <div>
                <Modal
                    title="NEW MOCK GROUP"
                    visible={this.state.modalVisible}
                    confirmLoading={this.stateconfirmLoading}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Close</Button>,
                        <Button key="submit" type="primary" onClick={this.createMock} 
                                loading={this.state.confirmLoading}>
                          Create
                        </Button>,
                      ]}
                    >
                        {this.showAlert()}
                        <Form {...formItemLayout}>
                            <Form.Item label="Name">
                                <Input 
                                    id="name" name="name"
                                    value={this.state.newMock.name}
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label="Author">
                                <Input 
                                    id="author" name="author"
                                    value={this.state.newMock.author}
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input 
                                    id="description" name="description"
                                    value={this.state.newMock.description}
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label="Brand">
                                <Select 
                                    onChange={(e) => this.handleChange({ target: { name: "brand", value: e } })}
                                    id="brand" value={this.state.newMock.brand} name="brand"
                                >
                                    {brandList.map(brand => {
                                        return (<Option key={brand} value={brand}>{brand}</Option>)
                                    })}
                                </Select>
                                
                            </Form.Item>
                            <Form.Item label="Product">
                                <Select 
                                    onChange={(e) => this.handleChange({ target: { name: "product", value: e } })}
                                    id="brand" value={this.state.newMock.product} name="product"
                                >
                                    {productList.map(product => {
                                        return (<Option key={product} value={product}>{product}</Option>)
                                    })}
                                </Select>
                            </Form.Item>
                        </Form>
                </Modal>
                <Row style={{marginBottom: 10}}>
                    <Col>
                        <Menu mode="horizontal">
                            <Menu.Item key="newEndpoint" onClick={this.showModal}>
                                <Icon type="plus" />NEW MOCK GROUP
                            </Menu.Item>
                            <Menu.Item key="help" style={{marginLeft: "auto", background: "none"}}>
                                <Popover content={content} title="Route" placement="leftTop" trigger="hover">
                                    <Icon type="question" />
                                </Popover>
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table columns={columns} dataSource={data} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default MockList