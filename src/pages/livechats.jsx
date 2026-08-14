import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaPhone,
  FaEllipsisV,
  FaPaperclip,
  FaSmile,
  FaPaperPlane,
  FaCheck,
  FaWhatsapp,
  FaArrowLeft,
  FaUser,
} from "react-icons/fa";
import { MdDoneAll, MdDone } from "react-icons/md";
import {
  getcontactwithlastmessage,
  sendmessage,
  sendattachments,
} from "../api/livechats";
import toast from "react-hot-toast";

function LiveChats() {
  const [contacts, setcontacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);

  const [selectedContact, setSelectedContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const [contacterror, setcontacterror] = useState(
    "No contacts yet — new chats will appear here.",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  const getcontactWithlastMessage = async () => {
    try {
      const res = await getcontactwithlastmessage();
      setcontacts(res.data.contactList);
    } catch (err) {
      console.error("Contact error:", err);
      setcontacterror("Failed to load contacts. Please try again.");
      toast.error("Failed to load contacts");
    }
  };

  useEffect(() => {
    getcontactWithlastMessage();
  }, []);

  const [message, setmessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const commonEmojis = [
    "😀",
    "😂",
    "😍",
    "👍",
    "🙏",
    "🎉",
    "❤️",
    "😢",
    "😮",
    "🔥",
    "👏",
    "✅",
  ];

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
      const type = mimeType.startsWith("image")
        ? "image"
        : mimeType.startsWith("video")
          ? "video"
          : mimeType.startsWith("audio")
            ? "audio"
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

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderTicks = (status) => {
    if (status === "READ") {
      return <MdDoneAll size={15} className="text-[#0EA894]" />;
    }
    if (status === "DELIVERED") {
      return <MdDone size={15} className="text-gray-400" />;
    }
    return <FaCheck size={11} className="text-gray-400" />;
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#EAF7F4]">
      {/* CHAT LIST */}
      <div
        className={`flex w-full flex-col lg:border-r lg:border-[#E5E7EB] bg-white md:w-[360px] md:flex-none ${selectedContact ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#0B6F60] px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <FaWhatsapp size={18} /> Live Chats
          </h2>
          <button
            onClick={() => searchInputRef.current?.focus()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            <FaSearch size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 lg:border-r lg:border-gray-300">
          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
            <FaSearch size={13} className="text-[#9CA3AF]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search or start new chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        {/* Chat items */}
        <div className="flex-1 overflow-y-auto px-2 pb-3 lg:border-r lg:border-gray-300">
          {filteredContacts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <FaWhatsapp size={36} className="text-[#0EA894]/40" />
              <p className="text-sm text-[#6B7280]">
                {searchTerm ? "No contacts match your search." : contacterror}
              </p>
            </div>
          ) : (
            filteredContacts.map((con) => {
              const isActive = selectedContactId === con.id;
              return (
                <div
                  key={con.id}
                  onClick={() => {
                    setSelectedContactId(con.id);
                    setSelectedContact(con);
                    setChatMessages(con.message || []);
                  }}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition mb-2 shadow-md ${
                    isActive ? "bg-gray-200" : "bg-gray-50"
                  }`}
                >
                  <div className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#0B6F60] text-white">
                    <FaUser size={16} />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#4ADE80]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-[#1F2937]">
                        {con.name || con.waId}
                      </span>
                      <span className="flex-none text-xs text-[#9CA3AF]">
                        {con.message?.[0]?.createdAt
                          ? formatTime(con.message[0].createdAt)
                          : "--:--"}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-[#6B7280]">
                        {con.message?.[0]?.body || "No messages yet"}
                      </span>

                      {con.unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 flex-none items-center justify-center rounded-full bg-[#0EA894] px-1.5 text-[10px] font-semibold text-white">
                          {con.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div
        className={`min-h-0 flex-1 flex-col bg-[#EAF7F4] ${selectedContact ? "flex" : "hidden md:flex"}`}
      >
        {!selectedContact ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <FaWhatsapp size={40} className="text-[#25D366]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1F2937]">
              WhatsApp Chatbot CRM
            </h2>
            <p className="text-sm text-[#6B7280]">
              Select a chat from the left to start viewing messages.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedContact(null);
                    setSelectedContactId(null);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#374151] transition hover:bg-[#F3F4F6] md:hidden"
                >
                  <FaArrowLeft size={15} />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B6F60] text-white">
                  <FaUser size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1F2937]">
                    {selectedContact.name || selectedContact.waId}
                  </h3>
                  {selectedContact.name && (
                    <span className="text-xs text-[#6B7280]">
                      {selectedContact.waId}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="flex h-9 w-9 items-center justify-center rounded-full text-[#374151] transition hover:bg-[#F3F4F6]">
                  <FaEllipsisV size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {/* Messages */}
            <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-8 pb-24">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-contain bg-center"
                style={{ backgroundImage: "url('/chat-bg-image.jpg')" }}
              />

              {/* Content sits above the background */}
              <div className="relative space-y-2">
                <div className="flex justify-center">
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-[#6B7280] shadow-sm">
                    Today
                  </span>
                </div>

                {chatMessages.length === 0 ? (
                  <p className="pt-10 text-center text-sm text-[#9CA3AF]">
                    No messages yet.
                  </p>
                ) : (
                  chatMessages.map((msg) => {
                    const isSent = msg.direction === "OUTGOING";

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[60%] ${
                            isSent
                              ? "rounded-tr-sm bg-[#0EA894] text-white"
                              : "rounded-tl-sm bg-white text-[#1F2937]"
                          }`}
                        >
                          {msg.type === "image" && msg.mediaUrl && (
                            <img
                              src={msg.mediaUrl}
                              alt="attachment"
                              className="mb-1.5 max-h-64 w-full rounded-xl object-cover"
                            />
                          )}
                          {msg.type === "video" && msg.mediaUrl && (
                            <video
                              src={msg.mediaUrl}
                              controls
                              className="mb-1.5 max-h-64 w-full rounded-xl"
                            />
                          )}
                          {msg.type === "audio" && msg.mediaUrl && (
                            <audio
                              src={msg.mediaUrl}
                              controls
                              className="mb-1.5 w-full"
                            />
                          )}
                          {msg.type === "document" && msg.mediaUrl && (
                            <a
                              href={msg.mediaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`mb-1.5 flex items-center gap-2 rounded-xl px-3 py-2 text-sm underline ${
                                isSent ? "bg-white/15" : "bg-[#F3F4F6]"
                              }`}
                            >
                              📄 {msg.fileName || "Document"}
                            </a>
                          )}

                          {msg.body && (
                            <p className="text-sm leading-relaxed">
                              {msg.body}
                            </p>
                          )}

                          <div
                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isSent ? "text-white/70" : "text-[#9CA3AF]"}`}
                          >
                            {formatTime(msg.createdAt)}
                            {isSent && renderTicks(msg.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Input */}
            <div className="flex-none border-t border-[#E5E7EB] bg-white px-4 py-3">
              {selectedFile && (
                <div className="mb-2 flex w-fit items-center gap-2 rounded-full bg-[#0EA894]/10 px-3 py-1.5 text-xs text-[#0B6F60]">
                  <span className="max-w-[200px] truncate">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-[#0B6F60] hover:text-[#0EA894]"
                  >
                    ✕
                  </button>
                </div>
              )}

              {showEmojiPicker && (
                <div className="mb-2 flex flex-wrap gap-1 rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-lg transition hover:bg-[#F3F4F6]"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowEmojiPicker((p) => !p)}
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6]"
                >
                  <FaSmile size={17} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6]"
                >
                  <FaPaperclip size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />

                <div className="min-w-0 bg-gray-200 flex h-11 flex-1 items-center rounded-xl border border-[#E5E7EB] px-4 transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setmessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (selectedFile ? sendAttachment() : sendMessage())
                    }
                    className="w-full bg-transparent text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF]"
                  />
                </div>

                <button
                  onClick={selectedFile ? sendAttachment : sendMessage}
                  disabled={sending || (!message.trim() && !selectedFile)}
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#0B6F60] text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed"
                >
                  <FaPaperPlane size={15} />
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
