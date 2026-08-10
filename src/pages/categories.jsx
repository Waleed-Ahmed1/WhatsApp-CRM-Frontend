import React from "react";
import "../css/categories.css"
import { getcategories,deletecategory,addcategory } from "../api/categories";
import { useState, useEffect } from "react";
import ConfirmDialog from "../component/ConfirmDailog";
import InputDialog from "../component/InputDailog";
import toast from "react-hot-toast";

function Categories() {
    const [showdialog, setshowdialog] = useState(false)
    const [newcategoryname , setnewcategoryname] = useState("")

    const [gcategory, setgcategory] = useState([])
    const [loading, setloading] = useState(true)
    const [saving, setsaving] = useState(false)

    const [pendingDeleteCat, setpendingDeleteCat] = useState(null)

    useEffect(() => {
        getCategories();
    }, []);

    const addCategories = async() => {
        if(!newcategoryname.trim()) return;

        setsaving(true)
        try{
            const res = await addcategory(newcategoryname)
            toast.success(res.data.message || "Category added Sucessfully")
            setnewcategoryname("")
            getCategories()
        }catch(err){
            toast.error(err.response?.data?.message || "Something went Wrong")
        }finally{
            setsaving(false)
        }
    }

    const getCategories = async() => {
        setloading(true)
        try{
            const res = await getcategories()
            setgcategory(res.data.categories || [])
        }catch(err){
            toast.error(err.response?.data?.message || "Something went Wrong")
        }finally{
            setloading(false)
        }
    }

    const requestDeleteCategory = (cat) => {
        setpendingDeleteCat(cat)
    }

    const confirmDeleteCategory = async() => {
        const cat = pendingDeleteCat
        setpendingDeleteCat(null)

        try{
            await deletecategory(cat)
            setgcategory((prev) => prev.filter((c) => c !== cat))
            toast.success(res.data,message || "Category deleted")
        }catch(err){
            toast.error(err.response?.data?.message || "Something went Wrong")
        }
    }

    const cancelDeleteCategory = () => {
        setpendingDeleteCat(null)
    }

    
 
    return (
        <div className="categories-page">
            <div className="categories-header">
                <div>
                    <h2 className="categories-title">Categories</h2>
                    <p className="categories-subtitle">Manage product categories</p>
                </div>
 
                <button className="add-category-btn" onClick={() => {setshowdialog(true)}}>
                    + Add Category
                </button>
                <InputDialog             
                    open={showdialog}
                    value = {newcategoryname}
                    onChange = {setnewcategoryname}
                    onSubmit = {() => { addCategories(); setshowdialog(false); }}
                    onClose={() => setshowdialog(false)}
                    saving={saving}
                />
            </div>
 
            {loading ? (
                <p style={{ color: "#9aa0ac" }}>Loading categories...</p>
            ) : gcategory.length > 0 ? (
                <div className="categories-grid">
                    {gcategory.map((cat) => (
                        <div className="category-card" key={cat}>
                            <div className="category-info">
                                <span className="category-dot" />
                                <span className="category-name">{cat}</span>
                            </div>
 
                            <button className="category-delete-btn" onClick={() => {requestDeleteCategory(cat)}}> ✕ </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="categories-empty">
                    <p className="categories-empty-text">No categories yet. Add one to get started.</p>
                </div>
            )}

            <ConfirmDialog
                open={pendingDeleteCat !== null}
                message="Are you sure you want to delete this category?"
                onConfirm={confirmDeleteCategory}
                onCancel={cancelDeleteCategory}
            />
        </div>
    );
}
 
export default Categories;