import api from './api';

export const getallgroups = () => {
    return api.get('/groups/get-all-groups')
}

export const getgroupbyid = (id) => {
    return api.get(`/groups/get-group-by-Id/${id}`)
}

export const getgroupmembers = (id) => {
    return api.get(`/get-group-members/${id}`)
}
