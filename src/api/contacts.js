import api from "./api";

export const getcontacts = () => {
    return api.post("/contacts/get-all-contacts")
}
