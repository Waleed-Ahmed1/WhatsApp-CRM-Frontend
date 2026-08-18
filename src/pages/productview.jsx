import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Trash2,
    Tag,
    Image as ImageIcon,
    Plus,
    X,
    Upload,
    FileText,
    ExternalLink,
} from "lucide-react";
import { getproduct, addkeyword, uploadmedia, getmedia, getkeyword, deleteproduct, deletekeyword, deletemedia } from "../api/products";
import toast from "react-hot-toast";
import ConfirmDialog from "../component/ConfirmDailog";

function ProductView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState("");
    const [showKeywordInput, setShowKeywordInput] = useState(false);

    const [media, setMedia] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showMediaUpload, setShowMediaUpload] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await getproduct(id);
                setProduct(res.data.product);
                await getKeyword(id);
                await getMedia(id);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const getKeyword = async (id) => {
        try {
            const res = await getkeyword(id);
            setKeywords(res.data.productKeywords || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load keywords");
        }
    };

    const toggleKeywordInput = () => {
        setShowKeywordInput((prev) => !prev);
        setNewKeyword("");
    };

    const addKeyword = async (productId) => {
        if (!newKeyword.trim()) {
            toast.error("Please enter a keyword");
            return;
        }
        try {
            const res = await addkeyword(productId, newKeyword.trim());

            if (Array.isArray(res.data.keywords)) {
                setKeywords(res.data.keywords);
            } else {
                setKeywords((prev) => [...prev, newKeyword.trim()]);
            }

            setNewKeyword("");
            setShowKeywordInput(false);
            toast.success(res.data.message || "Keyword added successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Keyword added failed!");
        }
    };

    // deleting the product keywords
    const keywordDelete = async (id, keywordIndex) => {
        try {
            // Get the keyword object and its ID
            const keywordToDelete = keywords[keywordIndex];
            const keywordId = keywordToDelete?.id || keywordToDelete?.keywordId;
            
            if (!keywordId) {
                toast.error("Invalid keyword ID");
                return;
            }
            
            const res = await deletekeyword(id, keywordId);
            toast.success(res.data?.message || "Keyword deleted successfully!");
            await getKeyword(id);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete keyword");
        }
    };

    const getMedia = async (id) => {
        try {
            const res = await getmedia(id);
            setMedia(res.data.productMedia || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load media");
        }
    };

    const uploadMedia = async (productId) => {
        if (!selectedFile) {
            toast.error("Please select a file!");
            return;
        }
        setUploading(true);
        try {
            const res = await uploadmedia(productId, selectedFile, product.category?.name);
            await getMedia(productId);
            setSelectedFile(null);
            setShowMediaUpload(false);
            toast.success(res.data.message || "Media uploaded successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload media");
        } finally {
            setUploading(false);
        }
    };

    const toggleMediaUpload = () => {
        setShowMediaUpload((prev) => !prev);
        setSelectedFile(null);
    };

    // deleting the product media
    const [mediadeleteid, setmediadeleteid] = useState('');

    const mediadelete = async (mediaIdToDelete) => {
        if (!mediaIdToDelete) {
            toast.error("No media selected to delete");
            return;
        }
        try {
            const res = await deletemedia(id, mediaIdToDelete);
            toast.success(res.data?.message || "Media deleted successfully!");
            await getMedia(id);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete media");
        }
    };

    // deleting the product
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const handleDelete = (productId) => {
        setPendingDeleteId(productId);
    };

    const confirmDelete = async () => {
        const productId = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            const res = await deleteproduct(productId);
            toast.success(res.data.message || "Product Deleted Successfully");
            navigate("/dashboard/products");
        } catch (err) {
            toast.error(err.response?.data?.message || "Product Deleted Failed!");
        }
    };

    const cancelDelete = () => {
        setPendingDeleteId(null);
    };

    const getMediaUrl = (m) => {
        const path = m.filePath || m.url || m.file_url || m.media_url || m.path || "";
        if (!path) return "";

        const backendOrigin = import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, "");
        return path.startsWith("http") ? path : `${backendOrigin}/${path.replace(/^\/+/, "")}`;
    };
    const getMediaType = (m) => (m.type || m.mime_type || m.content_type || "").toLowerCase();

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#EAF7F4]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA894]/20 border-t-[#0EA894]" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#EAF7F4]">
                <p className="text-sm text-[#9CA3AF]">Product not found.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-y-auto bg-[#EAF7F4] px-4 py-6 sm:px-8">
            <div className="mx-auto w-full max-w-4xl space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate("/dashboard/products")}
                        className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-[#374151] shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition hover:bg-[#F3F4F6]"
                    >
                        <ArrowLeft size={14} />
                        Back
                    </button>
                    <button
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                        <Trash2 size={14} />
                        Delete Product
                    </button>
                </div>

                {/* Product info */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-[#1F2937]">{product.name}</h2>
                            {product.category?.name && (
                                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#0EA894]/10 px-2.5 py-1 text-[11px] font-medium text-[#0B6F60]">
                                    <Tag size={10} />
                                    {product.category.name}
                                </span>
                            )}
                        </div>
                        <span className="text-xl font-semibold text-[#0B6F60]">{product.price} PKR</span>
                    </div>

                    <div className="border-t border-[#F3F4F6] pt-4">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">Description</p>
                        <p className="text-sm leading-relaxed text-[#374151]">{product.description}</p>
                    </div>
                </div>

                {/* Keywords */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#1F2937]">Keywords</h3>
                        <button
                            onClick={toggleKeywordInput}
                            className="text-xs font-medium text-[#0B6F60] hover:text-[#0EA894]"
                        >
                            {showKeywordInput ? "Close" : "+ Add"}
                        </button>
                    </div>

                    {showKeywordInput && (
                        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                            <input
                                type="text"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                placeholder="Enter keyword"
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && addKeyword(product.id)}
                                className="h-9 flex-1 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#1F2937] outline-none focus:border-[#0EA894]"
                            />
                            <button
                                onClick={() => addKeyword(product.id)}
                                className="rounded-lg bg-[#0B6F60] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B8A79]"
                            >
                                Add
                            </button>
                            <button
                                onClick={toggleKeywordInput}
                                className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6]"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {keywords.length === 0 ? (
                            <p className="text-sm text-[#9CA3AF]">No keywords added yet.</p>
                        ) : (
                            keywords.map((kw, index) => {
                                const keywordText = typeof kw === "string" ? kw : kw.keyword;
                                return (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0EA894]/10 px-3 py-1.5 text-xs font-medium text-[#0B6F60]"
                                    >
                                        {keywordText}
                                        <button
                                            onClick={() => keywordDelete(product.id, index)}
                                            className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[#0B6F60] hover:bg-[#0EA894]/20 hover:text-red-500 transition-colors"
                                            title="Remove keyword"
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Media */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#1F2937]">Media</h3>
                        <button
                            onClick={toggleMediaUpload}
                            className="text-xs font-medium text-[#0B6F60] hover:text-[#0EA894]"
                        >
                            {showMediaUpload ? "Close" : "+ Add Media"}
                        </button>
                    </div>

                    {showMediaUpload && (
                        <div className="mb-4 rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-5">
                            {!selectedFile ? (
                                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 py-6 text-center">
                                    <Upload size={24} className="text-[#0EA894]" />
                                    <h4 className="text-sm font-semibold text-[#1F2937]">Add Product Media</h4>
                                    <p className="text-xs text-[#9CA3AF]">Upload an image, video or voice note</p>
                                    <span className="mt-1 rounded-full bg-[#0B6F60] px-4 py-1.5 text-xs font-medium text-white">
                                        Choose File
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*,audio/*"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white p-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <FileText size={16} className="flex-none text-[#0B6F60]" />
                                        <span className="truncate text-sm text-[#374151]">{selectedFile.name}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-[#9CA3AF] transition hover:bg-red-50 hover:text-red-500"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={toggleMediaUpload}
                                    className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => uploadMedia(product.id)}
                                    disabled={!selectedFile || uploading}
                                    className="rounded-lg bg-[#0B6F60] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {uploading ? "Uploading..." : "Upload Media"}
                                </button>
                            </div>
                        </div>
                    )}

                    {media.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                            <ImageIcon size={28} className="text-[#0EA894]/40" />
                            <p className="text-sm text-[#9CA3AF]">No media uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {media.map((m, index) => {
                                const url = getMediaUrl(m);
                                const type = getMediaType(m);
                                const mediaId = m.id || m._id || m.mediaId || m.media_id;
                                
                                return (
                                    <div
                                        key={mediaId || index}
                                        className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]"
                                    >
                                        {type.startsWith("image") ? (
                                            <img src={url} alt="Product media" className="h-full w-full object-cover" />
                                        ) : type.startsWith("video") ? (
                                            <video src={url} controls className="h-full w-full object-cover" />
                                        ) : type.startsWith("audio") ? (
                                            <audio src={url} controls className="w-full px-2" />
                                        ) : (
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex flex-col items-center gap-1.5 text-xs font-medium text-[#0B6F60] hover:text-[#0EA894]"
                                            >
                                                <ExternalLink size={16} />
                                                Open Media
                                            </a>
                                        )}
                                        
                                        {mediaId && (
                                           <button
                                                onClick={() => mediadelete(mediaId)}
                                                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                                                title="Delete media"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={pendingDeleteId !== null}
                message="Are you sure you want to delete this product?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}

export default ProductView;