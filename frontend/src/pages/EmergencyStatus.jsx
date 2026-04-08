// Emergency Status Page - Real-time emergency case management with MongoDB
import { useState, useEffect } from 'react';
import { emergencyAPI, dashboardAPI, resourcesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import {
    FaExclamationTriangle,
    FaBell,
    FaUsers,
    FaChartLine,
    FaBrain,
    FaPlus,
    FaTimes,
    FaHistory,
    FaAmbulance,
    FaSync
} from 'react-icons/fa';

const EmergencyStatus = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Add emergency modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        severity: 'Medium',
        requiredResources: [],
        notes: '',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch all data
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [emergencyRes, summaryRes, resourcesRes] = await Promise.all([
                emergencyAPI.getAll(),
                dashboardAPI.getSummary(),
                resourcesAPI.getAll().catch(() => ({ data: [] })),
            ]);

            setEmergencies(emergencyRes.data || []);
            setSummaryData(summaryRes.data || {});
            setResources(resourcesRes.data || []);
        } catch (err) {
            console.error('Error fetching emergency data:', err);
            setError('Failed to load emergency data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Compute status from real data
    const computeStatus = () => {
        if (!summaryData) return { level: 'Low', score: 0, trend: 'stable' };

        const util = summaryData.utilizationPercent || 0;
        const criticals = summaryData.criticalEmergencies || 0;
        const actives = summaryData.activeEmergencies || 0;

        // Compute a risk score (0-100) based on utilization + emergency severity
        let score = util;
        if (criticals > 0) score = Math.min(100, score + criticals * 10);
        if (actives > 3) score = Math.min(100, score + 10);

        let level = 'Low';
        if (score >= 85) level = 'Critical';
        else if (score >= 70) level = 'High';
        else if (score >= 50) level = 'Moderate';

        const trend = summaryData.patientTrend > 0 ? 'increasing' : summaryData.patientTrend < 0 ? 'decreasing' : 'stable';

        return { level, score: Math.round(score), trend };
    };

    // Compute capacity from resources
    const computeCapacity = () => {
        const bedResources = resources.filter(r => r.category === 'Bed');
        const equipResources = resources.filter(r => r.category === 'Equipment');
        const staffResources = resources.filter(r => r.category === 'Staff');

        const calcPct = (items) => {
            const total = items.reduce((s, r) => s + r.total, 0);
            const avail = items.reduce((s, r) => s + r.available, 0);
            const current = total - avail;
            return { current, max: total, percentage: total > 0 ? Math.round((current / total) * 100) : 0 };
        };

        return {
            beds: calcPct(bedResources),
            equipment: calcPct(equipResources),
            staff: calcPct(staffResources),
            overall: calcPct(resources),
        };
    };

    // Get status color and styling
    const getStatusConfig = (level) => {
        switch (level?.toLowerCase()) {
            case 'low':
                return { bgGradient: 'from-green-500 to-emerald-600', message: 'Normal Operations - All systems stable' };
            case 'moderate':
                return { bgGradient: 'from-yellow-500 to-amber-600', message: 'Elevated Activity - Monitor closely' };
            case 'high':
                return { bgGradient: 'from-orange-500 to-red-500', message: 'High Alert - Prepare contingency protocols' };
            case 'critical':
                return { bgGradient: 'from-red-600 to-red-800', message: 'CRITICAL - Emergency protocols activated' };
            default:
                return { bgGradient: 'from-gray-500 to-gray-600', message: 'Status Unknown' };
        }
    };

    // Severity badge
    const SeverityBadge = ({ severity }) => {
        const styles = {
            Critical: 'bg-red-100 text-red-700 border-red-200',
            High: 'bg-orange-100 text-orange-700 border-orange-200',
            Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            Low: 'bg-green-100 text-green-700 border-green-200',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[severity] || styles.Low}`}>
                {severity}
            </span>
        );
    };

    // Status badge
    const StatusBadge = ({ status }) => {
        const styles = {
            Active: 'bg-blue-100 text-blue-700 border-blue-200',
            Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            Resolved: 'bg-green-100 text-green-700 border-green-200',
            Transferred: 'bg-purple-100 text-purple-700 border-purple-200',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {status}
            </span>
        );
    };

    // Handle status update
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await emergencyAPI.updateStatus(id, newStatus);
            await fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    // Handle add emergency
    const handleAddEmergency = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.patientName.trim()) {
            setFormError('Patient name is required');
            return;
        }

        setSubmitting(true);
        try {
            await emergencyAPI.create({
                patientName: formData.patientName.trim(),
                age: formData.age ? parseInt(formData.age) : undefined,
                severity: formData.severity,
                requiredResources: formData.requiredResources,
                notes: formData.notes.trim(),
            });

            setShowAddModal(false);
            setFormData({ patientName: '', age: '', severity: 'Medium', requiredResources: [], notes: '' });
            await fetchData();
        } catch (err) {
            setFormError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to create emergency case');
        } finally {
            setSubmitting(false);
        }
    };

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
                                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading emergency status...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const status = computeStatus();
    const statusConfig = getStatusConfig(status.level);
    const capacity = computeCapacity();
    const activeCases = emergencies.filter(e => e.status === 'Active' || e.status === 'Pending');
    const criticalCases = emergencies.filter(e => e.severity === 'Critical' && (e.status === 'Active' || e.status === 'Pending'));

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            <div className="flex-1 ml-64">
                <Navbar userRole="Administrator" />

                <main className="pt-20 p-6">
                    {/* Alert Banner for Critical */}
                    {status.level === 'Critical' && (
                        <div className="bg-red-600 text-white px-6 py-4 rounded-xl mb-6 flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-3">
                                <FaExclamationTriangle className="text-2xl" />
                                <div>
                                    <p className="font-bold text-lg">CRITICAL EMERGENCY STATUS</p>
                                    <p className="text-sm opacity-90">All emergency protocols are now active. Coordinate with team leads immediately.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <FaExclamationTriangle className="text-orange-500" />
                                Emergency Status Monitor
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchData}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FaSync className="text-sm" />
                                Refresh
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
                            >
                                <FaPlus />
                                New Emergency
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Main Status Card */}
                    <div className={`bg-gradient-to-r ${statusConfig.bgGradient} rounded-2xl p-8 text-white shadow-xl mb-6`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-wider opacity-80">Current Emergency Level</p>
                                <h2 className="text-5xl font-bold mt-2">{status.level}</h2>
                                <p className="mt-3 opacity-90">{statusConfig.message}</p>
                            </div>

                            <div className="text-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="none" />
                                        <circle cx="80" cy="80" r="70" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"
                                            strokeDasharray={`${status.score * 4.4} 440`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold">{status.score}</span>
                                        <span className="text-sm opacity-80">Risk Score</span>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm">
                                    Trend: {status.trend === 'increasing' ? '📈 Increasing' :
                                        status.trend === 'decreasing' ? '📉 Decreasing' : '➡️ Stable'}
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{activeCases.length}</p>
                                <p className="text-sm opacity-80">Active Cases</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{criticalCases.length}</p>
                                <p className="text-sm opacity-80">Critical Cases</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{capacity.beds.percentage}%</p>
                                <p className="text-sm opacity-80">Bed Occupancy</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{emergencies.length}</p>
                                <p className="text-sm opacity-80">Total Cases</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Active Emergency Cases */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaBell className="text-red-500" />
                                Emergency Cases
                                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                    {activeCases.length} active
                                </span>
                            </h3>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {emergencies.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No emergency cases recorded yet.</p>
                                ) : (
                                    emergencies.map((ec) => (
                                        <div
                                            key={ec._id}
                                            className={`p-4 rounded-xl border-l-4 ${
                                                ec.severity === 'Critical' ? 'bg-red-50 border-red-500' :
                                                ec.severity === 'High' ? 'bg-orange-50 border-orange-500' :
                                                ec.severity === 'Medium' ? 'bg-yellow-50 border-yellow-500' :
                                                'bg-green-50 border-green-500'
                                            } ${ec.status === 'Resolved' ? 'opacity-60' : ''}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-800">{ec.patientName}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <SeverityBadge severity={ec.severity} />
                                                        <StatusBadge status={ec.status} />
                                                        {ec.age && <span className="text-xs text-gray-500">Age: {ec.age}</span>}
                                                    </div>
                                                    {ec.notes && <p className="text-xs text-gray-600 mt-2">{ec.notes}</p>}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(ec.date || ec.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    {ec.status !== 'Resolved' && (
                                                        <>
                                                            {ec.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(ec._id, 'Active')}
                                                                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                                                >
                                                                    Activate
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleStatusUpdate(ec._id, 'Resolved')}
                                                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                                            >
                                                                Resolve
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Resource Capacity */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaAmbulance className="text-red-500" />
                                Resource Capacity
                            </h3>

                            <div className="space-y-4">
                                {resources.map((resource) => {
                                    const used = resource.total - resource.available;
                                    const pct = resource.total > 0 ? Math.round((used / resource.total) * 100) : 0;
                                    return (
                                        <div key={resource._id}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-600">{resource.resourceName}</span>
                                                <span className="text-sm font-medium text-gray-800">
                                                    {used}/{resource.total}
                                                </span>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        pct >= 85 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                        pct >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                        'bg-gradient-to-r from-green-500 to-emerald-500'
                                                    }`}
                                                    style={{ width: `${pct}%` }}
                                                ></div>
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
                                                    {pct}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {resources.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No resources found. Add resources first.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Cases Table */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaHistory className="text-gray-500" />
                            All Emergency Cases
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Patient</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Age</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Severity</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emergencies.map((ec) => (
                                        <tr key={ec._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium text-gray-800">{ec.patientName}</td>
                                            <td className="py-3 px-4 text-gray-600">{ec.age || '—'}</td>
                                            <td className="py-3 px-4"><SeverityBadge severity={ec.severity} /></td>
                                            <td className="py-3 px-4"><StatusBadge status={ec.status} /></td>
                                            <td className="py-3 px-4 text-gray-600 text-sm">
                                                {new Date(ec.date || ec.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 text-sm max-w-xs truncate">
                                                {ec.notes || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                    {emergencies.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-500">
                                                No emergency cases recorded.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Emergency Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">New Emergency Case</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddEmergency} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                                <input
                                    type="text"
                                    value={formData.patientName}
                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                    placeholder="Enter patient name"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="150"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="Age"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
                                    <select
                                        value={formData.severity}
                                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Additional notes..."
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Emergency Case'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyStatus;
