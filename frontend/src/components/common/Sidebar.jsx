// Sidebar Component - Navigation sidebar for dashboard
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaChartLine,
    FaBoxes,
    FaExclamationTriangle,
    FaSignOutAlt,
    FaHospital,
    FaBrain
} from 'react-icons/fa';

const Sidebar = () => {
    const navigate = useNavigate();

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Navigation items configuration
    const navItems = [
        {
            path: '/dashboard',
            icon: FaHome,
            label: 'Dashboard',
            description: 'Overview & Stats'
        },
        {
            path: '/analytics',
            icon: FaChartLine,
            label: 'Analytics',
            description: 'Charts & Reports'
        },
        {
            path: '/resources',
            icon: FaBoxes,
            label: 'Resource Management',
            description: 'Beds, Staff & Equipment'
        },
        {
            path: '/emergency',
            icon: FaExclamationTriangle,
            label: 'Emergency Status',
            description: 'Surge Monitoring'
        },
        {
            path: '/prediction',
            icon: FaBrain,
            label: 'AI Prediction',
            description: 'Resource Forecasting'
        }
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl z-50 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl shadow-lg">
                        <FaHospital className="text-2xl text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Hospital</h1>
                        <p className="text-xs text-slate-400">Resource System</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <p className="text-xs text-slate-500 uppercase tracking-wider px-3 mb-4">Main Menu</p>

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="text-xl group-hover:scale-110 transition-transform" />
                        <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs opacity-70">{item.description}</p>
                        </div>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group"
                >
                    <FaSignOutAlt className="text-xl group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>

            {/* Version Info */}
            <div className="p-4 text-center">
                <p className="text-xs text-slate-500">v1.0.0 • © 2026</p>
            </div>
        </aside>
    );
};

export default Sidebar;
