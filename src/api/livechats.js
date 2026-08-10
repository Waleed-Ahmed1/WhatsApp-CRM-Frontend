import api from "./api";

// later this will moved to the contacts endpoints
export const getcontacts = () =>{
    return api.get('/contacts/get-contacts')
}

export const messgaes = () =>{
    return api.get('/messages/id')
}
