// src/api/broadcast.js
import api from "./api";

// System Level Broadcasts
export const sendSystemLevelTextBroadcast = (text) => {
    return api.post(`broadcasts/send-system-level-text-broadcast`, { text });
};

export const sendSystemLevelMediaBroadcast = (media, caption = "") => {
    const formData = new FormData();
    formData.append("files", media);
    if (caption) {
        formData.append("caption", caption);
    }
    return api.post(`broadcasts/send-system-level-media-broadcast`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

// Group Level Broadcasts
export const sendGroupLevelTextBroadcast = (text, groupIds) => {
    return api.post(`broadcasts/send-group-level-text-broadcast`, { 
        text, 
        groupIds 
    });
};

export const sendGroupLevelMediaBroadcast = (media, groupIds, caption = "") => {
    const formData = new FormData();
    formData.append("files", media);
    if (caption) {
        formData.append("caption", caption);
    }
    formData.append("groupIds", JSON.stringify(groupIds));
    return api.post(`broadcasts/send-group-level-media-broadcast`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};