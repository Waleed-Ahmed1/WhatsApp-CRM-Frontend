import api from './api';

export const addcategory = (category) => {
    return api.post('/categories/add-category',{category})
}

export const deletecategory = (category) => {
    return api.delete('/categories/delete-category',{ data: { category } })
}

export const getcategories = () => {
    return api.get('/categories/get-all-categories')
}