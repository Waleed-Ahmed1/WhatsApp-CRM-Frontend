import api from './api';

export const addproduct = (name,description,price,category) =>{
    return api.post('/products/add-product')
}

export const deleteproduct = (id) => {
    return api.delete(`products/delete-product/${id}`)
}
