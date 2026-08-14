import api from "./api";

export const getcontactwithlastmessage = () =>{
    return api.get('/contacts/get-all-contacts-with-last-message')
}

export const getcontactchathistory = (contactId) =>{
    return  api.get(`contacts/get-contact-chat-history/${contactId}`);
}
 
// later this will moved to the contacts endpoints
export const getcontacts = () =>{
    return api.get('/contacts/get-contacts')
}

export const sendmessage = (id, text) => {
    return api.post(`/messages/send-text-message/${id}`, { text });
};

export const sendattachments = (id, files, caption) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (caption) formData.append("caption", caption);
    return api.post(`/messages/send-attachment/${id}`, formData);
};

