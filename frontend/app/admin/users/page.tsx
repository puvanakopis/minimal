'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Shield,
  User as UserIcon,
  Trash2,
  Ban,
  CheckCircle2,
  Search,
  Edit,
  X,
  AlertCircle,
  MailCheck,
  MailX
} from 'lucide-react';
import { User, AdminUpdateUserPayload } from '@/interfaces';
import AdminLoading from '../loading';
import { useAuth } from '@/context/AuthContext';
import { notify } from '@/helper/toast';
import { userService } from '@/services';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  // Edit modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<AdminUpdateUserPayload>({});
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await userService.adminGetUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch users';
      notify.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }


  const handleToggleBlock = async (userItem: User) => {
    const isSelf = userItem.email === currentUser?.email;
    if (isSelf) {
      notify.warning('Cannot block your own account.');
      return;
    }

    const willBlock = !userItem.blocked;
    const actionLabel = willBlock ? 'BLOCK' : 'UNBLOCK';
    if (!confirm(`Are you sure you want to ${actionLabel} ${userItem.email}? ${willBlock ? 'They will no longer be able to log in.' : 'They will be allowed to log in again.'}`)) {
      return;
    }

    try {
      const res = await userService.adminToggleBlockUser(userItem.id, willBlock);
      if (res.success) {
        notify.success(willBlock ? 'User blocked successfully' : 'User unblocked successfully');
        setUsers((prev) =>
          prev.map((u) => (u.id === userItem.id ? { ...u, blocked: willBlock } : u))
        );
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : `Failed to ${actionLabel.toLowerCase()} user`;
      notify.error(errorMsg);
    }
  };

  const handleDeleteUser = async (id: string | number, email: string) => {
    if (email === currentUser?.email) {
      notify.warning('Cannot delete your own account.');
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete user ${email}? This cannot be undone.`)) return;

    try {
      const res = await userService.adminDeleteUser(id);
      if (res.success) {
        notify.success(`User ${email} successfully deleted.`);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete user';
      notify.error(errorMsg);
    }
  };

  const openEditModal = (userItem: User) => {
    setEditingUser(userItem);
    setEditFormData({
      firstName: userItem.firstName || '',
      lastName: userItem.lastName || '',
      blocked: !!userItem.blocked,
      emailVerified: !!userItem.emailVerified,
      phoneNumber: userItem.phoneNumber || '',
      shippingAddress: userItem.shippingAddress || '',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const isSelf = editingUser.email === currentUser?.email;
    if (isSelf && editFormData.blocked) {
      notify.warning('You cannot block your own account.');
      return;
    }

    setSavingEdit(true);
    try {
      const res = await userService.adminUpdateUser(editingUser.id, editFormData);
      if (res.success && res.data) {
        notify.success('User updated successfully');
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? res.data! : u))
        );
        setEditingUser(null);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update user';
      notify.error(errorMsg);
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        `${u.firstName} ${u.lastName} ${u.email} ${u.phoneNumber || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || u.role?.toLowerCase() === roleFilter;

      const isBlocked = !!u.blocked;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'blocked' && isBlocked) ||
        (statusFilter === 'active' && !isBlocked);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">User Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            View all accounts, block login access, or edit profile records
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-[#e7f1f3] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
            aria-label="Filter users by role"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'blocked')}
            aria-label="Filter users by status"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl border border-[#e7f1f3] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7f1f3] bg-[#fbfdfe]">
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">User</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Email</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Email Verified</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Role</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Account Status</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Joined</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-xs">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((userItem) => {
                  const isSelf = userItem.email === currentUser?.email;
                  const isBlocked = !!userItem.blocked;

                  return (
                    <tr
                      key={userItem.id}
                      className={`border-b border-gray-100 hover:bg-[#fcfefe] transition-all duration-150 ${isBlocked ? 'bg-rose-50/20' : ''
                        }`}
                    >
                      {/* USER NAME */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${userItem.role === 'admin'
                                ? 'bg-brand-teal/15 text-brand-teal border border-brand-teal/20'
                                : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            {userItem.role === 'admin' ? <Shield size={16} /> : <UserIcon size={16} />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#1a1a1a] block">
                              {userItem.firstName} {userItem.lastName}
                              {isSelf && (
                                <span className="text-[9px] font-semibold text-brand-teal bg-brand-teal/10 px-1.5 py-0.5 rounded ml-1.5">
                                  YOU
                                </span>
                              )}
                            </span>
                            {userItem.phoneNumber && (
                              <span className="text-[11px] text-gray-400 block">{userItem.phoneNumber}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="p-4">
                        <span className="text-xs text-gray-600">{userItem.email}</span>
                      </td>

                      {/* EMAIL VERIFIED */}
                      <td className="p-4">
                        {userItem.emailVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <MailCheck size={11} /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            <MailX size={11} /> No
                          </span>
                        )}
                      </td>

                      {/* ROLE */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${userItem.role === 'admin'
                              ? 'bg-brand-teal text-white shadow-xs'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {userItem.role === 'admin' && <Shield size={10} />}
                          {userItem.role || 'user'}
                        </span>
                      </td>

                      {/* STATUS (ACTIVE / BLOCKED) */}
                      <td className="p-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            <Ban size={11} /> Blocked (No Login)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} /> Active
                          </span>
                        )}
                      </td>

                      {/* JOINED */}
                      <td className="p-4 text-xs text-gray-500">
                        {userItem.createdAt
                          ? new Date(userItem.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                          : 'N/A'}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* EDIT BUTTON */}
                          <button
                            type="button"
                            onClick={() => openEditModal(userItem)}
                            className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-brand-teal hover:border-brand-teal hover:bg-brand-teal/5 transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit size={14} />
                          </button>

                          {/* BLOCK / UNBLOCK BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleToggleBlock(userItem)}
                            disabled={isSelf}
                            className={`size-8 rounded-lg flex items-center justify-center border transition-colors ${isSelf
                                ? 'opacity-30 cursor-not-allowed border-gray-200 text-gray-400'
                                : isBlocked
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                  : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                              }`}
                            title={
                              isSelf
                                ? 'Cannot block yourself'
                                : isBlocked
                                  ? 'Unblock user (allow login)'
                                  : 'Block user (prevent login)'
                            }
                          >
                            {isBlocked ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                            disabled={isSelf}
                            className={`size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-500 hover:bg-rose-50 transition-colors ${isSelf ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            title={isSelf ? 'Cannot delete yourself' : 'Delete User'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Edit User</h3>
                <p className="text-xs text-gray-500">{editingUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                aria-label="Close modal"
                className="size-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.lastName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editFormData.phoneNumber || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Shipping Address
                </label>
                <textarea
                  rows={2}
                  value={editFormData.shippingAddress || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, shippingAddress: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal"
                  placeholder="Address details..."
                />
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Block Login Status
                </label>
                <select
                  value={editFormData.blocked ? 'blocked' : 'active'}
                  disabled={editingUser.email === currentUser?.email}
                  onChange={(e) => setEditFormData({ ...editFormData, blocked: e.target.value === 'blocked' })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="active">Active (Allowed)</option>
                  <option value="blocked">Blocked (No Login)</option>
                </select>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emailVerifiedCheckbox"
                  checked={!!editFormData.emailVerified}
                  onChange={(e) => setEditFormData({ ...editFormData, emailVerified: e.target.checked })}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
                <label htmlFor="emailVerifiedCheckbox" className="text-xs text-gray-700 font-medium cursor-pointer">
                  Email Verified
                </label>
              </div>

              {editingUser.email === currentUser?.email && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-800">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                  <span>You are editing your own account. Blocked status modifications are disabled for safety.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
