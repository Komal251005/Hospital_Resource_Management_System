// Analytics Page - Charts and visual analytics from real MongoDB data
import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { analyticsAPI, resourcesAPI, emergencyAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import {
    FaChartLine,
    FaChartBar,
    FaChartPie,
    FaCalendarAlt,
    FaFilter,
    FaDownload,
    FaSync
} from 'react-icons/fa';

const Analytics = () => {
    // State for filters
    const [dateRange, setDateRange] = useState('30');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Data from API
    const [dailyData, setDailyData] = useState([]);
    const [resources, setResources] = useState([]);
    const [emergencies, setEmergencies] = useState([]);

    // Fetch analytics data from API
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [dailyRes, resourcesRes, emergencyRes] = await Promise.all([
                analyticsAPI.getDailyData(parseInt(dateRange)),
                resourcesAPI.getAll().catch(() => ({ data: [] })),
                emergencyAPI.getAll().catch(() => ({ data: [] })),
            ]);

            setDailyData(dailyRes.data || []);
            setResources(resourcesRes.data || []);
            setEmergencies(emergencyRes.data || []);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    // Transform daily data for patient inflow chart
    const getPatientInflowData = () => {
        return dailyData.map(d => ({
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            patients: d.patients || 0,
            emergency: d.emergencyCases || 0,
        }));
    };

    // Get resource utilization data from real resources
    const getResourceUtilization = () => {
        return resources.map(r => ({
            resource: r.resourceName,
            utilization: r.total > 0 ? Math.round(((r.total - r.available) / r.total) * 100) : 0,
            total: r.total,
            available: r.available,
        }));
    };

    // Get case distribution from emergencies
    const getCaseDistribution = () => {
        const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        emergencies.forEach(e => {
            if (counts[e.severity] !== undefined) counts[e.severity]++;
        });
        return [
            { name: 'Critical', value: counts.Critical, color: '#ef4444' },
            { name: 'High', value: counts.High, color: '#f97316' },
            { name: 'Medium', value: counts.Medium, color: '#f59e0b' },
            { name: 'Low', value: counts.Low, color: '#22c55e' },
        ].filter(d => d.value > 0);
    };

    // Get beds vs usage trend from daily data
    const getBedTrendData = () => {
        return dailyData.map(d => ({
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            bedsUsed: d.bedsUsed || 0,
            icuUsed: d.icuUsed || 0,
            ventilatorsUsed: d.ventilatorsUsed || 0,
            discharges: d.discharges || 0,
        }));
    };

    // Compute summary stats from daily data
    const getSummaryStats = () => {
        if (dailyData.length === 0) return { totalPatients: 0, totalDischarges: 0, avgBedOccupancy: 0, avgPatients: 0 };
        
        const totalPatients = dailyData.reduce((s, d) => s + (d.patients || 0), 0);
        const totalDischarges = dailyData.reduce((s, d) => s + (d.discharges || 0), 0);
        const avgBeds = dailyData.reduce((s, d) => s + (d.bedsUsed || 0), 0) / dailyData.length;
        const totalBedCapacity = resources.filter(r => r.category === 'Bed').reduce((s, r) => s + r.total, 0) || 280;
        const avgBedOccupancy = totalBedCapacity > 0 ? Math.round((avgBeds / totalBedCapacity) * 100) : 0;
        const avgPatients = Math.round(totalPatients / dailyData.length);

        return { totalPatients, totalDischarges, avgBedOccupancy, avgPatients };
    };

    // Colors for charts
    const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

    // Custom tooltip style
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
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
                                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading analytics data...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const patientInflowData = getPatientInflowData();
    const resourceUtilData = getResourceUtilization();
    const caseDistData = getCaseDistribution();
    const bedTrendData = getBedTrendData();
    const summaryStats = getSummaryStats();

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            <div className="flex-1 ml-64">
                <Navbar userRole="Administrator" />

                <main className="pt-20 p-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <FaChartLine className="text-teal-500" />
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Visual insights from real hospital data — {dailyData.length} days of records
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                                <FaCalendarAlt className="text-gray-400" />
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="bg-transparent border-none focus:outline-none text-sm text-gray-700"
                                >
                                    <option value="7">Last 7 Days</option>
                                    <option value="30">Last 30 Days</option>
                                    <option value="60">Last 60 Days</option>
                                    <option value="90">Last 90 Days</option>
                                </select>
                            </div>

                            <button
                                onClick={fetchData}
                                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
                            >
                                <FaSync />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {dailyData.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <FaChartLine className="text-6xl text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No historical data available yet.</p>
                            <p className="text-gray-400 text-sm mt-2">Run the seed script to populate historical data for analytics.</p>
                        </div>
                    ) : (
                        <>
                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Line Chart - Patient Inflow */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <FaChartLine className="text-blue-500" />
                                            Patient Inflow Trends
                                        </h3>
                                        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Daily</span>
                                    </div>

                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={patientInflowData.slice(-14)}>
                                            <defs>
                                                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Area
                                                type="monotone"
                                                dataKey="patients"
                                                stroke="#3b82f6"
                                                fill="url(#colorPatients)"
                                                strokeWidth={2}
                                                name="Total Patients"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="emergency"
                                                stroke="#ef4444"
                                                fill="url(#colorEmergency)"
                                                strokeWidth={2}
                                                name="Emergency Cases"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Bar Chart - Resource Utilization */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <FaChartBar className="text-green-500" />
                                            Resource Utilization
                                        </h3>
                                        <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">Current</span>
                                    </div>

                                    {resourceUtilData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={resourceUtilData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis type="number" stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                                                <YAxis dataKey="resource" type="category" stroke="#9ca3af" fontSize={11} width={120} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="utilization" name="Utilization %" radius={[0, 4, 4, 0]}>
                                                    {resourceUtilData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.utilization > 80 ? '#ef4444' : entry.utilization > 60 ? '#f59e0b' : '#22c55e'}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-64 text-gray-400">
                                            No resource data available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* Pie Chart - Case Distribution */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <FaChartPie className="text-purple-500" />
                                            Case Distribution
                                        </h3>
                                    </div>

                                    {caseDistData.length > 0 ? (
                                        <>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie
                                                        data={caseDistData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {caseDistData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>

                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                {caseDistData.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: entry.color }}
                                                        ></div>
                                                        <span className="text-xs text-gray-600">{entry.name} ({entry.value})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-64 text-gray-400">
                                            No emergency cases recorded
                                        </div>
                                    )}
                                </div>

                                {/* Beds & ICU Trend */}
                                <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-800">Resource Usage Trends</h3>
                                        <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">Historical</span>
                                    </div>

                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={bedTrendData.slice(-14)}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Line type="monotone" dataKey="bedsUsed" stroke="#3b82f6" strokeWidth={2} name="Beds Used" dot={{ r: 3 }} />
                                            <Line type="monotone" dataKey="icuUsed" stroke="#ef4444" strokeWidth={2} name="ICU Used" dot={{ r: 3 }} />
                                            <Line type="monotone" dataKey="ventilatorsUsed" stroke="#8b5cf6" strokeWidth={2} name="Ventilators" dot={{ r: 3 }} />
                                            <Line type="monotone" dataKey="discharges" stroke="#22c55e" strokeWidth={2} name="Discharges" dot={{ r: 3 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                                    <p className="text-3xl font-bold">{summaryStats.totalPatients.toLocaleString()}</p>
                                    <p className="text-sm opacity-80">Total Patients ({dateRange}d)</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                                    <p className="text-3xl font-bold">{summaryStats.totalDischarges.toLocaleString()}</p>
                                    <p className="text-sm opacity-80">Total Discharges</p>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                                    <p className="text-3xl font-bold">{summaryStats.avgBedOccupancy}%</p>
                                    <p className="text-sm opacity-80">Avg Bed Occupancy</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                                    <p className="text-3xl font-bold">{summaryStats.avgPatients}</p>
                                    <p className="text-sm opacity-80">Avg Daily Patients</p>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Analytics;
