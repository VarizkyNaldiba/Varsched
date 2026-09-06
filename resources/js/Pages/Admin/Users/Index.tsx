import { Head, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import {
    Users,
    Search,
    Shield,
    ShieldCheck,
    UserPlus,
    Edit2,
    Trash2,
    X,
    Clock,
    AlertTriangle,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PageProps, User as UserType } from '@/types';

interface PaginationProps {
    data: UserType[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: PaginationProps;
    filters: {
        search?: string;
        role?: string;
    };
}

export default function AdminUsersIndex({ users, filters }: Props) {
    const currentAuthUser = usePage<PageProps>().props.auth.user;
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserType | null>(null);

    // Create User Form
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    // Edit User Form
    const editForm = useForm({
        name: '',
        email: '',
        role: 'user',
        password: '',
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.users.index'),
            { search: searchQuery, role: selectedRole },
            { preserveState: true }
        );
    };

    const handleRoleFilter = (newRole: string) => {
        setSelectedRole(newRole);
        router.get(
            route('admin.users.index'),
            { search: searchQuery, role: newRole || undefined },
            { preserveState: true }
        );
    };

    const handleCreateUser = (e: FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateModalOpen(false);
            },
        });
    };

    const openEditModal = (user: UserType) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            password: '',
        });
    };

    const handleEditUser = (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.patch(route('admin.users.update', editingUser.id), {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleToggleRole = (user: UserType) => {
        if (user.id === currentAuthUser.id) {
            alert('Anda tidak dapat mengubah role akun Anda sendiri.');
            return;
        }
        router.post(route('admin.users.toggle-role', user.id), {}, { preserveScroll: true });
    };

    const handleDeleteUser = (user: UserType) => {
        if (user.id === currentAuthUser.id) {
            alert('Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif.');
            return;
        }
        if (confirm(`Apakah Anda yakin ingin menghapus akun ${user.name} (${user.email})? Seluruh data tugas dan kebiasaannya akan ikut terhapus.`)) {
            router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="font-extrabold text-3xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <span className="p-2 rounded-2xl bg-primary-bg dark:bg-primary-dark/30 text-primary">
                                <Users size={28} strokeWidth={2.5} />
                            </span>
                            <span>Manajemen Akun Pengguna</span>
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Total {users.total} akun terdaftar dalam sistem
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-teal-glow transition cursor-pointer"
                    >
                        <UserPlus size={18} />
                        <span>Tambah Akun Baru</span>
                    </button>
                </div>
            }
        >
            <Head title="Kelola Akun" />

            <div className="py-8 pb-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Search & Filters */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border-[2px] border-primary/20 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-96">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Cari nama atau email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-surface-base dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition cursor-pointer"
                            >
                                Cari
                            </button>
                        </form>

                        <div className="flex items-center gap-2 self-start md:self-auto">
                            <span className="text-xs font-bold text-gray-500">Filter Role:</span>
                            {['', 'admin', 'user'].map((r) => (
                                <button
                                    key={r || 'all'}
                                    onClick={() => handleRoleFilter(r)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                                        selectedRole === r
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                                >
                                    {r || 'Semua'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-card border-[3px] border-primary/20 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-[2px] border-dashed border-primary/20 bg-cream/30 dark:bg-gray-900/40 text-[11px] font-black uppercase text-primary tracking-wider">
                                        <th className="p-4 pl-6">Pengguna</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Statistik</th>
                                        <th className="p-4">Last Login</th>
                                        <th className="p-4">Terdaftar</th>
                                        <th className="p-4 pr-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-400">
                                                Tidak ada pengguna ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-primary-bg/20 dark:hover:bg-primary-dark/10 transition"
                                            >
                                                {/* Name & Email */}
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center text-base shrink-0 shadow-sm">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-extrabold text-gray-900 dark:text-gray-100 truncate">
                                                                {user.name}
                                                                {user.id === currentAuthUser.id && (
                                                                    <span className="ml-2 text-[10px] font-bold text-primary bg-primary-bg dark:bg-primary-dark/40 px-2 py-0.5 rounded-full">
                                                                        Anda
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Role */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {user.role === 'admin' ? (
                                                            <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg bg-coral-light/20 text-coral-dark dark:text-coral-light border border-coral/30">
                                                                <ShieldCheck size={13} /> ADMIN
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg bg-primary-bg text-primary-dark dark:bg-primary-dark/30 dark:text-primary-light border border-primary/20">
                                                                <Shield size={13} /> USER
                                                            </span>
                                                        )}

                                                        {user.id !== currentAuthUser.id && (
                                                            <button
                                                                onClick={() => handleToggleRole(user)}
                                                                title="Ubah Role"
                                                                className="text-[10px] font-bold text-gray-500 hover:text-primary underline cursor-pointer"
                                                            >
                                                                Ganti
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Stats */}
                                                <td className="p-4 text-xs">
                                                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {user.tasks_count ?? 0} Tugas
                                                    </div>
                                                    <div className="text-[11px] text-gray-400">
                                                        {user.habits_count ?? 0} Kebiasaan
                                                    </div>
                                                </td>

                                                {/* Last Login */}
                                                <td className="p-4 text-xs">
                                                    {user.last_login_at ? (
                                                        <div>
                                                            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                                <Clock size={12} />
                                                                <span>
                                                                    {new Date(user.last_login_at).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] text-gray-400">
                                                                {new Date(user.last_login_at).toLocaleTimeString(
                                                                    'id-ID',
                                                                    {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    }
                                                                )}{' '}
                                                                {user.last_login_ip && `(${user.last_login_ip})`}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-[11px]">
                                                            Belum pernah
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Created At */}
                                                <td className="p-4 text-xs text-gray-500">
                                                    {user.created_at
                                                        ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          })
                                                        : '-'}
                                                </td>

                                                {/* Actions */}
                                                <td className="p-4 pr-6 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition cursor-pointer"
                                                            title="Edit Akun"
                                                        >
                                                            <Edit2 size={15} />
                                                        </button>

                                                        {user.id !== currentAuthUser.id && (
                                                            <button
                                                                onClick={() => handleDeleteUser(user)}
                                                                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                                                                title="Hapus Akun"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-center gap-1.5">
                                {users.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                                            link.active
                                                ? 'bg-primary text-white'
                                                : link.url
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Tambah User */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
                            Tambah Akun Baru
                        </h3>
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                required
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:bg-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Email (bisa admin@2varsched atau email standar)
                            </label>
                            <input
                                type="text"
                                required
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:bg-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:bg-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Role Akun
                            </label>
                            <select
                                value={createForm.data.role}
                                onChange={(e) => createForm.setData('role', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:bg-gray-900"
                            >
                                <option value="user">User Biasa</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="px-5 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-dark shadow-teal-glow disabled:opacity-50"
                            >
                                Simpan Akun
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Edit User */}
            <Modal show={Boolean(editingUser)} onClose={() => setEditingUser(null)}>
                <div className="p-6">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
                            Edit Akun: {editingUser?.name}
                        </h3>
                        <button
                            onClick={() => setEditingUser(null)}
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleEditUser} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                required
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:bg-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="text"
                                required
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:bg-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Role Akun
                            </label>
                            <select
                                value={editForm.data.role}
                                onChange={(e) => editForm.setData('role', e.target.value)}
                                disabled={editingUser?.id === currentAuthUser.id}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:bg-gray-900 disabled:opacity-50"
                            >
                                <option value="user">User Biasa</option>
                                <option value="admin">Administrator</option>
                            </select>
                            {editingUser?.id === currentAuthUser.id && (
                                <p className="text-[10px] text-coral mt-1">
                                    Anda tidak dapat mengubah role akun yang sedang aktif.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Password Baru (Kosongkan jika tidak diubah)
                            </label>
                            <input
                                type="password"
                                placeholder="Minimal 6 karakter"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:bg-gray-900"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-4">
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={editForm.processing}
                                className="px-5 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-dark shadow-teal-glow disabled:opacity-50"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
