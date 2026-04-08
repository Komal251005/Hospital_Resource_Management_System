// Navbar Component - Top navigation bar for dashboard
import { FaBell, FaUserCircle, FaCog, FaSearch } from 'react-icons/fa';
import { hospitalInfo } from '../../data/mockData';

const Navbar = ({ userRole = 'Administrator' }) => {
    // Get current date and time
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-sm z-40 flex items-center justify-between px-6">
            {/* Left Section - Hospital Name & Search */}
            <div className="flex items-center gap-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{hospitalInfo.name}</h2>
                    <p className="text-xs text-gray-500">{currentDate}</p>
                </div>

                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search resources, patients..."
                        className="pl-10 pr-4 py-2 w-64 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Right Section - Notifications & User */}
            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaBell className="text-xl" />
                    {/* Notification Badge */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* Settings */}
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaCog className="text-xl" />
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">Admin User</p>
                        <p className="text-xs text-gray-500">{userRole}</p>
                    </div>
                    <div className="relative">
                        <FaUserCircle className="text-3xl text-teal-500" />
                        {/* Online Status */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
