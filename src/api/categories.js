import api from './api';

export const addcategory = (category) => {
    return api.post('categories/add-category')
}

export const deletecategory = (category) => {
    return api.delete('categories/delete-category')
}

export const getcategories = () => {
    return api.get('category/get-categories')
}