import axios from 'axios';
import Constants from '../config/Constants'

class EndpointService {
    getAll(){
        return axios.get(`${Constants.API_URL}/endpoints`)
    }

    getAllByMock(mockId){
        return axios.get(`${Constants.API_URL}/mocks/${mockId}/endpoints`)
    }

    get(mockId, endpointId){
        return axios.get(`${Constants.API_URL}/mocks/${mockId}/endpoints/${endpointId}`)
    }
    
    create(mockId, data){
        return axios.post(`${Constants.API_URL}/mocks/${mockId}/endpoints`, data)
    }

    update(mockId, endpointId, data){
        return axios.put(`${Constants.API_URL}/mocks/${mockId}/endpoints/${endpointId}`, data)
    }

    remove(mockId, endpointId){
        return axios.delete(`${Constants.API_URL}/mocks/${mockId}/endpoints/${endpointId}`)
    }
}

export default new EndpointService()




