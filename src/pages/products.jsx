import { useState, useEffect } from "react";
import { Search, Plus, Package, Trash2, X, Tag } from "lucide-react";
import { addproduct, deleteproduct, getallproduct, addkeyword } from "../api/products";
import { getcategories } from "../api/categories";
import ConfirmDialog from "../component/ConfirmDailog";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TAG_COLORS = [
    "bg-[#0EA894]/10 text-[#0B6F60]",
    "bg-[#F59E0B]/10 text-[#B45309]",
    "bg-[#8B5CF6]/10 text-[#6D28D9]",
    "bg-[#EC4899]/10 text-[#BE185D]",
    "bg-[#3B82F6]/10 text-[#1D4ED8]",
    "bg-[#10B981]/10 text-[#047857]",
    "bg-[#F97316]/10 text-[#C2410C]",
];

function categoryColor(name) {
    if (!name) return TAG_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

function Products() {
    const navigate = useNavigate();

    const [showAddDialog, setShowAddDialog] = useState(false);

    const [name, setname] = useState("");
    const [description, setdescription] = useState("");
    const [price, setprice] = useState("");
    const [category, setcategory] = useState("");
    const [saving, setsaving] = useState(false);

    const [getcategory, setgetcategory] = useState([]);

    // for searching
    const [searchTerm, setSearchTerm] = useState("");

    const addProduct = async () => {
        if (!name.trim() || !description.trim() || !price.trim() || !category) {
            toast.error("Please fill all fields");
            return;
        }
        setsaving(true);
        try {
            const res = await addproduct(name, description, price, category);
            toast.success(res.data.message || "Product Added Successfully");
            setShowAddDialog(false);
            setname("");
            setdescription("");
            setprice("");
            setcategory("");
            getallProduct();
        } catch (err) {
            toast.error(err.response?.data?.message || "Product added Failed !");
        } finally {
            setsaving(false);
        }
    };

    const getCategories = async () => {
        try {
            const res = await getcategories();
            setgetcategory(res.data.categories || []);
        } catch (err) {
            setgetcategory([]);
            toast.error("Failed to load categories");
        }
    };

    const [products, setproducts] = useState([]);
    const [productloading, setproductloading] = useState(true);

    const getallProduct = async () => {
        try {
            const res = await getallproduct();
            setproducts(res.data.products || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Product Loaded Failed !");
        } finally {
            setproductloading(false);
        }
    };
    useEffect(() => {
        getallProduct();
    }, []);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const handleDelete = (id) => {
        setPendingDeleteId(id);
    };

    const confirmDelete = async () => {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            const res = await deleteproduct(id);
            setproducts((prev) => prev.filter((p) => p.id !== id));
            toast.success(res.data.message || "Product Deleted Successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Product Deleted Failed !");
        }
    };

    const cancelDelete = () => {
        setPendingDeleteId(null);
    };

    const addKeyword = async (id, keywords) => {
        try {
            const res = await addkeyword(id, keywords);
            toast.success(res.data.message || "Keyword added successfully !");
        } catch (err) {
            toast.error(err.response?.data?.message || "Keyword added Failed !");
        }
    };

    if (productloading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#EAF7F4]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA894]/20 border-t-[#0EA894]" />
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-y-auto bg-[#EAF7F4] px-4 py-6 sm:px-8">

            {/* Header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-semibold text-[#1F2937]">
                        <Package size={20} className="text-[#0EA894]" />
                        Products
                    </h1>
                    <p className="text-sm text-[#6B7280]">
                        {products.length} product{products.length !== 1 ? "s" : ""} in your catalog
                    </p>
                </div>

                <button
                    onClick={() => { setShowAddDialog(true); getCategories(); }}
                    className="flex items-center gap-1.5 rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79]"
                >
                    <Plus size={15} />
                    Add Product
                </button>
            </div>

            {/* Search */}
            <div className="mb-5 flex h-11 max-w-md items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
                <Search size={15} className="text-[#9CA3AF]" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF]"
                />
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <Package size={32} className="text-[#0EA894]/40" />
                    <h3 className="text-sm font-semibold text-[#1F2937]">No Products Found</h3>
                    <p className="max-w-xs text-sm text-[#6B7280]">
                        {searchTerm ? "No products match your search." : "You haven't added any products yet."}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => { setShowAddDialog(true); getCategories(); }}
                            className="mt-1 flex items-center gap-1.5 rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79]"
                        >
                            <Plus size={15} />
                            Add Product
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            className="group relative flex flex-col rounded-2xl bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
                        >
                            <button
                                onClick={() => handleDelete(p.id)}
                                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-[#9CA3AF] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                            >
                                <Trash2 size={13} />
                            </button>

                            {p.category?.name && (
                                <span className={`mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${categoryColor(p.category.name)}`}>
                                    <Tag size={10} />
                                    {p.category.name}
                                </span>
                            )}

                            <h3 className="truncate pr-6 text-sm font-semibold text-[#1F2937]">
                                {p.name}
                            </h3>

                            <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-[#6B7280]">
                                {p.description}
                            </p>

                            <div className="mt-3 flex items-center justify-between border-t border-[#F3F4F6] pt-3">
                                <span className="text-base font-semibold text-[#0B6F60]">
                                    {p.price} PKR
                                </span>
                                <button
                                    onClick={() => navigate(`/dashboard/products/${p.id}`)}
                                    className="text-xs font-medium text-[#6B7280] transition hover:text-[#0EA894]"
                                >
                                    View Product
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Product Dialog */}
            {showAddDialog && (
                <div
                    onClick={() => setShowAddDialog(false)}
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-[#1F2937]">Add Product</h3>
                            <button
                                onClick={() => setShowAddDialog(false)}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-[#9CA3AF] transition hover:bg-[#F3F4F6]"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#374151]">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#1F2937] outline-none focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#374151]">Description</label>
                                <textarea
                                    placeholder="Product Description ..."
                                    value={description}
                                    onChange={(e) => setdescription(e.target.value)}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-sm text-[#1F2937] outline-none focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#374151]">Price</label>
                                <input
                                    type="text"
                                    placeholder="Price"
                                    value={price}
                                    onChange={(e) => setprice(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#1F2937] outline-none focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-[#374151]">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setcategory(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1F2937] outline-none focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                                >
                                    <option value="">Select Category</option>
                                    {getcategory.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setShowAddDialog(false)}
                                className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addProduct}
                                disabled={saving}
                                className="rounded-xl bg-[#0B6F60] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B8A79] disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save Product"}
                            </button>
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