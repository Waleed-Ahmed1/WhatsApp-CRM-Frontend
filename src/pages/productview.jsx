import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/productview.css";
import { getproduct, addkeyword, uploadmedia, getmedia, getkeyword, deleteproduct } from "../api/products";
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
            setKeywords(res.data.keywords || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load keywords");
        }
    };

    // toggles the keyword-input panel open/closed on every click,
    // same pattern as the Media "+ Add Media" button
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

            // if the server sends back the full updated list, use it directly.
            // otherwise, add the new keyword to our current local list ourselves.
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

    const getMedia = async (id) => {
        try {
            const res = await getmedia(id);
            setMedia(res.data.media || []);
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
            const res = await uploadmedia(productId, selectedFile);

            // same logic as keywords: prefer the server's full updated list,
            // fall back to appending the single new item ourselves
            if (Array.isArray(res.data.media)) {
                setMedia(res.data.media);
            } else if (res.data.newMedia) {
                setMedia((prev) => [...prev, res.data.newMedia]);
            }

            setSelectedFile(null);
            setShowMediaUpload(false);
            toast.success(res.data.message || "Media uploaded successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload media");
        } finally {
            setUploading(false);
        }
    };

    // toggles the media-upload panel open/closed on every click
    const toggleMediaUpload = () => {
        setShowMediaUpload((prev) => !prev);
        setSelectedFile(null);
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


    const getMediaUrl = (m) => m.url || m.file_url || m.media_url || m.path || "";
    const getMediaType = (m) => m.type || m.mime_type || m.content_type || "";

    if (loading) return <div className="su-loading"><div className="spinner"></div></div>;

    if (!product) return <div className="pv-page"><p style={{ color: "#9aa0ac" }}>Product not found.</p></div>;

    return (
        <div className="pv-page">

            <div className="pv-header">
                <button className="pv-back-btn" onClick={() => navigate("/dashboard/products")}>← Back</button>
                <div className="pv-header-actions"><button className="pv-edit-btn" onClick={() => handleDelete(product.id)}>Delete Product</button></div>
            </div>

            <div className="pv-card pv-info-row">

                <div className="pv-info-list">
                    <h3 className="pv-section-title">Product Information</h3>
                    <div className="pv-info-item"><span className="pv-info-label">Name</span><span className="pv-info-value">{product.name}</span></div>
                    <div className="pv-info-item"><span className="pv-info-label">Price</span><span className="pv-info-value">{product.price}</span></div>
                    <div className="pv-info-item"><span className="pv-info-label">Description</span><span className="pv-info-value">{product.description}</span></div>
                    <div className="pv-info-item"><span className="pv-info-label">Category</span><span className="pv-info-value">{product.category}</span></div>
                </div>
            </div>

            <div className="pv-card">
                <div className="pv-card-header">
                    <h3 className="pv-section-title">Keywords</h3>
                    <button className="pv-add-btn" onClick={toggleKeywordInput}>
                        {showKeywordInput ? "Close" : "+ Add"}
                    </button>
                </div>

                {showKeywordInput && (
                    <div className="keyword-input-area">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Enter keyword"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && addKeyword(product.id)}
                        />
                        <button className="pv-add-btn" onClick={() => addKeyword(product.id)}>Add</button>
                        <button className="pv-cancel-btn" onClick={toggleKeywordInput}>Cancel</button>
                    </div>
                )}

                <div className="pv-keywords-row">
                    {keywords.map((kw, index) => <span className="pv-keyword-pill" key={index}>{typeof kw === "string" ? kw : kw.keyword}</span>)}
                </div>
            </div>

            <div className="pv-card">
                <div className="pv-card-header">
                    <h3 className="pv-section-title">Media</h3>
                    <button className="pv-add-btn" onClick={toggleMediaUpload}>
                        {showMediaUpload ? "Close" : "+ Add Media"}
                    </button>
                </div>

                {showMediaUpload &&
                    <div className="media-upload-area">
                        <div className="media-upload-icon">＋</div>
                        <h4>Add Product Media</h4>
                        <p>Upload an image, video or voice note</p>

                        <label className="media-select-btn">
                            Choose File
                            <input type="file" accept="image/*,video/*,audio/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        </label>

                        {selectedFile &&
                            <div className="selected-file">
                                <span>{selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)}>✕</button>
                            </div>}

                        <div className="media-upload-actions">
                            <button className="pv-cancel-btn" onClick={toggleMediaUpload}>Cancel</button>
                            <button className="pv-add-btn" onClick={() => uploadMedia(product.id)} disabled={!selectedFile || uploading}>{uploading ? "Uploading..." : "Upload Media"}</button>
                        </div>
                    </div>}

                <div className="pv-media-row">
                    {media.length === 0 ? <div className="no-media">No media uploaded yet.</div> :
                        media.map((m, index) => {
                            const url = getMediaUrl(m);
                            const type = getMediaType(m);
                            return <div className="pv-media-box" key={m.id || index}>
                                {type.startsWith("image") ? <img src={url} alt="Product media" /> : type.startsWith("video") ? <video src={url} controls /> : type.startsWith("audio") ? <audio src={url} controls /> : <a href={url} target="_blank" rel="noreferrer">Open Media</a>}
                            </div>
                        })}
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