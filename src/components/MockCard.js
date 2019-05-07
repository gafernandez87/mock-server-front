import React from 'react'
import { List, Icon } from 'antd'

const IconText = ({ type, text }) => (
    <span>
        <Icon 
            type={type} 
            style={{ marginRight: 8 }} 
            theme="twoTone" twoToneColor="#eb2f96"/>
        {text}
    </span>
);

class MockCard extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            cardStyle: {
                cursor: "pointer"
            }
        }
    }

    enter = () => {
        const cardStyle = {...this.state.cardStyle}
        cardStyle.backgroundColor = "#aecbe8"
        this.setState({cardStyle})
    }

    leave = () => {
        const cardStyle = {...this.state.cardStyle}
        cardStyle.backgroundColor = null
        this.setState({cardStyle})
    }

    render(){
        const {item, index} = this.props
        return (
            <List.Item 
                onMouseEnter={this.enter}
                onMouseLeave={this.leave}
                onClick={() => this.props.showMock(item._id)}
                style={this.state.cardStyle}
                key={index} 
                actions={[<IconText type="credit-card" text={item.product} />, <IconText type="flag" text={item.brand} />]}>
                <List.Item.Meta
                title={<b>{item.name}</b>}
                description={item.description}
                />
                <b>Author:</b> {item.author}
            </List.Item>
        )
    }

}
export default MockCard
