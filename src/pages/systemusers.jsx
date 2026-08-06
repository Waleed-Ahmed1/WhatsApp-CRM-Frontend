import React, { use, useState } from "react";
import Sidebar from "../component/Sidebar";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getusers,deleteusers } from "../api/users";
import ConfirmDialog from "../component/ConfirmDailog";
import './login.css'

function SystemUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState([true]);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setError(false);
            try {
                const res = await getusers();
                setUsers(res.data.users);
            } catch (err) {
                toast.error("Failed to load users");
                setError(true)
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        setPendingDeleteId(id);
    };
    const confirmDelete = async () => {
        const id = pendingDeleteId;
        setPendingDeleteId(null);

        try {
            await deleteusers(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            toast.success("User deleted");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const cancelDelete = () => {
        setPendingDeleteId(null);
    };


    if (loading) {
        return <div style={{ background: "#0b0d12", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="spinner"></div>
                </div>
    }

    return (
        <div style={{ background: "#0b0d12", minHeight: "100vh", padding: 24 }}>

            {/* Header bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <h2 style={{ color: "#fff", fontSize: 20, margin: 0, fontFamily:"monospace" }}>System Users</h2>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 0",fontFamily:"sans-serif" }}>
                        Manage admin and staff accounts
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(37,211,102,0.1)", color: "#25d366", fontSize: 12, padding: "6px 12px", borderRadius: 20 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#25d366", display: "inline-block" }} />
                    {users.length} users
                </div>
            </div>

            {/* Card container */}
            <div style={{ background: "#141824", border: "1px solid #232838", borderRadius: 12, overflow: "hidden" }}>
                {loading ? (
                    <p style={{ color: "#9aa0ac", padding: 20 }}>Loading users...</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff",fontFamily:"monospace"}}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #232838", textAlign: "left" }}>
                                <th style={{ padding: 14, color: "#9aa0ac", fontSize: 12, fontWeight: 500 }}>ID</th>
                                <th style={{ padding: 14, color: "#9aa0ac", fontSize: 12, fontWeight: 500 }}>Name</th>
                                <th style={{ padding: 14, color: "#9aa0ac", fontSize: 12, fontWeight: 500 }}>Email</th>
                                <th style={{ padding: 14, color: "#9aa0ac", fontSize: 12, fontWeight: 500 }}>Role</th>
                                <th style={{ padding: 14 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} style={{ borderBottom: "1px solid #1c2130" }}>
                                    <td style={{ padding: 14, fontSize: 14 }}>{u.id}</td>
                                    <td style={{ padding: 14, fontSize: 14 }}>{u.name}</td>
                                    <td style={{ padding: 14, fontSize: 14, color: "#9aa0ac" }}>{u.email}</td>
                                    <td style={{ padding: 14 }}>
                                        <span style={{ background: "rgba(37,211,102,0.12)", color: "#25d366", fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: 14, textAlign: "right" }}>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 13 }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <ConfirmDialog
                open={pendingDeleteId !== null}
                message="Are you sure you want to delete this user?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );

}

export default SystemUsers;