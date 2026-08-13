import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/contacts.css'
import { getcontacts } from "../api/contacts";
import toast from "react-hot-toast";
import { FaUser, FaImage, FaVideo, FaMicrophone, FaFileAlt, FaCommentDots, FaEllipsisV } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa";

const AVATAR_COLORS = ["#25d366", "#53bdeb", "#f0b429", "#f87171", "#a78bfa", "#38bdf8", "#fb7185"];

function colorForName(name) {
    const str = name || "?";
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}


function Contacts() {
    const navigate = useNavigate();

    const [loading, setloading] = useState(true)
    const [contacts, setcontacts] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    const getContacts = async () => {
        try {
            const res = await getcontacts()
            setcontacts(res.data.contacts || [])
        } catch (err) {
            toast.error(err.response?.data?.message || "Contacts not Loaded")
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        getContacts()
    }, [])

    const filteredContacts = contacts.filter((c) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (c.name || "").toLowerCase().includes(term) || (c.waId || "").toLowerCase().includes(term);
    });

    const goToChat = (contact) => {
        navigate(`/dashboard/chat?contact=${contact.waId}`);
    };

    return (
        <div className="contacts-page">

            <div className="contacts-top-bar">
                <div>
                    <h1 className="contacts-title">Contacts</h1>
                    <p className="contacts-subtitle">Manage your Whatsapp Contacts</p>
                </div>
            </div>

            <div className="contacts-search-wrap">
                <input
                    className="contacts-search"
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="contacts-search-icon">⌕</span>
            </div>

            <div className="contacts-card">
                {loading ? (
                    <div className="su-loading"><div className="spinner"></div></div>
                ) : filteredContacts.length === 0 ? (
                    <div className="contacts-empty">
                        {searchTerm ? "No contacts match your search." : "No contacts found."}
                    </div>
                ) : (
                    <table className="contacts-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Contact</th>
                                <th>Phone</th>
                                <th>Group</th>
                                <th>Message</th>
                                <th className="contacts-actions-head"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredContacts.map((contact, index) => {
                                const groupName = contact.groups?.[0]?.group?.name;

                                return (
                                    <tr
                                        key={contact.id || index}
                                        className="contact-row"
                                        onClick={() => goToChat(contact)}
                                    >
                                        <td className="contact-number">{index + 1}</td>

                                        <td>
                                            <div className="contact-name-cell">
                                                <div
                                                    className="contact-avatar"
                                                    style={{ background: colorForName(contact.name) }}
                                                >
                                                    {contact.name
                                                        ? contact.name.charAt(0).toUpperCase()
                                                        : <FaUser size={15} />}
                                                </div>

                                                <div className="contact-name-info">
                                                    <div className="contact-name">
                                                        {contact.name || "Unknown"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="contact-phone">
                                                {contact.waId || "-"}
                                            </span>
                                        </td>

                                        <td>
                                            {groupName ? (
                                                <span className="contact-group-badge">{groupName}</span>
                                            ) : (
                                                <span className="contact-group-empty">No group</span>
                                            )}
                                        </td>

                                         <td className="contact-message-cell" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="contact-chat-icon-btn"
                                                onClick={() => goToChat(contact)}
                                                title={`Open chat with ${contact.name || contact.waId}`}
                                            >
                                                <FaCommentDots />
                                            </button>
                                        </td>

                                        <td className="contact-actions-cell" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="contact-more-btn"
                                                onClick={() => setOpenMenuId(openMenuId === contact.id ? null : contact.id)}
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            

                                            {openMenuId === contact.id && (
                                                <div
                                                    className={`contact-actions-menu ${
                                                        index === filteredContacts.length - 1 ? "open-up" : ""
                                                    }`}
                                                >
                                                    <button onClick={() => { 
                                                        setOpenMenuId(null); 
                                                        goToChat(contact); 
                                                    }}>
                                                        View Messages
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default Contacts;