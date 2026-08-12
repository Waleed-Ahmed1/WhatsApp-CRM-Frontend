import { useEffect, useState } from "react";
import '../css/groups.css'
import { getallgroups, getgroupbyid, creategroup } from "../api/groups";
import toast from "react-hot-toast";

function Groups() {

    const [allgroups, setallgroups] = useState([])
    const [loading, setloading] = useState(true)
    const [selectedGroupId, setSelectedGroupId] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [groupLoading, setGroupLoading] = useState(false)

    // Add Group dialog
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [newName, setNewName] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newPrompt, setNewPrompt] = useState("")
    const [saving, setSaving] = useState(false)

    const getallGroups = async () => {
        try {
            const res = await getallgroups()
            setallgroups(res.data.groups)
        } catch (err) {
            toast.error(err.response?.data?.message || "Groups Not Fetched")
        } finally {
            setloading(false)
        }
    }
    useEffect(() => {
        getallGroups()
    }, [])

    const getgroupbyID = async (id, name) => {
        setSelectedGroupId(id);
        setGroupLoading(true);
        try {
            const res = await getgroupbyid(id)
            setSelectedGroup(res.data.group);
        } catch (err) {
            toast.error(err.response?.data?.message || `Group ${name} Not Fetched`)
        } finally {
            setGroupLoading(false);
        }
    }

    const handleAddGroup = async () => {
        if (!newName.trim()) {
            toast.error("Please enter a group name");
            return;
        }
        setSaving(true)
        try {
            const res = await creategroup(newName, newDescription, newPrompt)
            toast.success(res.data.message || "Group Added Successfully")
            setShowAddDialog(false)
            setNewName("")
            setNewDescription("")
            setNewPrompt("")
            getallGroups()
        } catch (err) {
            toast.error(err.response?.data?.message || "Group added Failed !")
        } finally {
            setSaving(false)
        }
    }



    return (
        <div className={`main ${selectedGroupId ? "group-selected" : ""}`}>
            <div className="group-section">

                <div className="group-section-header">
                    <h2>Groups</h2>
                    <span className="group-count">{allgroups.length} groups</span>
                </div>

                {/* Add Group box */}
                <div className="group-add-box">
                    <button className="group-add-btn" onClick={() => setShowAddDialog(true)}>
                        + Add Group
                    </button>
                </div>

                <div className="group-list">
                    {loading ? (
                        <p className="group-loading-text">Loading groups...</p>
                    ) : allgroups.length === 0 ? (
                        <p className="group-empty-text">No groups yet.</p>
                    ) : (
                        allgroups.map((g) => (
                            <div
                                key={g.id}
                                className={`group-item ${selectedGroupId === g.id ? "group-item-active" : ""}`}
                                onClick={() => getgroupbyID(g.id, g.name)}
                            >
                                <div className="group-avatar">
                                    {g.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="group-info">
                                    <div className="group-name">{g.name}</div>
                                    <div className="group-desc">
                                        {g.description || "No description"}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            <div className="group-details">

                {selectedGroupId && (
                    <button
                        className="group-back-btn"
                        onClick={() => setSelectedGroupId(null)}
                    >
                        ← Back to Groups
                    </button>
                )}

                {!selectedGroupId ? (
                    <div className="group-details-empty">
                        <div className="group-details-empty-icon">◎</div>
                        <h3>Select a group</h3>
                        <p>
                            Select a group from the left to view its details.
                        </p>
                    </div>
                ) : groupLoading ? (
                    <div className="group-details-empty">
                        <div className="group-details-loader"></div>
                        <p>Loading group details...</p>
                    </div>
                ) : selectedGroup ? (

                    <div className="group-details-content">

                        {/* Header */}
                        <div className="group-details-header">

                            <div className="group-details-title-area">

                                <div className="group-details-avatar">
                                    {selectedGroup.name?.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2>{selectedGroup.name}</h2>
                                    <span className="group-details-id">
                                        Group ID: #{selectedGroup.id}
                                    </span>
                                </div>

                            </div>

                            <div className="group-status">
                                Active
                            </div>

                        </div>


                        {/* Description */}
                        <div className="group-detail-section">

                            <div className="group-detail-section-title">
                                <span>Group Information</span>
                            </div>

                            <div className="group-info-grid">

                                <div className="group-info-box">
                                    <span className="group-info-label">
                                        Group ID
                                    </span>

                                    <span className="group-info-value">
                                        #{selectedGroup.id}
                                    </span>
                                </div>


                                <div className="group-info-box">
                                    <span className="group-info-label">
                                        Group Name
                                    </span>

                                    <span className="group-info-value">
                                        {selectedGroup.name || "-"}
                                    </span>
                                </div>


                                <div className="group-info-box group-info-full">
                                    <span className="group-info-label">
                                        Description
                                    </span>

                                    <span className="group-info-value">
                                        {selectedGroup.description || "No description provided"}
                                    </span>
                                </div>

                            </div>

                        </div>


                        <div className="group-detail-section">

                            <div className="group-detail-section-title">
                                <span>AI Prompt</span>
                            </div>

                            <div className="group-prompt-box">

                                {selectedGroup.prompt ? (
                                    <p>{selectedGroup.prompt}</p>
                                ) : (
                                    <span className="group-prompt-empty">
                                        No custom AI prompt configured for this group.
                                    </span>
                                )}

                            </div>

                        </div>


                        {/* Dates */}
                        <div className="group-detail-section">

                            <div className="group-detail-section-title">
                                <span>System Information</span>
                            </div>

                            <div className="group-info-grid">

                                <div className="group-info-box">
                                    <span className="group-info-label">
                                        Created At
                                    </span>

                                    <span className="group-info-value">
                                        {selectedGroup.createdAt
                                            ? new Date(selectedGroup.createdAt).toLocaleString()
                                            : "-"
                                        }
                                    </span>
                                </div>


                                <div className="group-info-box">
                                    <span className="group-info-label">
                                        Last Updated
                                    </span>

                                    <span className="group-info-value">
                                        {selectedGroup.updatedAt
                                            ? new Date(selectedGroup.updatedAt).toLocaleString()
                                            : "-"
                                        }
                                    </span>
                                </div>

                            </div>

                        </div>


                        <div className="group-detail-actions">

                            <button className="group-action-btn">
                                Edit Group
                            </button>

                            <button className="group-action-btn danger">
                                Delete Group
                            </button>

                        </div>

                    </div>

                ) : null}

            </div>

            {showAddDialog && (
                <div className="overlay" onClick={() => setShowAddDialog(false)}>
                    <div className="add-group-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3 className="dialog-title">Add Group</h3>

                        <div className="dialog-field">
                            <label className="dialog-label">Group Name</label>
                            <input
                                type="text"
                                placeholder="e.g. VIP Customers"
                                className="dialog-input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>

                        <div className="dialog-field">
                            <label className="dialog-label">Description</label>
                            <textarea
                                placeholder="What is this group for? (optional)"
                                className="dialog-textarea"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </div>

                        <div className="dialog-field">
                            <label className="dialog-label">AI Prompt</label>
                            <textarea
                                placeholder="Custom instructions for the bot in this group (optional)"
                                className="dialog-textarea"
                                value={newPrompt}
                                onChange={(e) => setNewPrompt(e.target.value)}
                            />
                        </div>

                        <div className="dialog-actions">
                            <button className="dialog-cancel-btn" onClick={() => setShowAddDialog(false)}>Cancel</button>
                            <button className="dialog-save-btn" onClick={handleAddGroup}>
                                {saving ? "Saving..." : "Save Group"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>


    )

}

export default Groups;