import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getcontacts } from "../api/contacts";
import toast from "react-hot-toast";
import { FaUser, FaCommentDots, FaEllipsisV } from "react-icons/fa";
import { Search, Users } from "lucide-react";

const AVATAR_COLORS = [
    "bg-[#0EA894]", "bg-[#0B6F60]", "bg-[#F59E0B]", "bg-[#8B5CF6]",
    "bg-[#EC4899]", "bg-[#3B82F6]", "bg-[#10B981]", "bg-[#F97316]",
];

function colorForName(name) {
    const str = name || "?";
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Contacts() {
    const navigate = useNavigate();

    const [loading, setloading] = useState(true);
    const [contacts, setcontacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    const getContacts = async () => {
        try {
            const res = await getcontacts();
            setcontacts(res.data.contacts || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Contacts not Loaded");
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        getContacts();
    }, []);

    const filteredContacts = contacts.filter((c) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (c.name || "").toLowerCase().includes(term) || (c.waId || "").toLowerCase().includes(term);
    });

    const goToChat = (contact) => {
        navigate(`/dashboard/chat?contact=${contact.waId}`);
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-[#EAF7F4] px-4 py-6 sm:px-8">

            {/* Header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-[#1F2937]">Contacts</h1>
                    <p className="text-sm text-[#6B7280]">Manage your WhatsApp contacts</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0B6F60] shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <Users size={14} />
                    {filteredContacts.length} {filteredContacts.length === 1 ? "contact" : "contacts"}
                </div>
            </div>

            {/* Search */}
            <div className="mb-4 flex h-11 max-w-md items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
                <Search size={15} className="text-[#9CA3AF]" />
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF]"
                />
            </div>

            {/* List */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA894]/20 border-t-[#0EA894]" />
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <Users size={32} className="text-[#0EA894]/40" />
                        <p className="text-sm text-[#6B7280]">
                            {searchTerm ? "No contacts match your search." : "No contacts found."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#F3F4F6]">
                        {filteredContacts.map((contact, index) => {
                            const groupName = contact.groups?.[0]?.group?.name;

                            return (
                                <div
                                    key={contact.id || index}
                                    onClick={() => goToChat(contact)}
                                    className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition hover:bg-[#F9FAFB] sm:px-5"
                                >
                                    {/* Avatar */}
                                    <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-full text-sm font-semibold text-white ${colorForName(contact.name)}`}>
                                        {contact.name ? contact.name.charAt(0).toUpperCase() : <FaUser size={15} />}
                                    </div>

                                    {/* Name + subtitle */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-[#1F2937]">
                                            {contact.name || "Unknown"}
                                        </p>
                                        <p className="truncate text-xs text-[#9CA3AF]">
                                            {contact.waId || "-"}
                                        </p>
                                    </div>

                                    {/* Group badge */}
                                    <div className="hidden flex-none sm:block">
                                        {groupName ? (
                                            <span className="rounded-full bg-[#0EA894]/10 px-3 py-1 text-xs font-medium text-[#0B6F60]">
                                                {groupName}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-[#9CA3AF]">No group</span>
                                        )}
                                    </div>

                                    {/* Chat button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); goToChat(contact); }}
                                        title={`Open chat with ${contact.name || contact.waId}`}
                                        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[#0B6F60] transition hover:bg-[#0EA894]/10"
                                    >
                                        <FaCommentDots size={15} />
                                    </button>

                                    {/* Kebab menu */}
                                    <div className="relative flex-none" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === contact.id ? null : contact.id)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#374151]"
                                        >
                                            <FaEllipsisV size={13} />
                                        </button>

                                        {openMenuId === contact.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                                <div
                                                    className={`absolute right-0 z-20 w-40 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${
                                                        index === filteredContacts.length - 1 ? "bottom-9" : "top-9"
                                                    }`}
                                                >
                                                    <button
                                                        onClick={() => { setOpenMenuId(null); goToChat(contact); }}
                                                        className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-[#374151] transition hover:bg-[#F3F4F6]"
                                                    >
                                                        <FaCommentDots size={13} className="text-[#0B6F60]" />
                                                        View Messages
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Contacts;