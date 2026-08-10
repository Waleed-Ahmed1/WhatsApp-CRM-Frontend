import api from './api';

export const addcategory = (category) => {
    api.post('categories/add-category')
}

export const deletecategory = () => {
    api.delete('categories/delete-category')
}

export const getcategories = () => {
    api.get('category/get-categories')
}