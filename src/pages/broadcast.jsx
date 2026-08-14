import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Users,
  Globe,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  X,
  Send,
  Paperclip,
  PinIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  sendSystemLevelTextBroadcast,
  sendSystemLevelMediaBroadcast,
  sendGroupLevelTextBroadcast,
  sendGroupLevelMediaBroadcast,
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
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const toggleAllGroups = () => {
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map((g) => g.id));
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
          response = await sendSystemLevelMediaBroadcast(
            selectedFile,
            caption.trim(),
          );
        }
      } else {
        const groupIds = groups
          .filter((g) => selectedGroups.includes(g.id))
          .map((g) => g.id);

        if (messageType === "text") {
          response = await sendGroupLevelTextBroadcast(
            textMessage.trim(),
            groupIds,
          );
        } else {
          response = await sendGroupLevelMediaBroadcast(
            selectedFile,
            groupIds,
            caption.trim(),
          );
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
    if (!fileType) return <FileText size={18} />;
    switch (fileType) {
      case "image":
        return <ImageIcon size={18} />;
      case "video":
        return <Video size={18} />;
      case "audio":
        return <Mic size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#EAF7F4] px-4 py-6 sm:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold text-[#1F2937]">
          <Megaphone size={20} className="text-[#0EA894]" />
          Broadcast
        </h1>
        <p className="text-sm text-[#6B7280]">
          Send messages to all contacts or specific groups
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-5">
        {/* Tab Switcher */}
        <div className="flex gap-2 rounded-xl bg-white p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => {
              setActiveTab("system");
              setSelectedGroups([]);
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              activeTab === "system"
                ? "bg-[#0B6F60] text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            <Globe size={14} />
            System Level
          </button>
          <button
            onClick={() => {
              setActiveTab("group");
              loadGroups();
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              activeTab === "group"
                ? "bg-[#0B6F60] text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            <Users size={14} />
            Group Level
          </button>
        </div>

        {/* Message Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMessageType("text");
              removeFile();
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              messageType === "text"
                ? "border-[#0EA894] bg-[#0EA894]/10 text-[#0B6F60]"
                : "border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F9FAFB]"
            }`}
          >
            <FileText size={14} />
            Text Message
          </button>
          <button
            onClick={() => {
              setMessageType("media");
              setTextMessage("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              messageType === "media"
                ? "border-[#0EA894] bg-[#0EA894]/10 text-[#0B6F60]"
                : "border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F9FAFB]"
            }`}
          >
            <Paperclip size={14} />
            Media Message
          </button>
        </div>

        {/* Group Selection (Group Level only) */}
        {activeTab === "group" && (
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
                <Users size={14} className="text-[#0EA894]" />
                Select Groups
              </h3>
              <button
                onClick={toggleAllGroups}
                disabled={loadingGroups || groups.length === 0}
                className="text-xs font-medium text-[#0B6F60] hover:text-[#0EA894] disabled:opacity-40"
              >
                {selectedGroups.length === groups.length && groups.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {loadingGroups ? (
              <div className="flex items-center gap-2 py-6 text-sm text-[#6B7280]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0EA894]/20 border-t-[#0EA894]" />
                Loading groups...
              </div>
            ) : groups.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#9CA3AF]">
                No groups available. Create a group first.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {groups.map((group) => {
                  const isSelected = selectedGroups.includes(group.id);
                  return (
                    <div
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                        isSelected
                          ? "border-[#0EA894] bg-[#0EA894] text-white"
                          : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#0EA894]/40"
                      }`}
                    >
                      {group.name}
                      {isSelected && <span className="text-xs">✓</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {selectedGroups.length > 0 && (
              <p className="mt-3 text-xs font-medium text-[#0B6F60]">
                {selectedGroups.length} group
                {selectedGroups.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        )}

        {/* Message Input Area */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <h3 className="text-sm font-semibold text-[#1F2937]">
            {activeTab === "system" ? "System Broadcast" : "Group Broadcast"}
          </h3>
          <p className="mb-4 mt-1 text-xs text-[#6B7280]">
            {activeTab === "system"
              ? "This message will be sent to all contacts in the system."
              : `This message will be sent to ${selectedGroups.length} selected group${selectedGroups.length > 1 ? "s" : ""}.`}
          </p>

          {/* Text Input */}
          {messageType === "text" && (
            <div className="relative">
              <textarea
                placeholder="Type your broadcast message here..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                rows={6}
                maxLength={4096}
                className="w-full resize-none rounded-xl border border-[#E5E7EB] p-4 pb-7 text-sm text-[#1F2937] outline-none transition-all duration-200 focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
              />
              <span className="pointer-events-none absolute bottom-2.5 right-3 text-xs text-[#9CA3AF]">
                {textMessage.length}/4096
              </span>
            </div>
          )}

          {/* Media Upload with Caption */}
          {messageType === "media" && (
            <div className="space-y-3">
              {!selectedFile ? (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] px-4 py-10 text-center transition hover:border-[#0EA894]/50 hover:bg-[#0EA894]/5">
                  <Paperclip size={26} className="text-[#0EA894]" />
                  <h4 className="text-sm font-semibold text-[#1F2937]">
                    Upload Media
                  </h4>
                  <p className="text-xs text-[#9CA3AF]">
                    Supported: Images, Videos, Audio, Documents
                  </p>
                  <span className="mt-1 rounded-full bg-[#0B6F60] px-4 py-1.5 text-xs font-medium text-white">
                    Choose File
                  </span>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <button
                    onClick={removeFile}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#6B7280] shadow-sm transition hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={13} />
                  </button>

                  {fileType === "image" && (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="mx-auto max-h-52 rounded-lg object-contain"
                    />
                  )}
                  {fileType === "video" && (
                    <video
                      src={filePreview}
                      controls
                      className="mx-auto max-h-52 w-full rounded-lg"
                    />
                  )}
                  {fileType === "audio" && (
                    <audio src={filePreview} controls className="w-full" />
                  )}
                  {!["image", "video", "audio"].includes(fileType) && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#0EA894]/10 text-[#0B6F60]">
                        {getFileIcon()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#1F2937]">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Caption input — available for every media broadcast (system & group level) */}
              {selectedFile && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Add a caption to your media (optional)"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={1000}
                    className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 pr-16 text-sm text-[#1F2937] outline-none transition-all duration-200 focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                    {caption.length}/1000
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={handleSendBroadcast}
            disabled={
              sending ||
              (activeTab === "group" && selectedGroups.length === 0) ||
              (messageType === "text" && !textMessage.trim()) ||
              (messageType === "media" && !selectedFile)
            }
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B6F60] text-sm font-medium text-white transition hover:bg-[#0B8A79] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Broadcast
              </>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="rounded-2xl border border-[#0EA894]/20 bg-[#0EA894]/5 p-5">
          <div className="flex flex-row gap-2">
            <PinIcon></PinIcon>
            <h4 className="mb-2 text-sm font-semibold text-[#0B6F60]">
              Important Notes
            </h4>
          </div>

          <ul className="space-y-1.5 text-xs text-[#374151]">
            <li>Broadcasts are sent immediately to all contacts/groups</li>
            <li>Media files are uploaded and delivered with the message</li>
            <li>Each group receives the message with its own context</li>
            <li>System-level broadcasts reach all contacts in the system</li>
            {messageType === "media" && (
              <li>
                Add a caption to provide context for your media works for both
                system and group broadcasts
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Broadcast;
