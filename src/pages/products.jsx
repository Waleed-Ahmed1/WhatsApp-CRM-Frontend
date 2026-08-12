import { useState, useEffect } from "react";
import "../css/products.css";
import { addproduct, deleteproduct, getallproduct, addkeyword } from "../api/products";
import { getcategories } from "../api/categories";
import ConfirmDialog from "../component/ConfirmDailog";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Products() {
    const navigate = useNavigate();

    const [showAddDialog, setShowAddDialog] = useState(false);

    const [name, setname] = useState("")
    const [description, setdescription] = useState("")
    const [price, setprice] = useState("")
    const [category, setcategory] = useState("")
    const [saving, setsaving] = useState(false)

    const [getcategory, setgetcategory] = useState([])

    const [openMenuId, setOpenMenuId] = useState(null);
    // for searching
    const [searchTerm, setSearchTerm] = useState("")


    const addProduct = async () => {
        if (!name.trim() || !description.trim() || !price.trim() || !category) {
            toast.error("Please fill all fields");
            return;
        }
        setsaving(true)
        try {
            const res = await addproduct(name, description, price, category)
            toast.success(res.data.message || "Product Added Successfully")
            setShowAddDialog(false)
            getallProduct()
        } catch (err) {
            toast.error(err.response?.data?.message || "Product added Failed !")
        } finally {
            setsaving(false)
        }
    }

    const getCategories = async () => {
        try {
            const res = await getcategories()
            setgetcategory(res.data.categories || [])
        } catch (err) {
            setgetcategory([])
            toast.error("Failed to load categories")
        }
    }

    const [products, setproducts] = useState([])
    const [productloading, setproductloading] = useState(true)

    const getallProduct = async () => {
        try {
            const res = await getallproduct()
            setproducts(res.data.products || [])
        } catch (err) {
            toast.error(err.response?.data?.message || "Product Loaded Failed !")
        } finally {
            setproductloading(false)
        }
    }
    useEffect(() => {
        getallProduct();
    }, []);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const [pendingDeleteId, setPendingDeleteId] = useState(null)

    const handleDelete = (id) => {
        setPendingDeleteId(id);
        setOpenMenuId(null);
    };

    const confirmDelete = async () => {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            const res = await deleteproduct(id)
            setproducts((prev) => prev.filter((p) => p.id !== id))
            toast.success(res.data.message || "Product Deleted Successfully")
        } catch (err) {
            toast.error(err.response?.data?.message || "Product Deleted Failed !")
        }
    };

    const cancelDelete = () => { setPendingDeleteId(null); };



    const addKeyword = async (id, keywords) => {
        try {
            const res = await addkeyword(id, keywords)
            toast.success(res.data.message || "Keyword added successfully !")
        } catch (err) {
            toast.error(err.response?.data?.message || "Keyword added Failed !")
        }
    }


    if (productloading) {
        return <div className="su-loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="products-page">

            <div className="products-top-bar">
                <div className="products-title-row">
                    <h2 className="products-title">Products</h2>
                </div>

                <button className="add-product-btn" onClick={() => { setShowAddDialog(true); getCategories() }}>
                    + Add Product
                </button>
            </div>

            <div className="products-search-wrap">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="products-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="products-search-icon">🔍</span>
            </div>

            <div className="products-card">
                {filteredProducts.length === 0 ? (
                    <div className="products-empty">
                        <div className="products-empty-icon">📦</div>
                        <h3>No Products Found</h3>
                        <p>{searchTerm ? "No products match your search." : "You haven't added any products yet."}</p>
                        {!searchTerm && <button className="add-product-btn" onClick={() => { setShowAddDialog(true); getCategories() }}>+ Add Product</button>}
                    </div>
                ) : (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id}>
                                    <td className="product-name-cell">{p.name}</td>
                                    <td className="product-desc-cell">{p.description}</td>
                                    <td>{p.price}</td>
                                    <td>{p.category?.name}</td>

                                    <td className="product-actions-cell">
                                        <button className="more-btn" onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}>⋮</button>

                                        {openMenuId === p.id && (
                                            <div className="actions-menu">
                                                <button onClick={() => navigate(`/dashboard/products/${p.id}`)}>View Product</button>
                                                <button className="actions-menu-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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
                            <textarea placeholder="Product Description ..." className="dialog-textarea" onChange={(e) => setdescription(e.target.value)} />
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
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
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

            <ConfirmDialog
                open={pendingDeleteId !== null}
                message="Are you sure you want to delete this product?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

        </div>
    );
}

export default Products;