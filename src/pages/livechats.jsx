import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaPhone, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile, FaPaperPlane, FaCheck, FaCheckDouble, FaWhatsapp, FaArrowLeft } from "react-icons/fa";
import "../css/livechats.css";
import { getcontactwithlastmessage, sendmessage, sendattachments } from "../api/livechats";
import { MdDoneAll, MdDone } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

function LiveChats() {

    const [contacts, setcontacts] = useState([])
    const [selectedContactId, setSelectedContactId] = useState(null)

    const [selectedContact, setSelectedContact] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

    const [contacterror, setcontacterror] = useState("No contacts yet — new chats will appear here.");
    const [searchTerm, setSearchTerm] = useState("");
    const searchInputRef = useRef(null);

    const getcontactWithlastMessage = async () => {
        try {
            const res = await getcontactwithlastmessage()
            setcontacts(res.data.contactList)
        } catch (err) {
            console.error("Contact error:", err);
            setcontacterror("Failed to load contacts. Please try again.")
            toast.error("Failed to load contacts");
        }
    }

    useEffect(() => {
        getcontactWithlastMessage();
    }, []);

    const [message, setmessage] = useState("")
    const [sending, setSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);

    const commonEmojis = ["😀", "😂", "😍", "👍", "🙏", "🎉", "❤️", "😢", "😮", "🔥", "👏", "✅"];

    const addEmoji = (emoji) => {
        setmessage((prev) => prev + emoji);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
        e.target.value = "";
    };

    const sendMessage = async () => {
        if (!message.trim() || !selectedContact) return;
        setSending(true);
        try {
            await sendmessage(selectedContact.id, message.trim());
            const sentMsg = {
                id: Date.now(),
                body: message.trim(),
                direction: "OUTGOING",
                status: "PENDING",
                createdAt: new Date().toISOString(),
            };
            setChatMessages((prev) => [...prev, sentMsg]);
            setmessage("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const sendAttachment = async () => {
        if (!selectedFile || !selectedContact) return;
        setSending(true);
        try {
            const caption = message.trim() || undefined;
            await sendattachments(selectedContact.id, [selectedFile], caption);

            const mimeType = selectedFile.type || "";
            const type = mimeType.startsWith("image") ? "image"
                : mimeType.startsWith("video") ? "video"
                    : mimeType.startsWith("audio") ? "audio"
                        : "document";

            const sentMsg = {
                id: Date.now(),
                body: caption || null,
                direction: "OUTGOING",
                status: "PENDING",
                type,
                fileName: selectedFile.name,
                mediaUrl: URL.createObjectURL(selectedFile), // local preview only — real URL comes back once delivered
                createdAt: new Date().toISOString(),
            };

            setChatMessages((prev) => [...prev, sentMsg]);
            setSelectedFile(null);
            setmessage("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send attachment");
        } finally {
            setSending(false);
        }
    };

    const filteredContacts = contacts.filter((con) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        const name = (con.name || "").toLowerCase();
        const waId = (con.waId || "").toLowerCase();
        return name.includes(term) || waId.includes(term);
    });

    // formats a full ISO timestamp (createdAt) into just "10:12 AM"
    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // returns the right tick icon + color for an OUTGOING message, based on status
    const renderTicks = (status) => {
        if (status === "READ") {
            return <MdDoneAll size={16} color="#53bdeb" className="tick-icon tick-read" />
        }
        if (status === "DELIVERED") {
            return <MdDone size={16} color="#8696a0" className="tick-icon tick-delivered" />;
        }
        // SENT / PENDING (or PROCESSED/RECEIVED as a fallback) — single grey tick
        return <FaCheck className="tick-icon tick-sent" />;
    };

    return (
        <div className={`livechat-page ${selectedContact ? "mobile-chat-open" : ""}`}>

            <div className="chat-list">

                {/* Header */}
                <div className="chat-list-header">
                    <div className="chat-header-title">
                        <h2><FaWhatsapp size={18} color="#25D366" /> Live Chats</h2>
                    </div>
                    <button className="chat-search-btn" onClick={() => searchInputRef.current?.focus()}>
                        <FaSearch />
                    </button>
                </div>

                {/* Search */}
                <div className="chat-search">
                    <FaSearch />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search or start new chat"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Chat Items */}
                <div className="chat-items">
                    {filteredContacts.length === 0 ? (
                        <div className="chat-list-empty">
                            <FaWhatsapp size={36} />
                            <p>{searchTerm ? "No contacts match your search." : contacterror}</p>
                        </div>
                    ) : (
                        filteredContacts.map((con) => (
                            <div
                                className={`chat-item ${selectedContactId === con.id ? "active-chat" : ""}`}
                                key={con.id}
                                onClick={() => {
                                    setSelectedContactId(con.id);
                                    setSelectedContact(con);
                                    setChatMessages(con.message || []);
                                }}
                            >
                                <div className="chat-avatar">
                                    <FaUser size={20} />
                                    <span className="avatar-online"></span>
                                </div>

                                <div className="chat-info">
                                    <div className="chat-name-row">
                                        <span className="chat-name">
                                            {con.name || con.waId}
                                        </span>
                                        <span className="chat-time">
                                            {con.message?.[0]?.createdAt ? formatTime(con.message[0].createdAt) : "--:--"}
                                        </span>
                                    </div>

                                    <div className="chat-message-row">
                                        <span className="chat-last-message">
                                            {con.message?.[0]?.body || "No messages yet"}
                                        </span>

                                        {con.unreadCount > 0 && (
                                            <span className="unread-count">{con.unreadCount}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT CHAT WINDOW */}
            <div className="chat-window">

                {!selectedContact ? (
                    <div className="chat-window-empty">
                        <FaWhatsapp size={80} color="#25d366" />
                        <h2>WhatsApp Chatbot Panel</h2>
                        <p>Select a chat from the left to start viewing messages.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="chat-window-header">
                            <div className="selected-user">
                                <button
                                    className="chat-back-btn"
                                    onClick={() => {
                                        setSelectedContact(null);
                                        setSelectedContactId(null);
                                    }}
                                >
                                    <FaArrowLeft />
                                </button>
                                <div className="selected-avatar">
                                    <FaUser size={18} />
                                </div>
                                <div className="selected-user-info">
                                    <h3>{selectedContact.name || selectedContact.waId}</h3>
                                    {selectedContact.name && (
                                        <span>{selectedContact.waId}</span>
                                    )}
                                </div>
                            </div>

                            <div className="chat-actions">
                                <button onClick={() => { }}><FaPhone /></button>
                                <button onClick={() => { }}><FaEllipsisV /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="messages-area">

                            <div className="chat-date">
                                <span>Today</span>
                            </div>

                            {chatMessages.length === 0 ? (
                                <p className="no-messages-text">No messages yet.</p>
                            ) : (
                                chatMessages.map((msg) => {
                                    const isSent = msg.direction === "OUTGOING";

                                    return (
                                        <div className={`message-row ${isSent ? "sent" : "received"}`} key={msg.id}>
                                            <div className="message-bubble">
                                                {msg.type === "image" && msg.mediaUrl && (
                                                    <img src={msg.mediaUrl} alt="attachment" className="message-media-image" />
                                                )}
                                                {msg.type === "video" && msg.mediaUrl && (
                                                    <video src={msg.mediaUrl} controls className="message-media-video" />
                                                )}
                                                {msg.type === "audio" && msg.mediaUrl && (
                                                    <audio src={msg.mediaUrl} controls className="message-media-audio" />
                                                )}
                                                {msg.type === "document" && msg.mediaUrl && (
                                                    <a href={msg.mediaUrl} target="_blank" rel="noreferrer" className="message-media-doc">
                                                        📄 {msg.fileName || "Document"}
                                                    </a>
                                                )}

                                                {msg.body && <p>{msg.body}</p>}

                                                <span className="message-time">
                                                    {formatTime(msg.createdAt)}
                                                    {isSent && renderTicks(msg.status)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input */}
                        <div className="message-input-area-wrap">
                            {selectedFile && (
                                <div className="selected-file-pill">
                                    <span>{selectedFile.name}</span>
                                    <button onClick={() => setSelectedFile(null)}>✕</button>
                                </div>
                            )}

                            {showEmojiPicker && (
                                <div className="emoji-picker">
                                    {commonEmojis.map((emoji) => (
                                        <button key={emoji} onClick={() => addEmoji(emoji)}>{emoji}</button>
                                    ))}
                                </div>
                            )}

                            <div className="message-input-area">
                                <button className="message-icon-btn" onClick={() => setShowEmojiPicker((p) => !p)}>
                                    <FaSmile />
                                </button>
                                <button className="message-icon-btn" onClick={() => fileInputRef.current?.click()}>
                                    <FaPaperclip />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                                    onChange={handleFileSelect}
                                />
                                <input
                                    type="text"
                                    placeholder="Type a message"
                                    value={message}
                                    onChange={(e) => setmessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (selectedFile ? sendAttachment() : sendMessage())}
                                />
                                <button
                                    className="send-message-btn"
                                    onClick={selectedFile ? sendAttachment : sendMessage}
                                    disabled={sending || (!message.trim() && !selectedFile)}
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default LiveChats;