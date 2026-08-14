import { useState, useEffect } from "react";
import {
    getallgroups, getgroupbyid, getgroupmembers, creategroup, deletegroup, addcontacttogroup, removecontactfromgroup, setdescription, deletedescription, setgroupprompt, deletegroupprompt,
    updategroupname, tooglegroupmodebyid
} from "../api/groups";
import { getcontacts } from "../api/contacts";
import toast from "react-hot-toast";
import ConfirmDialog from "../component/ConfirmDailog";
import { Users, Plus, X, Search, Pencil, Trash2, Sparkles, ArrowLeft } from "lucide-react";

const AVATAR_COLORS = [
    "bg-[#0EA894]", "bg-[#0B6F60]", "bg-[#F59E0B]", "bg-[#8B5CF6]",
    "bg-[#EC4899]", "bg-[#3B82F6]", "bg-[#10B981]", "bg-[#F97316]",
];

function Groups() {
    // ---- left panel: group list ----
    const [groups, setGroups] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [creating, setCreating] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    // ---- right panel: selected group detail ----
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);

    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState("");
    const [savingName, setSavingName] = useState(false);

    const [editingDescription, setEditingDescription] = useState(false);
    const [descriptionDraft, setDescriptionDraft] = useState("");
    const [savingDescription, setSavingDescription] = useState(false);

    const [editingPrompt, setEditingPrompt] = useState(false);
    const [promptDraft, setPromptDraft] = useState("");
    const [savingPrompt, setSavingPrompt] = useState(false);

    const [allContacts, setAllContacts] = useState([]);
    const [showAddMember, setShowAddMember] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState("");
    const [addingMember, setAddingMember] = useState(false);

    // ---- load group list ----
    const loadGroups = async () => {
        try {
            const res = await getallgroups();
            setGroups(res.data.groups || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load groups");
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    const filteredGroups = groups.filter((g) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ---- load selected group's detail ----
    const loadGroupDetail = async (id) => {
        setDetailLoading(true);
        try {
            const [groupRes, membersRes] = await Promise.all([
                getgroupbyid(id),
                getgroupmembers(id),
            ]);
            const g = groupRes.data.group;
            setGroup(g);
            setNameDraft(g.name);
            setDescriptionDraft(g.description || "");
            setPromptDraft(g.prompt || "");

            const memberList = (membersRes.data.group?.contacts || []).map((gc) => gc.contact);
            setMembers(memberList);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load group");
        } finally {
            setDetailLoading(false);
        }
    };

    const selectGroup = (id) => {
        setSelectedId(id);
        setEditingName(false);
        setEditingDescription(false);
        setEditingPrompt(false);
        setShowAddMember(false);
        loadGroupDetail(id);
    };

    const refreshDetail = () => {
        if (selectedId) loadGroupDetail(selectedId);
    };

    // ---- create group ----
    const addGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error("Please enter a group name");
            return;
        }
        setCreating(true);
        try {
            const res = await creategroup(newGroupName.trim());
            toast.success(res.data.message || "Group created successfully");
            setNewGroupName("");
            setShowAddDialog(false);
            await loadGroups();
            if (res.data.group?.id) selectGroup(res.data.group.id);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create group");
        } finally {
            setCreating(false);
        }
    };

    // ---- delete group ----
    const confirmDelete = async () => {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            const res = await deletegroup(id);
            toast.success(res.data.message || "Group deleted successfully");
            setGroups((prev) => prev.filter((g) => g.id !== id));
            if (selectedId === id) {
                setSelectedId(null);
                setGroup(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete group");
        }
    };

    // ---- name ----
    const saveName = async () => {
        if (!nameDraft.trim()) {
            toast.error("Group name is required");
            return;
        }
        setSavingName(true);
        try {
            const res = await updategroupname(group.id, nameDraft.trim());
            toast.success(res.data.message || "Group name updated");
            setEditingName(false);
            await loadGroups();
            refreshDetail();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update name");
        } finally {
            setSavingName(false);
        }
    };

    // ---- description ----
    const saveDescription = async () => {
        setSavingDescription(true);
        try {
            const res = await setdescription(group.id, descriptionDraft.trim());
            toast.success(res.data.message || "Description updated");
            setEditingDescription(false);
            refreshDetail();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update description");
        } finally {
            setSavingDescription(false);
        }
    };

    const removeDescription = async () => {
        try {
            const res = await deletedescription(group.id);
            toast.success(res.data.message || "Description removed");
            setEditingDescription(false);
            refreshDetail();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove description");
        }
    };

    // ---- system prompt ----
    const savePrompt = async () => {
        setSavingPrompt(true);
        try {
            const res = await setgroupprompt(group.id, promptDraft.trim());
            toast.success(res.data.message || "System prompt updated");
            setEditingPrompt(false);
            refreshDetail();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update system prompt");
        } finally {
            setSavingPrompt(false);
        }
    };

    const removePrompt = async () => {
        try {
            const res = await deletegroupprompt(group.id);
            toast.success(res.data.message || "System prompt removed");
            setEditingPrompt(false);
            refreshDetail();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove system prompt");
        }
    };

    // ---- members ----
    const toggleAddMember = async () => {
        if (!showAddMember) {
            try {
                const res = await getcontacts();
                setAllContacts(res.data.contacts || []);
            } catch (err) {
                setAllContacts([]);
            }
        }
        setShowAddMember((prev) => !prev);
        setSelectedContactId("");
    };

    const addMember = async () => {
        if (!selectedContactId) {
            toast.error("Please select a contact");
            return;
        }
        setAddingMember(true);
        try {
            const res = await addcontacttogroup(Number(selectedContactId), group.name);
            toast.success(res.data.message || "Contact added to group");
            setSelectedContactId("");
            setShowAddMember(false);
            refreshDetail();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add contact");
        } finally {
            setAddingMember(false);
        }
    };

    const removeMember = async (contactId) => {
        try {
            const res = await removecontactfromgroup(contactId, group.name);
            toast.success(res.data.message || "Contact removed from group");
            refreshDetail();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove contact");
        }
    };

    const [togglingMode, setTogglingMode] = useState(false);

    // ---- AI mode toggle ----
    const toggleAiMode = async () => {
        setTogglingMode(true);
        try {
            const res = await tooglegroupmodebyid(group.id, !group.aiEnabled);
            toast.success(res.data.message || "AI mode updated");
            refreshDetail();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to toggle AI mode");
        } finally {
            setTogglingMode(false);
        }
    };

    const memberIds = new Set(members.map((m) => m.id));
    const availableContacts = allContacts.filter((c) => !memberIds.has(c.id));

    return (
        <div className="flex h-full w-full overflow-hidden bg-[#EAF7F4]">

            {/* ---------- LEFT: group grid ---------- */}
            <div className={`flex w-full flex-col overflow-hidden md:w-[380px] md:flex-none lg:border-r lg:border-[#E5E7EB] ${selectedId ? "hidden md:flex" : "flex"}`}>

                {/* Header */}
                <div className="flex items-center justify-between bg-[#0B6F60] px-5 py-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <Users size={18} /> Groups
                    </h2>
                  
                </div>

                {/* Search */}
                <div className="px-4 py-3">
                    <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
                        <Search size={14} className="text-[#9CA3AF]" />
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF]"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {listLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA894]/20 border-t-[#0EA894]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {/* Create-group tile, always first */}
                            <button
                                onClick={() => setShowAddDialog(true)}
                                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#0EA894]/40 bg-white py-6 text-[#0B6F60] shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition hover:border-[#0EA894] hover:bg-[#0EA894]/5"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0EA894]/10">
                                    <Plus size={18} />
                                </div>
                                <span className="text-xs font-medium">Create Group</span>
                            </button>

                            {filteredGroups.length === 0 ? (
                                <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-8 text-center">
                                    <Users size={28} className="text-[#0EA894]/40" />
                                    <p className="text-xs text-[#6B7280]">
                                        {searchTerm ? "No groups match your search." : "No groups yet."}
                                    </p>
                                </div>
                            ) : (
                                filteredGroups.map((g, i) => {
                                    const isActive = selectedId === g.id;
                                    return (
                                        <div
                                            key={g.id}
                                            onClick={() => selectGroup(g.id)}
                                            className={`group relative flex cursor-pointer flex-col gap-2 rounded-2xl border bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] ${
                                                isActive ? "border-[#0EA894] ring-1 ring-[#0EA894]" : "border-transparent"
                                            }`}
                                        >
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setPendingDeleteId(g.id); }}
                                                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-[#9CA3AF] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                            >
                                                <X size={12} />
                                            </button>

                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                                {g.name?.charAt(0).toUpperCase() || "?"}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-[#1F2937]">{g.name}</p>
                                                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#9CA3AF]">
                                                    {g.prompt && <Sparkles size={10} className="flex-none text-[#0EA894]" />}
                                                    {g.prompt ? "AI prompt set" : "No prompt"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ---------- RIGHT: selected group detail ---------- */}
            <div className={`min-h-0 flex-1 flex-col overflow-y-auto bg-[#EAF7F4] ${selectedId ? "flex" : "hidden md:flex"}`}>
                {!selectedId ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                            <Users size={36} className="text-[#0EA894]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#1F2937]">Select a group</h3>
                        <p className="text-sm text-[#6B7280]">Choose a group from the list to view and edit its details.</p>
                    </div>
                ) : detailLoading || !group ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA894]/20 border-t-[#0EA894]" />
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:px-8 lg:px-10">

                        {/* header */}
                        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                            {editingName ? (
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => { setSelectedId(null); setGroup(null); }}
                                        className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[#374151] transition hover:bg-[#F3F4F6] md:hidden"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <input
                                        type="text"
                                        value={nameDraft}
                                        onChange={(e) => setNameDraft(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => e.key === "Enter" && saveName()}
                                        className="h-9 flex-1 rounded-lg border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#0EA894]"
                                    />
                                    <button onClick={saveName} disabled={savingName} className="rounded-lg bg-[#0B6F60] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B8A79] disabled:opacity-60">
                                        {savingName ? "Saving..." : "Save"}
                                    </button>
                                    <button onClick={() => { setEditingName(false); setNameDraft(group.name); }} className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6]">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setSelectedId(null); setGroup(null); }}
                                            className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[#374151] transition hover:bg-[#F3F4F6] md:hidden"
                                        >
                                            <ArrowLeft size={16} />
                                        </button>
                                        <h2 className="text-lg font-semibold text-[#1F2937]">{group.name}</h2>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={toggleAiMode}
                                            disabled={togglingMode}
                                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
                                                group.aiEnabled ? "bg-[#0EA894]/10 text-[#0B6F60]" : "bg-gray-100 text-[#6B7280]"
                                            }`}
                                        >
                                            <span className={`h-2 w-2 rounded-full ${group.aiEnabled ? "bg-[#0EA894]" : "bg-[#9CA3AF]"}`} />
                                            {togglingMode ? "Updating..." : group.aiEnabled ? "AI On" : "AI Off"}
                                        </button>
                                        <button onClick={() => setEditingName(true)} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:bg-[#F3F4F6]">
                                            <Pencil size={12} /> Rename
                                        </button>
                                        <button onClick={() => setPendingDeleteId(group.id)} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* description + system prompt side by side on larger screens */}
                        <div className="grid gap-4 md:grid-cols-2">

                            {/* description */}
                            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-[#1F2937]">Description</h3>
                                    <button onClick={() => setEditingDescription((p) => !p)} className="text-xs font-medium text-[#0B6F60] hover:text-[#0EA894]">
                                        {editingDescription ? "Close" : group.description ? "Edit" : "+ Add"}
                                    </button>
                                </div>

                                {editingDescription ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={descriptionDraft}
                                            onChange={(e) => setDescriptionDraft(e.target.value)}
                                            placeholder="Describe what this group is for..."
                                            rows={3}
                                            autoFocus
                                            className="w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-sm text-[#1F2937] outline-none focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                                        />
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button onClick={saveDescription} disabled={savingDescription} className="rounded-lg bg-[#0B6F60] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B8A79] disabled:opacity-60">
                                                {savingDescription ? "Saving..." : "Save"}
                                            </button>
                                            <button onClick={() => { setEditingDescription(false); setDescriptionDraft(group.description || ""); }} className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6]">
                                                Cancel
                                            </button>
                                            {group.description && (
                                                <button onClick={removeDescription} className="text-xs font-medium text-red-500 hover:underline">Remove</button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className={`text-sm ${group.description ? "text-[#374151]" : "text-[#9CA3AF]"}`}>
                                        {group.description || "No description set."}
                                    </p>
                                )}
                            </div>

                            {/* system prompt */}
                            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-[#1F2937]">System Prompt</h3>
                                    <button onClick={() => setEditingPrompt((p) => !p)} className="text-xs font-medium text-[#0B6F60] hover:text-[#0EA894]">
                                        {editingPrompt ? "Close" : group.prompt ? "Edit" : "+ Add"}
                                    </button>
                                </div>

                                {editingPrompt ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={promptDraft}
                                            onChange={(e) => setPromptDraft(e.target.value)}
                                            placeholder="How should the AI respond to contacts in this group?"
                                            rows={6}
                                            autoFocus
                                            className="w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-sm text-[#1F2937] outline-none focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                                        />
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button onClick={savePrompt} disabled={savingPrompt} className="rounded-lg bg-[#0B6F60] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B8A79] disabled:opacity-60">
                                                {savingPrompt ? "Saving..." : "Save"}
                                            </button>
                                            <button onClick={() => { setEditingPrompt(false); setPromptDraft(group.prompt || ""); }} className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6]">
                                                Cancel
                                            </button>
                                            {group.prompt && (
                                                <button onClick={removePrompt} className="text-xs font-medium text-red-500 hover:underline">Remove</button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className={`whitespace-pre-wrap text-sm ${group.prompt ? "text-[#374151]" : "text-[#9CA3AF]"}`}>
                                        {group.prompt || "No system prompt set. This group has no custom AI behavior."}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* members */}
                        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-[#1F2937]">Members ({members.length})</h3>
                                <button onClick={toggleAddMember} className="text-xs font-medium text-[#0B6F60] hover:text-[#0EA894]">
                                    {showAddMember ? "Close" : "+ Add Member"}
                                </button>
                            </div>

                            {showAddMember && (
                                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                                    <select
                                        value={selectedContactId}
                                        onChange={(e) => setSelectedContactId(e.target.value)}
                                        className="h-9 flex-1 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#1F2937] outline-none focus:border-[#0EA894]"
                                    >
                                        <option value="">Select a contact</option>
                                        {availableContacts.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name || c.waId}</option>
                                        ))}
                                    </select>
                                    <button onClick={addMember} disabled={addingMember} className="rounded-lg bg-[#0B6F60] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B8A79] disabled:opacity-60">
                                        {addingMember ? "Adding..." : "Add"}
                                    </button>
                                    <button onClick={toggleAddMember} className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6]">
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {members.length === 0 ? (
                                    <p className="text-sm text-[#9CA3AF]">No members in this group yet.</p>
                                ) : (
                                    members.map((m) => (
                                        <span key={m.id} className="flex items-center gap-1.5 rounded-full bg-[#0EA894]/10 py-1.5 pl-3 pr-2 text-xs font-medium text-[#0B6F60]">
                                            {m.name || m.waId}
                                            <button onClick={() => removeMember(m.id)} className="flex h-4 w-4 items-center justify-center rounded-full transition hover:bg-[#0EA894]/20">
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* create-group dialog */}
            {showAddDialog && (
                <div onClick={() => setShowAddDialog(false)} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                        <h3 className="mb-3 text-base font-semibold text-[#1F2937]">Add Group</h3>
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addGroup()}
                            autoFocus
                            className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#1F2937] outline-none focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={() => setShowAddDialog(false)} className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6]">
                                Cancel
                            </button>
                            <button onClick={addGroup} disabled={creating} className="rounded-xl bg-[#0B6F60] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B8A79] disabled:opacity-60">
                                {creating ? "Saving..." : "Save Group"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={pendingDeleteId !== null}
                message="Are you sure you want to delete this group? This also removes all its members."
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />

        </div>
    );
}

export default Groups;