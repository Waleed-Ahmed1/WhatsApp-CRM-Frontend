import api from "./api";

export const setdelay = (value) =>{
    return api.patch(`settings/delay/${value}`)
}

export const getdelay = () =>{
    return api.get('settings/get-delay')
}

export const savetoken = (token) =>{
    return api.patch('settings/set-meta-wa-token', {token})
}

export const gettoken = () =>{
    return api.get('settings/get-meta-wa-token')
}

export const setsystemprompt = (systemPrompt) => {
    return api.patch('settings/set-system-prompt', { systemPrompt });
}

export const getsystemprompt = () => {
    return api.get('/settings/get-system-prompt');
};

export const getaimode = () => {
    return api.get('/settings/get-global-ai-mode');
};

export const setaimode = (value) => {
    return api.patch('/settings/toggle-global-ai-mode', { value });
};

export const setgroqapikey = (key) => {
    return api.patch('/settings/set-groq-api-key', { key });
};

export const getgroqapikey = () => {
    return api.get('/settings/get-groq-api-key');
};

export const setOpenAiKey = (key) => {
    return api.patch('/settings/set-groq-open-ai-key', { key });
};

export const getOpenAiKey = () => {
    return api.get('/settings/get-groq-open-ai-key');
};
