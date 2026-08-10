import { useState } from "react";
import "../css/products.css";
import { addproduct,deleteproduct } from "../api/products";
import { getcategories } from "../api/categories";
import toast from "react-hot-toast";

function Products() {
    const [showAddDialog, setShowAddDialog] = useState(false);

    const [name, setname] = useState("")
    const[description, setdescription] = useState("")
    const [price, setprice] = useState("")
    const [category, setcategory] = useState("")
    const [saving, setsaving] = useState(false)

    const [getcategory, setgetcategory] = useState([])


    const addProduct = async() => {
        
        if (!name.trim() || !description.trim() || !price.trim() || !category) {
            toast.error("Please fill all fields");
            return;
        }       
        setsaving(true)
        try{
            const res = await addproduct(name,description,price,category)   
            toast.success(res.data.message || "Product Added Successfully")  
             
        }catch(err){
            toast.error(err.response?.data?.message || "Product added Failed !")
        }
    }

    const getCategories = async() => {
        try{
            const res = await getcategories()
            setgetcategory(res.data.categories || [])
        }catch(err){
            setgetcategory(["Categories not Loaded Sucessfully"])
        }finally{
            setsaving(false)
        }
    }

    return (
        <div className="products-page">

            <div className="products-top-bar">
                <div className="products-title-row">
                    <h2 className="products-title">Products</h2>
                </div>

                <button className="add-product-btn" onClick={() => {setShowAddDialog(true); getCategories()}}>
                    + Add Product
                </button>
            </div>

            {showAddDialog && (
                <div className="overlay" onClick={() => setShowAddDialog(false)}>
                    <div className="add-product-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3 className="dialog-title">Add Product</h3>

                        <div className="dialog-field">
                            <label className="dialog-label">Product Name</label>
                            <input type="text" placeholder="Product Name" className="dialog-input" onChange={(e) => setname(e.target.value)} />
                        </div>

                        <div className="dialog-field">
                            <label className="dialog-label">Description</label>
                            <textarea placeholder="Product Description ..." className="dialog-textarea" onChange={(e) => setdescription(e.target.value)}/>
                        </div>

                        <div className="dialog-field">
                            <label className="dialog-label">Price</label>
                            <input type="text" placeholder="Price" className="dialog-input" onChange={(e) => setprice(e.target.value)} />
                        </div>

                        <div className="dialog-field">
                            <label className="dialog-label">Category</label>
                            <select className="dialog-select" value={category} onChange={(e) => setcategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {getcategory.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="dialog-actions">
                            <button className="dialog-cancel-btn" onClick={() => setShowAddDialog(false)}>Cancel</button>
                            <button className="dialog-save-btn" onClick={() => addProduct()}>{saving ? "Saving..." : "Save Product"}</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Products;