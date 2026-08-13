import api from "./api";

export const sendSystemLevelTextBroadcast = (text)=>{
    return api.post(`broadcasts/send-system-level-text-broadcast`,{text})
}

export const sendSystemLevelMediaBroadcast = (media) =>{
    return api.post(`broadcasts/send-system-level-media-broadcast`,{media})
}


export const sendGroupLevelTextBroadcast = (text)=>{
    return api.post(`broadcasts/send-group-level-text-broadcast`,{text})
}

export const sendGroupLevelMediaBroadcast = (media)=>{
    return api.post(`broadcasts/send-group-level-media-broadcast`,{media})
}
