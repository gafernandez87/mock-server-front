import React from 'react';
import { List } from 'antd';
import MockCard from './MockCard'

class Mocks extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            mockList: props.list,
            listItemStyle: {
                cursor: "pointer"
            }
        }
    }

    render(){
        return (
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 7,
                }}
                dataSource={this.props.list}
                renderItem={ (item, index) => (
                    <MockCard item={item} index={index} showMock={this.props.showMock} />
                )}
            />
        )
    }
}

export default Mocks