import api from './api';

export const addproduct = (name, description, price, category) => {
    return api.post('/products/add-product', { name, description, price, category });
};

export const deleteproduct = (id) => {
    return api.delete(`/products/delete-product/${id}`);
};

export const getallproduct = () => {
    return api.get('/products/get-all-products');
};

export const getproduct = (id) => {
    return api.get(`/products/product/${id}`);
};

export const addkeyword = (id, keywords) => {
    // Must send as array
    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    return api.post(`/products/add-keywords/${id}`, { keywords: keywordArray });
};

export const getkeyword = (id) => {
    return api.get(`/products/get-product-keywords/${id}`);
};

export const uploadmedia = (id, file, category) => {
    const formData = new FormData();
    formData.append("category", category || '');
    formData.append("media", file);
    return api.post(`/products/${id}/media`, formData);
};

export const getmedia = (id) => {
    return api.get(`/products/get-product-media/${id}`);
};

export const deletekeyword = (id, keywordIds) => {
    // Must send as array
    const idsArray = Array.isArray(keywordIds) ? keywordIds : [keywordIds];
    return api.delete(`/products/delete-product-keywords/${id}`, { 
        data: { keywordIds: idsArray } 
    });
};

export const deletemedia = (id, productMediaIds) => {
    // Must send as array
    const idsArray = Array.isArray(productMediaIds) ? productMediaIds : [productMediaIds];
    return api.delete(`/products/delete-product-media/${id}`, { 
        data: { productMediaIds: idsArray } 
    });
};

export const updateDescription = (id,value) =>{
    return api.patch(`/products/update-product-description/${id}`,{productDescription: value?.trim()})
}