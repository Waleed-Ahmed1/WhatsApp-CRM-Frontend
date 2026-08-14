import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getusers, deleteusers } from "../api/users";
import ConfirmDialog from "../component/ConfirmDailog";
import { Users, MoreVertical, Trash2, Plus, AlertCircle } from "lucide-react";

// Rotates through your teal-family + a few complementary accents,
// same spirit as the reference's varied pastel avatar colors
const AVATAR_COLORS = [
    "bg-[#0EA894]", "bg-[#0B6F60]", "bg-[#F59E0B]", "bg-[#8B5CF6]",
    "bg-[#EC4899]", "bg-[#3B82F6]", "bg-[#10B981]", "bg-[#F97316]",
];

function SystemUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
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

    const handleDelete = (id) => { setOpenMenuId(null); setPendingDeleteId(id); };

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
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#EAF7F4]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0EA894]/20 border-t-[#0EA894]" />
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-y-auto bg-[#EAF7F4] px-4 py-6 sm:px-8">

            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-[#0B6F60]">System Users</h2>
                    <p className="text-sm text-[#6B7280]">{users.length} {users.length === 1 ? "user" : "users"} total</p>
                </div>
              
            </div>

            {/* Grid */}
            {users.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <Users size={32} className="text-[#0EA894]/40" />
                    <p className="text-sm text-[#6B7280]">No users yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {users.map((u, i) => (
                        <div
                            key={u.id}
                            className="relative flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition hover:shadow-[0_6px_16px_rgba(0,0,0,0.09)]"
                        >
                            <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-full text-sm font-semibold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                {u.name?.charAt(0).toUpperCase() || "?"}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-semibold text-[#1F2937]">{u.name}</h3>
                                <p className="truncate text-xs text-[#9CA3AF]">{u.email}</p>
                                <span className="mt-1 inline-block rounded-full bg-[#0EA894]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#0B6F60]">
                                    {u.role}
                                </span>
                            </div>

                            <div className="relative flex-none">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#374151]"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {openMenuId === u.id && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                        <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={pendingDeleteId !== null}
                message="Are you sure you want to delete this user?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            {error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle size={16} />
                    Failed to load system users
                </div>
            )}
        </div>
    );
}

export default SystemUsers;