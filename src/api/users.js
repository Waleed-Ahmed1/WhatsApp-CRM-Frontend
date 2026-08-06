import api from "./api"

export const getusers = () =>{
    return api.get('/users/get-all-users')
}

export const deleteusers = (id) =>{
    return api.delete(`/users/delete-user/${id}`)
}