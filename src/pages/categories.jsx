import React, { useState, useEffect } from "react";
import { Tag, Plus, X } from "lucide-react";
import { getcategories, deletecategory, addcategory } from "../api/categories";
import ConfirmDialog from "../component/ConfirmDailog";
import InputDialog from "../component/InputDailog";
import toast from "react-hot-toast";

const DOT_COLORS = [
    "bg-[#0EA894]", "bg-[#0B6F60]", "bg-[#F59E0B]", "bg-[#8B5CF6]",
    "bg-[#EC4899]", "bg-[#3B82F6]", "bg-[#10B981]", "bg-[#F97316]",
];

function Categories() {
    const [showdialog, setshowdialog] = useState(false);
    const [newcategoryname, setnewcategoryname] = useState("");

    const [gcategory, setgcategory] = useState([]);
    const [loading, setloading] = useState(true);
    const [saving, setsaving] = useState(false);

    const [pendingDeleteCat, setpendingDeleteCat] = useState(null);

    useEffect(() => {
        getCategories();
    }, []);

    const addCategories = async () => {
        if (!newcategoryname.trim()) return;

        setsaving(true);
        try {
            const res = await addcategory(newcategoryname);
            toast.success(res.data.message || "Category added Successfully");
            setnewcategoryname("");
            getCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setsaving(false);
        }
    };

    const getCategories = async () => {
        setloading(true);
        try {
            const res = await getcategories();
            setgcategory(res.data.categories || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setloading(false);
        }
    };

    const requestDeleteCategory = (cat) => {
        setpendingDeleteCat(cat);
    };

    const confirmDeleteCategory = async () => {
        const cat = pendingDeleteCat;
        setpendingDeleteCat(null);

        try {
            await deletecategory(cat);
            setgcategory((prev) => prev.filter((c) => c.name !== cat));
            toast.success('Category deleted')
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    const cancelDeleteCategory = () => {
        setpendingDeleteCat(null);
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-[#EAF7F4] px-4 py-6 sm:px-8">

            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-semibold text-[#1F2937]">
                        <Tag size={20} className="text-[#0EA894]" />
                        Categories
                    </h1>
                    <p className="text-sm text-[#6B7280]">
                        Manage product categories
                    </p>
                </div>

                <button
                    onClick={() => setshowdialog(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#0B6F60] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8A79]"
                >
                    <Plus size={15} />
                    Add Category
                </button>

                <InputDialog
                    open={showdialog}
                    value={newcategoryname}
                    onChange={setnewcategoryname}
                    onSubmit={() => { addCategories(); setshowdialog(false); }}
                    onClose={() => setshowdialog(false)}
                    saving={saving}
                />
            </div>

            <div className="mx-auto w-full max-w-5xl">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA894]/20 border-t-[#0EA894]" />
                    </div>
                ) : gcategory.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {gcategory.map((cat, i) => (
                            <div
                                key={cat.id}
                                className="group relative flex items-center gap-3 rounded-2xl border border-transparent bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
                            >
                                <span className={`h-2.5 w-2.5 flex-none rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
                                <span className="truncate text-sm font-medium text-[#1F2937]">
                                    {cat.name}
                                </span>

                                <button
                                    onClick={() => requestDeleteCategory(cat.name)}
                                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-[#9CA3AF] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                        <Tag size={32} className="text-[#0EA894]/40" />
                        <p className="text-sm text-[#6B7280]">
                            No categories yet. Add one to get started.
                        </p>
                    </div>
                )}
            </div>

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