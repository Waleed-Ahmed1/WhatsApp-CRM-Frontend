import api from './api';

export const addproduct = (name,description,price,category) =>{
    return api.post('/products/add-product',{name,description,price,category})
}

export const deleteproduct = (id) => {
    return api.delete(`/products/delete-product/${id}`)
}

export const getallproduct = () => {
    return api.get('/products/get-all-products')
}

export const getproduct = (id) => {
    return api.get(`/products/product/${id}`)
}

export const addkeyword = (id,keywords) =>{
    return api.post(`/products/add-keywords/${id}`,{keywords})
}

export const getkeyword = (id) =>{
    return api.get(`/products/get-product-keywords/${id}`)
}

export const uploadmedia = (id, file, category) => {
    const formData = new FormData();
    formData.append("category", category);  
    formData.append("media", file);
    return api.post(`/products/${id}/media`, formData);
};

export const getmedia = (id) => {
    return api.get(`/products/get-product-media/${id}`)
}
