import React from "react";
import '../css/contacts.css'
import { useState, useEffect } from "react";
import { getcontacts } from "../api/livechats";
import toast from "react-hot-toast";

function Contacts() {

    const [loading, setloading] = useState(true)
    const [contacts, setcontacts] = useState([])
    const getContacts = async () => {
        try {
            const res = await getcontacts()
            setcontacts(res.data.contacts)
        } catch (err) {
            toast.error(err.response?.data?.message || "Contacts not Loaded")
        } finally {
            setloading(false)
        }

    }
    useEffect(() => {
        getContacts()
    }, [])

    {
        !loading && contacts.length === 0 && (
            <div className="contacts-empty">
                No contacts found.
            </div>
        )
    }


    return (
        <div className="contacts-page">

            <div className="contacts-top-bar">
                <div>
                    <h1 className="contacts-title">Contacts</h1>
                    <p className="contacts-subtitle">Manage your Whatsapp Contacts</p>
                </div>

                {/* <div className="contacts-header-actions">
                    <button onClick={() => { }}>+ Add Contact</button>
                </div> */}
            </div>

            <div className="contacts-search-wrap">
                <input className="contacts-search" type="text" placeholder="Search contacts..." />
                <span className="contacts-search-icon">⌕</span>
            </div>

            <div className="contacts-card">
                {contacts.length === 0 ? (
                    <div className="contacts-empty">
                        No contacts found.
                    </div>
                ) : (
                    <table className="contacts-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Contact</th>
                                <th>Phone</th>
                                <th>Group</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {contacts.map((contact, index) => (
                                <tr key={contact.id || index}>
                                    <td className="contact-number">{index + 1}</td>

                                    <td>
                                        <div className="contact-name-cell">
                                            <div className="contact-avatar">
                                                {(contact.name || contact.full_name || "U").charAt(0).toUpperCase()}
                                            </div>

                                            <div className="contact-name-info">
                                                <div className="contact-name">
                                                    {contact.name || contact.full_name || "Unknown"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="contact-phone">
                                            {contact.phone || contact.phone_number || "-"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="contact-group">
                                            {contact.group || contact.group_name || "-"}
                                        </span>
                                    </td>

                                    <td className="contact-actions-cell">
                                        <button className="contact-more-btn" onClick={() => { }}>⋮</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default Contacts;