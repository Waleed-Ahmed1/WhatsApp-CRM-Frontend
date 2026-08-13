import api from "./api";

export const getcontacts = () => {
    return api.get("/contacts/get-all-contacts")
}
