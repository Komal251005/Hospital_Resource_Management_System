// StatCard Component - Reusable card for displaying statistics
import {
    FaBed,
    FaHeartbeat,
    FaAmbulance,
    FaUserMd,
    FaUserNurse,
    FaLungs,
    FaWind
} from 'react-icons/fa';

// Icon mapping for dynamic icon rendering
const iconMap = {
    FaBed: FaBed,
    FaHeartbeat: FaHeartbeat,
    FaAmbulance: FaAmbulance,
    FaUserMd: FaUserMd,
    FaUserNurse: FaUserNurse,
    FaLungs: FaLungs,
    FaWind: FaWind
};

// Color mapping for gradient backgrounds
const colorMap = {
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    cyan: "from-cyan-500 to-cyan-600",
    teal: "from-teal-500 to-teal-600"
};

const StatCard = ({
    icon,
    label,
    value,
    total,
    color = "blue",
    subtitle
}) => {
    const IconComponent = iconMap[icon] || FaBed;
    const gradientColor = colorMap[color] || colorMap.blue;

    // Calculate percentage for progress indicator
    const percentage = total ? Math.round((value / total) * 100) : 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Top colored bar */}
            <div className={`h-2 bg-gradient-to-r ${gradientColor}`}></div>

            <div className="p-6">
                <div className="flex items-start justify-between">
                    {/* Icon container */}
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${gradientColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="text-white text-2xl" />
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                        <p className="text-3xl font-bold text-gray-800">{value}</p>
                        {total && (
                            <p className="text-sm text-gray-500">of {total} total</p>
                        )}
                    </div>
                </div>

                {/* Label */}
                <h3 className="mt-4 text-gray-600 font-medium text-sm">{label}</h3>

                {/* Progress bar (if total is provided) */}
                {total && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Utilization</span>
                            <span>{100 - percentage}% available</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${gradientColor} rounded-full transition-all duration-500`}
                                style={{ width: `${100 - percentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Subtitle */}
                {subtitle && (
                    <p className="mt-2 text-xs text-gray-400">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
