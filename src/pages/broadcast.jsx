// src/pages/broadcast.jsx
import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaBullhorn, FaUsers, FaGlobe, FaImage, FaVideo, FaMicrophone, FaFileAlt, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { toast } from "react-hot-toast";
import "../css/broadcast.css";
import { 
    sendSystemLevelTextBroadcast, 
    sendSystemLevelMediaBroadcast,
    sendGroupLevelTextBroadcast,
    sendGroupLevelMediaBroadcast
} from "../api/broadcast";
import { getallgroups } from "../api/groups";

function Broadcast() {
    const [activeTab, setActiveTab] = useState("system");
    const [messageType, setMessageType] = useState("text");
    
    // Text message state
    const [textMessage, setTextMessage] = useState("");
    
    // Media message state
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [fileType, setFileType] = useState("");
    const [caption, setCaption] = useState("");
    
    // Group selection
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    
    // Loading states
    const [sending, setSending] = useState(false);
    const [showGroupDropdown, setShowGroupDropdown] = useState(false);

    // Load groups for group-level broadcast
    useEffect(() => {
        if (activeTab === "group") {
            loadGroups();
        }
    }, [activeTab]);

    const loadGroups = async () => {
        setLoadingGroups(true);
        try {
            const res = await getallgroups();
            setGroups(res.data.groups || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load groups");
        } finally {
            setLoadingGroups(false);
        }
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setSelectedFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setFilePreview(event.target.result);
        };
        reader.readAsDataURL(file);
        
        // Determine file type
        const type = file.type.split("/")[0];
        setFileType(type);
        
        e.target.value = "";
    };

    const removeFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setFileType("");
        setCaption("");
    };

    // Toggle group selection
    const toggleGroup = (groupId) => {
        setSelectedGroups(prev => 
            prev.includes(groupId) 
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const toggleAllGroups = () => {
        if (selectedGroups.length === groups.length) {
            setSelectedGroups([]);
        } else {
            setSelectedGroups(groups.map(g => g.id));
        }
    };

    // Send broadcast
    const handleSendBroadcast = async () => {
        // Validation
        if (activeTab === "system") {
            if (messageType === "text" && !textMessage.trim()) {
                toast.error("Please enter a message to broadcast");
                return;
            }
            if (messageType === "media" && !selectedFile) {
                toast.error("Please select a media file to broadcast");
                return;
            }
        } else {
            if (selectedGroups.length === 0) {
                toast.error("Please select at least one group");
                return;
            }
            if (messageType === "text" && !textMessage.trim()) {
                toast.error("Please enter a message to broadcast");
                return;
            }
            if (messageType === "media" && !selectedFile) {
                toast.error("Please select a media file to broadcast");
                return;
            }
        }

        setSending(true);
        
        try {
            let response;
            
            if (activeTab === "system") {
                if (messageType === "text") {
                    response = await sendSystemLevelTextBroadcast(textMessage.trim());
                } else {
                    response = await sendSystemLevelMediaBroadcast(selectedFile, caption.trim());
                }
            } else {
                const groupIds = groups
                    .filter(g => selectedGroups.includes(g.id))
                    .map(g => g.id);
                
                if (messageType === "text") {
                    response = await sendGroupLevelTextBroadcast(textMessage.trim(), groupIds);
                } else {
                    response = await sendGroupLevelMediaBroadcast(selectedFile, groupIds, caption.trim());
                }
            }
            
            toast.success(response?.data?.message || "Broadcast sent successfully!");
            
            // Clear form
            setTextMessage("");
            removeFile();
            if (activeTab === "group") {
                setSelectedGroups([]);
            }
            
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send broadcast");
        } finally {
            setSending(false);
        }
    };

    // Get file icon based on type
    const getFileIcon = () => {
        if (!fileType) return <FaFileAlt />;
        switch(fileType) {
            case "image": return <FaImage />;
            case "video": return <FaVideo />;
            case "audio": return <FaMicrophone />;
            default: return <FaFileAlt />;
        }
    };

    return (
        <div className="broadcast-page">
            {/* Header */}
            <div className="broadcast-header">
                <div>
                    <h1 className="broadcast-title">
                        <FaBullhorn className="broadcast-title-icon" />
                        Broadcast
                    </h1>
                    <p className="broadcast-subtitle">
                        Send messages to all contacts or specific groups
                    </p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="broadcast-tabs">
                <button 
                    className={`broadcast-tab ${activeTab === "system" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("system");
                        setSelectedGroups([]);
                    }}
                >
                    <FaGlobe className="tab-icon" />
                    System Level
                </button>
                <button 
                    className={`broadcast-tab ${activeTab === "group" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("group");
                        loadGroups();
                    }}
                >
                    <FaUsers className="tab-icon" />
                    Group Level
                </button>
            </div>

            <div className="broadcast-content">
                {/* Message Type Toggle */}
                <div className="message-type-toggle">
                    <button 
                        className={`type-btn ${messageType === "text" ? "active" : ""}`}
                        onClick={() => {
                            setMessageType("text");
                            removeFile();
                        }}
                    >
                        📝 Text Message
                    </button>
                    <button 
                        className={`type-btn ${messageType === "media" ? "active" : ""}`}
                        onClick={() => {
                            setMessageType("media");
                            setTextMessage("");
                        }}
                    >
                        📎 Media Message
                    </button>
                </div>

                {/* Group Selection (Group Level only) */}
                {activeTab === "group" && (
                    <div className="group-selector">
                        <div className="group-selector-header">
                            <h3 className="group-selector-title">
                                <FaUsers className="group-icon" />
                                Select Groups
                            </h3>
                            <button 
                                className="select-all-btn"
                                onClick={toggleAllGroups}
                                disabled={loadingGroups || groups.length === 0}
                            >
                                {selectedGroups.length === groups.length && groups.length > 0 
                                    ? "Deselect All" 
                                    : "Select All"}
                            </button>
                        </div>

                        {loadingGroups ? (
                            <div className="groups-loading">
                                <div className="spinner-small"></div>
                                <span>Loading groups...</span>
                            </div>
                        ) : groups.length === 0 ? (
                            <div className="groups-empty">
                                <p>No groups available. Create a group first.</p>
                            </div>
                        ) : (
                            <div className="groups-grid">
                                {groups.map((group) => (
                                    <div 
                                        key={group.id}
                                        className={`group-chip ${selectedGroups.includes(group.id) ? "selected" : ""}`}
                                        onClick={() => toggleGroup(group.id)}
                                    >
                                        <span className="group-chip-name">{group.name}</span>
                                        {selectedGroups.includes(group.id) && (
                                            <span className="group-chip-check">✓</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedGroups.length > 0 && (
                            <div className="selected-count">
                                {selectedGroups.length} group{selectedGroups.length > 1 ? "s" : ""} selected
                            </div>
                        )}
                    </div>
                )}

                {/* Message Input Area */}
                <div className="message-input-area">
                    <div className="input-card">
                        <h3 className="input-card-title">
                            {activeTab === "system" ? "System Broadcast" : "Group Broadcast"}
                        </h3>
                        <p className="input-card-hint">
                            {activeTab === "system" 
                                ? "This message will be sent to all contacts in the system." 
                                : `This message will be sent to ${selectedGroups.length} selected group${selectedGroups.length > 1 ? "s" : ""}.`}
                        </p>

                        {/* Text Input */}
                        {messageType === "text" && (
                            <div className="text-input-wrapper">
                                <textarea
                                    className="broadcast-textarea"
                                    placeholder="Type your broadcast message here..."
                                    value={textMessage}
                                    onChange={(e) => setTextMessage(e.target.value)}
                                    rows={6}
                                    maxLength={4096}
                                />
                                <div className="char-count">
                                    {textMessage.length}/4096
                                </div>
                            </div>
                        )}

                        {/* Media Upload with Caption */}
                        {messageType === "media" && (
                            <div className="media-upload-wrapper">
                                {!selectedFile ? (
                                    <div className="media-drop-zone">
                                        <div className="media-drop-icon">📎</div>
                                        <h4>Upload Media</h4>
                                        <p>Supported: Images, Videos, Audio, Documents</p>
                                        <label className="media-select-btn">
                                            Choose File
                                            <input 
                                                type="file" 
                                                onChange={handleFileSelect}
                                                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="media-preview">
                                        {/* REMOVE FILE BUTTON - TOP RIGHT CORNER */}
                                        <button className="media-remove-corner-btn" onClick={removeFile}>
                                            <FaTimes />
                                        </button>
                                        
                                        <div className="media-preview-content">
                                            {fileType === "image" && (
                                                <img src={filePreview} alt="Preview" className="media-preview-image" />
                                            )}
                                            {fileType === "video" && (
                                                <video src={filePreview} controls className="media-preview-video" />
                                            )}
                                            {fileType === "audio" && (
                                                <audio src={filePreview} controls className="media-preview-audio" />
                                            )}
                                            {!["image", "video", "audio"].includes(fileType) && (
                                                <div className="media-preview-file">
                                                    <span className="file-icon">{getFileIcon()}</span>
                                                    <span className="file-name">{selectedFile.name}</span>
                                                    <span className="file-size">
                                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* CAPTION INPUT - Above Send Button */}
                                {selectedFile && (
                                    <div className="media-caption-wrapper">
                                        <input
                                            type="text"
                                            className="media-caption-input"
                                            placeholder="Add a caption to your media (optional)"
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            maxLength={1000}
                                        />
                                        <span className="caption-char-count">
                                            {caption.length}/1000
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Send Button */}
                        <button 
                            className="send-broadcast-btn"
                            onClick={handleSendBroadcast}
                            disabled={sending || (
                                activeTab === "group" && selectedGroups.length === 0
                            ) || (
                                messageType === "text" && !textMessage.trim()
                            ) || (
                                messageType === "media" && !selectedFile
                            )}
                        >
                            {sending ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <MdSend className="send-icon" />
                                    Send Broadcast
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Info Section */}
                <div className="broadcast-info">
                    <div className="info-card">
                        <h4>📌 Important Notes</h4>
                        <ul>
                            <li>Broadcasts are sent immediately to all contacts/groups</li>
                            <li>Media files are uploaded and delivered with the message</li>
                            <li>Each group receives the message with its own context</li>
                            <li>System-level broadcasts reach all contacts in the system</li>
                            {messageType === "media" && (
                                <li>💡 Add a caption to provide context for your media</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Broadcast;