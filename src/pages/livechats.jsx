import React, { useState, useEffect } from "react";
import { FaSearch, FaPhone, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile, FaPaperPlane, FaCheck, FaCheckDouble } from "react-icons/fa";
import "../css/livechats.css";
import { getcontacts } from "../api/livechats";
import { MdDoneAll,MdDone } from "react-icons/md";

function LiveChats() {

    const [contacts, setcontacts] = useState([])
    const [contacterror, setcontacterror] = useState("No contacts Show")
    const [selectedContactId, setSelectedContactId] = useState(null)

    // placeholder messages using the real Message schema fields:
    // body, direction (INCOMING/OUTGOING), status (SENT/DELIVERED/READ), createdAt
    const messages = [
        { id: 1, body: "Hi, I want to know more about your products.", direction: "INCOMING", status: "READ", createdAt: "2026-08-10T10:12:00Z" },
        { id: 2, body: "Sure! What are you looking for today?", direction: "OUTGOING", status: "READ", createdAt: "2026-08-10T10:13:00Z" },
        { id: 3, body: "Do you have Nike shoes available?", direction: "INCOMING", status: "READ", createdAt: "2026-08-10T10:14:00Z" },
        { id: 4, body: "Yes, we have a few options in stock. I'll send you the catalog.", direction: "OUTGOING", status: "DELIVERED", createdAt: "2026-08-10T10:15:00Z" },
        { id: 5, body: "Here's the price list.", direction: "OUTGOING", status: "SENT", createdAt: "2026-08-10T10:16:00Z" },
    ];

    const getContact = async () => {
        try {
            const res = await getcontacts()
            setcontacts(res.data.contacts)
        } catch (err) {
            console.error("Contact error:", err);
            setcontacterror("Failed to Load")
        }
    }
    useEffect(() => {
        getContact();
    }, []);

    // formats a full ISO timestamp (createdAt) into just "10:12 AM"
    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // returns the right tick icon + color for an OUTGOING message, based on status
    const renderTicks = (status) => {
        if (status === "READ") {
            return <MdDoneAll size={16} color="#53bdeb" className="tick-icon tick-read"/>
        }
        if (status === "DELIVERED") {
            return <MdDone size={16} color="#8696a0" className="tick-icon tick-delivered" />;
        }
        // SENT (or PROCESSED/RECEIVED as a fallback) — single grey tick
        return <FaCheck className="tick-icon tick-sent" />;
    };



    return (
        <div className="livechat-page">

            <div className="chat-list">

                {/* Header */}
                <div className="chat-list-header">
                    <div className="chat-header-title">
                        <h2>Live Chats</h2>
                        <span className="online-status">
                            <span className="status-dot"></span>
                            Online
                        </span>
                    </div>
                    <button className="chat-search-btn"><FaSearch /></button>
                </div>

                {/* Search */}
                <div className="chat-search">
                    <FaSearch />
                    <input type="text" placeholder="Search or start new chat" />
                </div>

                {/* Chat Items */}
                <div className="chat-items">

                    {contacts.map((con) => (
                        <div
                            className={`chat-item ${selectedContactId === con.id ? "active-chat" : ""}`}
                            key={con.id}
                            onClick={() => setSelectedContactId(con.id)}
                        >

                            <div className="chat-avatar">
                                {(con.name || con.waId || "?").charAt(0).toUpperCase()}
                                <span className="avatar-online"></span>
                            </div>

                            {/* Chat Information */}
                            <div className="chat-info">
                                <div className="chat-name-row">
                                    <span className="chat-name">
                                        {con.name || con.waId}
                                    </span>
                                    <span className="chat-time">
                                        {con.lastMessageTime ? formatTime(con.lastMessageTime) : "--:--"}
                                    </span>
                                </div>

                                <div className="chat-message-row">
                                    <span className="chat-last-message">
                                        {con.lastMessage || "No messages yet"}
                                    </span>

                                    {con.unreadCount > 0 && (
                                        <span className="unread-count">{con.unreadCount}</span>
                                    )}
                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>


            {/* RIGHT CHAT WINDOW */}
            <div className="chat-window">

                {/* Header */}
                <div className="chat-window-header">
                    <div className="selected-user">
                        <div className="selected-avatar">
                            👤
                        </div>
                        <div className="selected-user-info">
                            <h3>Waleed</h3>
                            <span>Online</span>
                        </div>
                    </div>

                    <div className="chat-actions">
                        <button onClick={() => {}}><FaPhone /></button>
                        <button onClick={() => {}}><FaEllipsisV /></button>
                    </div>
                </div>

                {/* Messages */}
                <div className="messages-area">

                    <div className="chat-date">
                        <span>Today</span>
                    </div>

                    {messages.map((msg) => {
                        const isSent = msg.direction === "OUTGOING";

                        return (
                            <div className={`message-row ${isSent ? "sent" : "received"}`} key={msg.id}>
                                <div className="message-bubble">
                                    <p>{msg.body}</p>
                                    <span className="message-time">
                                        {formatTime(msg.createdAt)}
                                        {isSent && renderTicks(msg.status)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input */}
                <div className="message-input-area">
                    <button className="message-icon-btn" onClick={() => {}}><FaSmile /></button>
                    <button className="message-icon-btn" onClick={() => {}}><FaPaperclip /></button>
                    <input type="text" placeholder="Type a message" />
                    <button className="send-message-btn" onClick={() => {}}><FaPaperPlane /></button>
                </div>

            </div>

        </div>
    );

}



export default LiveChats;