import api from './api';

export const getallgroups = () => {
    return api.get('/groups/get-all-groups');
};

export const getgroupbyid = (id) => {
    return api.get(`/groups/get-group-by-Id/${id}`);
};

export const getgroupmembers = (id) => {
    return api.get(`/groups/get-group-members/${id}`);
};

export const creategroup = (name) => {
    return api.post('/groups/create-group', { name });
};

export const deletegroup = (id) => {
    return api.delete(`/groups/delete-group/${id}`);
};

// NOTE: backend route has no :groupId in the path — it identifies the group
// by `groupName` in the body instead, not by id
export const addcontacttogroup = (contactId, groupName) => {
    return api.patch('/groups/add-contact-to-group', { contactId, groupName });
};

export const removecontactfromgroup = (contactId, groupName) => {
    return api.patch('/groups/remove-contact-from-group', { contactId, groupName });
};

export const setdescription = (id, description) => {
    return api.patch(`/groups/set-description/${id}`, { description });
};

export const deletedescription = (id) => {
    return api.patch(`/groups/delete-description/${id}`);
};

export const setgroupprompt = (id, prompt) => {
    return api.patch(`/groups/set-group-prompt/${id}`, { prompt });
};

export const deletegroupprompt = (id) => {
    return api.patch(`/groups/delete-group-prompt/${id}`);
};

export const updategroupname = (id, name) => {
    return api.patch(`/groups/update-group-name/${id}`, { name });
};

export const tooglegroupmodebyid = (id, value) => {
    return api.patch(`/groups/toggle-group-ai-mode-by-id/${id}`, { value })
}


export const getGroupDelay = (id) => {
    return api.get(`groups/get-group-delay/${id}`)
}

export const setGroupDelay = (id,value) => {
    return api.patch(`/groups/set-group-delay/${id}`,{value})
}