import React from 'react'
import {Card, Tag} from 'antd'

class EndpointCard extends React.Component{

    getColorByMethod = (method) => {
        switch(method){
            case "POST":
                return "blue"
            case "DELETE":
                return "red"
            case "GET":
            default: 
                return "green"
        }
    }

    render(){
        const {index, endpoint, selectedId} = this.props

        let cardClasses = "endpointCard"
        if(selectedId === this.props.endpoint._id){
            cardClasses += " selected"
        }
        return(
            <Card
                key={index}
                title={endpoint.name}
                className={cardClasses}
                onClick={() => this.props.selectEndpoint(endpoint)}
            >
                <div>
                    <Tag 
                        key={index} 
                        closable={false}
                        color={this.getColorByMethod(endpoint.httpRequest.method)}>
                        {endpoint.httpRequest.method}
                    </Tag>
                    {endpoint.httpRequest.path}
                </div>
                <p>{endpoint.httpResponse.statusCode}</p>
                <pre style={{backgroundColor: "#fafafa", border: "1px solid black"}}>
                    {JSON.stringify(endpoint.httpResponse.body, null, 2)}
                </pre>
            </Card>
        )
    }
}

export default EndpointCard