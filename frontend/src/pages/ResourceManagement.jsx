// Resource Management Page - Full CRUD operations with MongoDB
import { useState, useEffect } from 'react';
import { resourcesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import {
    FaBed,
    FaUserMd,
    FaTools,
    FaSearch,
    FaFilter,
    FaSync,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes
} from 'react-icons/fa';

const ResourceManagement = () => {
    // State
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        resourceName: '',
        category: 'Bed',
        total: '',
        available: '',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch resources from API
    const fetchResources = async (category = null) => {
        setLoading(true);
        setError('');
        try {
            const catParam = category && category !== 'all' ? category : null;
            const response = await resourcesAPI.getAll(catParam);
            setResources(response.data || []);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Failed to load resources. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    // Tab configuration
    const tabs = [
        { id: 'all', label: 'All', icon: FaTools, count: resources.length },
        { id: 'Bed', label: 'Beds', icon: FaBed, count: resources.filter(r => r.category === 'Bed').length },
        { id: 'Staff', label: 'Staff', icon: FaUserMd, count: resources.filter(r => r.category === 'Staff').length },
        { id: 'Equipment', label: 'Equipment', icon: FaTools, count: resources.filter(r => r.category === 'Equipment').length },
    ];

    // Filter resources
    const getFilteredResources = () => {
        let filtered = [...resources];

        // Category filter
        if (activeTab !== 'all') {
            filtered = filtered.filter(r => r.category === activeTab);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.resourceName?.toLowerCase().includes(query) ||
                r.category?.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    // Compute summary from real data
    const getSummary = () => {
        const beds = resources.filter(r => r.category === 'Bed');
        const staff = resources.filter(r => r.category === 'Staff');
        const equipment = resources.filter(r => r.category === 'Equipment');

        return {
            beds: {
                total: beds.reduce((s, r) => s + r.total, 0),
                available: beds.reduce((s, r) => s + r.available, 0),
                inUse: beds.reduce((s, r) => s + (r.total - r.available), 0),
            },
            staff: {
                total: staff.reduce((s, r) => s + r.total, 0),
                available: staff.reduce((s, r) => s + r.available, 0),
                onDuty: staff.reduce((s, r) => s + (r.total - r.available), 0),
            },
            equipment: {
                total: equipment.reduce((s, r) => s + r.total, 0),
                available: equipment.reduce((s, r) => s + r.available, 0),
                inUse: equipment.reduce((s, r) => s + (r.total - r.available), 0),
            },
        };
    };

    // Open modal for add/edit
    const openAddModal = () => {
        setEditingResource(null);
        setFormData({ resourceName: '', category: 'Bed', total: '', available: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (resource) => {
        setEditingResource(resource);
        setFormData({
            resourceName: resource.resourceName,
            category: resource.category,
            total: resource.total.toString(),
            available: resource.available.toString(),
        });
        setFormError('');
        setShowModal(true);
    };

    // Handle form submit (create or update)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.resourceName.trim()) {
            setFormError('Resource name is required');
            return;
        }
        if (!formData.total || parseInt(formData.total) < 0) {
            setFormError('Total must be a non-negative number');
            return;
        }
        if (!formData.available || parseInt(formData.available) < 0) {
            setFormError('Available must be a non-negative number');
            return;
        }
        if (parseInt(formData.available) > parseInt(formData.total)) {
            setFormError('Available cannot exceed total');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                resourceName: formData.resourceName.trim(),
                category: formData.category,
                total: parseInt(formData.total),
                available: parseInt(formData.available),
            };

            if (editingResource) {
                await resourcesAPI.update(editingResource._id, payload);
            } else {
                await resourcesAPI.create(payload);
            }

            setShowModal(false);
            await fetchResources();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Operation failed';
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await resourcesAPI.delete(id);
            setDeleteId(null);
            await fetchResources();
        } catch (err) {
            const msg = err.response?.data?.message || 'Delete failed';
            alert(msg);
        } finally {
            setDeleting(false);
        }
    };

    // Utilization badge
    const UtilizationBadge = ({ total, available }) => {
        if (total === 0) return <span className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">N/A</span>;
        const pct = Math.round(((total - available) / total) * 100);
        let style = 'bg-green-100 text-green-700 border-green-200';
        if (pct >= 80) style = 'bg-red-100 text-red-700 border-red-200';
        else if (pct >= 60) style = 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style}`}>{pct}% Used</span>;
    };

    const summary = getSummary();
    const filteredResources = getFilteredResources();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <Navbar />
                    <main className="pt-16 p-6">
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading resources...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            <div className="flex-1 ml-64">
                <Navbar userRole="Administrator" />

                <main className="pt-20 p-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Resource Management</h1>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
                        >
                            <FaPlus />
                            Add Resource
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Beds</p>
                                    <p className="text-2xl font-bold text-gray-800">{summary.beds.total}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="text-green-600">{summary.beds.available} Available</p>
                                    <p className="text-blue-600">{summary.beds.inUse} In Use</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Staff</p>
                                    <p className="text-2xl font-bold text-gray-800">{summary.staff.total}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="text-blue-600">{summary.staff.onDuty} On Duty</p>
                                    <p className="text-green-600">{summary.staff.available} Available</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Equipment</p>
                                    <p className="text-2xl font-bold text-gray-800">{summary.equipment.total}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="text-green-600">{summary.equipment.available} Available</p>
                                    <p className="text-blue-600">{summary.equipment.inUse} In Use</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${activeTab === tab.id
                                            ? 'text-teal-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <tab.icon />
                                    {tab.label}
                                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id
                                            ? 'bg-teal-100 text-teal-600'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {tab.count}
                                    </span>
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Filters */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search resources..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => fetchResources()}
                                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
                            >
                                <FaSync />
                                Refresh
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Resource Name</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Total</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Available</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Utilization</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Updated</th>
                                        <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResources.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-gray-500">
                                                No resources found. Click "Add Resource" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredResources.map((resource) => (
                                            <tr key={resource._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <span className="font-medium text-gray-800">{resource.resourceName}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                        resource.category === 'Bed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                        resource.category === 'Staff' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        resource.category === 'Equipment' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                        'bg-gray-100 text-gray-700 border-gray-200'
                                                    }`}>
                                                        {resource.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-gray-600 font-medium">{resource.total}</td>
                                                <td className="py-4 px-6 text-gray-600 font-medium">{resource.available}</td>
                                                <td className="py-4 px-6">
                                                    <UtilizationBadge total={resource.total} available={resource.available} />
                                                </td>
                                                <td className="py-4 px-6 text-gray-500 text-sm">
                                                    {new Date(resource.lastUpdated || resource.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(resource)}
                                                            className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteId(resource._id)}
                                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {filteredResources.length} of {resources.length} resources
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingResource ? 'Edit Resource' : 'Add New Resource'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                                <input
                                    type="text"
                                    value={formData.resourceName}
                                    onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
                                    placeholder="e.g., ICU Beds"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="Bed">Bed</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.total}
                                        onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.available}
                                        onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        editingResource ? 'Update' : 'Create'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Resource</h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Are you sure you want to delete this resource? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceManagement;
