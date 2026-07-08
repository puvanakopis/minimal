'use client';

import { useEffect, useState } from 'react';
import { Shield, User, Trash2 } from 'lucide-react';
import { User as DbUser } from '@/lib/db';
import AdminLoading from '../loading';

type UserSession = Omit<DbUser, 'passwordHash' | 'salt'>;

export default function AdminUsers() {
  const [users, setUsers] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  async function fetchCurrentUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUserEmail(data.user.email);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleToggle = async (userItem: UserSession) => {
    if (userItem.email === currentUserEmail) {
      alert('Cannot change your own role.');
      return;
    }

    const newRole = userItem.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userItem.id, role: newRole }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update user role');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (email === currentUserEmail) {
      alert('Cannot delete your own account.');
      return;
    }

    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">Users</h1>
        <p className="text-xs text-gray-500 mt-1">Manage user roles, revoke admin rights, and delete customer records</p>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl border border-[#e7f1f3] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7f1f3] bg-off-white">
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Name</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Email</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Role</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Joined</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => {
                const isSelf = userItem.email === currentUserEmail;
                return (
                  <tr key={userItem.id} className="border-b border-gray-100 hover:bg-off-white/50 transition-all duration-150">
                    <td className="p-4 flex items-center gap-3">
                      <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        userItem.role === 'admin' ? 'bg-brand-teal/10 text-brand-teal' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {userItem.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                      </div>
                      <span className="text-xs font-bold text-[#1a1a1a]">
                        {userItem.firstName} {userItem.lastName} {isSelf && <span className="text-[9px] text-brand-teal ml-1">(you)</span>}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-600">{userItem.email}</td>
                    <td className="p-4">
                      <span
                        onClick={() => !isSelf && handleRoleToggle(userItem)}
                        className={`inline-block text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded cursor-pointer ${
                          userItem.role === 'admin'
                            ? 'bg-brand-teal text-white hover:bg-brand-teal/90'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } ${isSelf ? 'pointer-events-none opacity-80' : ''}`}
                        title={isSelf ? undefined : 'Click to toggle role'}
                      >
                        {userItem.role || 'user'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(userItem.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                        disabled={isSelf}
                        className={`size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-500 transition-colors ${
                          isSelf ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        title={isSelf ? 'Cannot delete yourself' : 'Delete User'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
