import api from "./api";

export const setdelay = (value) =>{
    return api.post(`settings/delay/${value}`)
}

export const getdelay = () =>{
    return api.get('settings/get-delay')
}

export const savetoken = (token) =>{
    return api.post('settings/set-meta-wa-token', {token})
}

export const gettoken = () =>{
    return api.get('settings/get-meta-wa-token')
}