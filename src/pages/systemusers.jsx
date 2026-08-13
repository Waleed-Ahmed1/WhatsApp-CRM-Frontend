import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getusers, deleteusers } from "../api/users";
import ConfirmDialog from "../component/ConfirmDailog";
import '../css/systemusers.css'

function SystemUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setError(false);
            try {
                const res = await getusers();
                setUsers(res.data.users || []);
            } 
            catch (err) {
                toast.error("Failed to load users");
                setError(true);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => { setPendingDeleteId(id); };

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

    const cancelDelete = () => { setPendingDeleteId(null); };

    if (loading) {
        return <div className="su-loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="su-page">
            <div className="su-header">
                <div>
                    <h2 className="su-title">System Users</h2>
                    <p className="su-subtitle">Manage admin and staff accounts</p>
                </div>
                <div className="su-badge"><span className="su-badge-dot" />{users.length} users</div>
            </div>

            <div className="su-card">
                <div className="su-table-wrapper">
                    <table className="su-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td className="su-email">{u.email}</td>
                                    <td><span className="su-role-badge">{u.role}Admin</span></td>
                                    <td className="su-action">
                                        <button className="su-delete-btn" onClick={() => handleDelete(u.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog open={pendingDeleteId !== null} message="Are you sure you want to delete this user?" onConfirm={confirmDelete} onCancel={cancelDelete} />

            {error && (
                <div className="su-error-wrap"><p className="su-error-text">Failed to load users</p></div>
            )}
        </div>
    );
}

export default SystemUsers;