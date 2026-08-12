import { useState, useEffect } from "react";
import "../css/groups.css";
import {
    getallgroups,
    getgroupbyid,
    getgroupmembers,
    creategroup,
    deletegroup,
    addcontacttogroup,
    removecontactfromgroup,
    setdescription,
    deletedescription,
    setgroupprompt,
    deletegroupprompt,
    updategroupname,
    tooglegroupmodebyid
} from "../api/groups";
import { getcontacts } from "../api/contacts";
import toast from "react-hot-toast";
import ConfirmDialog from "../component/ConfirmDailog";

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
        <div className="groups-page">

            {/* ---------- LEFT: group list ---------- */}
            <div className="groups-left">
                <div className="groups-left-header">
                    <h2>Groups</h2>
                    <button className="groups-add-btn" onClick={() => setShowAddDialog(true)}>+ Add</button>
                </div>

                <div className="groups-search-wrap">
                    <input
                        type="text"
                        placeholder="Search groups..."
                        className="groups-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="groups-search-icon">🔍</span>
                </div>

                <div className="groups-list">
                    {listLoading ? (
                        <div className="groups-list-empty">Loading...</div>
                    ) : filteredGroups.length === 0 ? (
                        <div className="groups-list-empty">
                            {searchTerm ? "No groups match your search." : "No groups yet. Create one to get started."}
                        </div>
                    ) : (
                        filteredGroups.map((g) => (
                            <div
                                key={g.id}
                                className={`groups-list-item ${selectedId === g.id ? "active" : ""}`}
                                onClick={() => selectGroup(g.id)}
                            >
                                <div className="groups-list-item-info">
                                    <span className="groups-list-item-name">{g.name}</span>
                                    <span className="groups-list-item-sub">
                                        {g.prompt ? "AI prompt set" : "No prompt"}
                                    </span>
                                </div>
                                <button
                                    className="groups-list-item-delete"
                                    onClick={(e) => { e.stopPropagation(); setPendingDeleteId(g.id); }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ---------- RIGHT: selected group detail ---------- */}
            <div className="groups-right">
                {!selectedId ? (
                    <div className="groups-right-empty">
                        <div className="groups-right-empty-icon">👥</div>
                        <h3>Select a group</h3>
                        <p>Choose a group from the list to view and edit its details.</p>
                    </div>
                ) : detailLoading || !group ? (
                    <div className="su-loading"><div className="spinner"></div></div>
                ) : (
                    <>
                        {/* header */}
                        <div className="groups-detail-header">
                            {editingName ? (
                                <div className="groups-inline-edit">
                                    <input
                                        type="text"
                                        value={nameDraft}
                                        onChange={(e) => setNameDraft(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => e.key === "Enter" && saveName()}
                                    />
                                    <button className="groups-save-btn" onClick={saveName} disabled={savingName}>
                                        {savingName ? "Saving..." : "Save"}
                                    </button>
                                    <button className="groups-cancel-btn" onClick={() => { setEditingName(false); setNameDraft(group.name); }}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2>{group.name}</h2>
                                    <div className="groups-detail-header-actions">
                                        <button
                                            className={`groups-ai-toggle-btn ${group.aiEnabled ? "on" : "off"}`}
                                            onClick={toggleAiMode}
                                            disabled={togglingMode}
                                        >
                                            <span className="groups-ai-toggle-dot" />
                                            {togglingMode ? "Updating..." : group.aiEnabled ? "AI On" : "AI Off"}
                                        </button>
                                        <button className="groups-edit-btn" onClick={() => setEditingName(true)}>Rename</button>
                                        <button className="groups-delete-btn" onClick={() => setPendingDeleteId(group.id)}>Delete Group</button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* description */}
                        <div className="groups-section">
                            <div className="groups-section-header">
                                <h3>Description</h3>
                                <button className="groups-section-btn" onClick={() => setEditingDescription((p) => !p)}>
                                    {editingDescription ? "Close" : group.description ? "Edit" : "+ Add"}
                                </button>
                            </div>

                            {editingDescription ? (
                                <div className="groups-section-edit">
                                    <textarea
                                        value={descriptionDraft}
                                        onChange={(e) => setDescriptionDraft(e.target.value)}
                                        placeholder="Describe what this group is for..."
                                        rows={3}
                                        autoFocus
                                    />
                                    <div className="groups-section-actions">
                                        <button className="groups-save-btn" onClick={saveDescription} disabled={savingDescription}>
                                            {savingDescription ? "Saving..." : "Save"}
                                        </button>
                                        <button className="groups-cancel-btn" onClick={() => { setEditingDescription(false); setDescriptionDraft(group.description || ""); }}>
                                            Cancel
                                        </button>
                                        {group.description && (
                                            <button className="groups-remove-link" onClick={removeDescription}>Remove</button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className={group.description ? "groups-text" : "groups-text-empty"}>
                                    {group.description || "No description set."}
                                </p>
                            )}
                        </div>

                        {/* system prompt */}
                        <div className="groups-section">
                            <div className="groups-section-header">
                                <h3>System Prompt</h3>
                                <button className="groups-section-btn" onClick={() => setEditingPrompt((p) => !p)}>
                                    {editingPrompt ? "Close" : group.prompt ? "Edit" : "+ Add"}
                                </button>
                            </div>

                            {editingPrompt ? (
                                <div className="groups-section-edit">
                                    <textarea
                                        value={promptDraft}
                                        onChange={(e) => setPromptDraft(e.target.value)}
                                        placeholder="How should the AI respond to contacts in this group?"
                                        rows={6}
                                        autoFocus
                                    />
                                    <div className="groups-section-actions">
                                        <button className="groups-save-btn" onClick={savePrompt} disabled={savingPrompt}>
                                            {savingPrompt ? "Saving..." : "Save"}
                                        </button>
                                        <button className="groups-cancel-btn" onClick={() => { setEditingPrompt(false); setPromptDraft(group.prompt || ""); }}>
                                            Cancel
                                        </button>
                                        {group.prompt && (
                                            <button className="groups-remove-link" onClick={removePrompt}>Remove</button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className={group.prompt ? "groups-text groups-prompt-text" : "groups-text-empty"}>
                                    {group.prompt || "No system prompt set — this group has no custom AI behavior."}
                                </p>
                            )}
                        </div>

                        {/* members */}
                        <div className="groups-section">
                            <div className="groups-section-header">
                                <h3>Members ({members.length})</h3>
                                <button className="groups-section-btn" onClick={toggleAddMember}>
                                    {showAddMember ? "Close" : "+ Add Member"}
                                </button>
                            </div>

                            {showAddMember && (
                                <div className="groups-section-edit groups-add-member-row">
                                    <select
                                        value={selectedContactId}
                                        onChange={(e) => setSelectedContactId(e.target.value)}
                                    >
                                        <option value="">Select a contact</option>
                                        {availableContacts.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name || c.waId}</option>
                                        ))}
                                    </select>
                                    <button className="groups-save-btn" onClick={addMember} disabled={addingMember}>
                                        {addingMember ? "Adding..." : "Add"}
                                    </button>
                                    <button className="groups-cancel-btn" onClick={toggleAddMember}>Cancel</button>
                                </div>
                            )}

                            <div className="groups-members-row">
                                {members.length === 0 ? (
                                    <p className="groups-text-empty">No members in this group yet.</p>
                                ) : (
                                    members.map((m) => (
                                        <span className="groups-member-pill" key={m.id}>
                                            {m.name || m.waId}
                                            <button onClick={() => removeMember(m.id)}>✕</button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* create-group dialog */}
            {showAddDialog && (
                <div className="overlay" onClick={() => setShowAddDialog(false)}>
                    <div className="groups-add-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3>Add Group</h3>
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addGroup()}
                            autoFocus
                        />
                        <div className="groups-section-actions">
                            <button className="groups-cancel-btn" onClick={() => setShowAddDialog(false)}>Cancel</button>
                            <button className="groups-save-btn" onClick={addGroup} disabled={creating}>
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