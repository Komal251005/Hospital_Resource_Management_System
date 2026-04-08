// OccupancyIndicator Component - Shows emergency occupancy status with color coding
import { FaExclamationTriangle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const OccupancyIndicator = ({ currentOccupancy, maxCapacity, status, trend }) => {
    // Determine status color and styling based on occupancy level
    const getStatusConfig = (status) => {
        switch (status.toLowerCase()) {
            case 'low':
                return {
                    color: 'green',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700',
                    progressColor: 'bg-green-500',
                    icon: FaCheckCircle,
                    message: 'Operations Normal'
                };
            case 'moderate':
                return {
                    color: 'yellow',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700',
                    progressColor: 'bg-yellow-500',
                    icon: FaExclamationCircle,
                    message: 'Monitor Closely'
                };
            case 'high':
                return {
                    color: 'orange',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    textColor: 'text-orange-700',
                    progressColor: 'bg-orange-500',
                    icon: FaExclamationTriangle,
                    message: 'Prepare Contingency'
                };
            case 'critical':
                return {
                    color: 'red',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700',
                    progressColor: 'bg-red-500',
                    icon: FaExclamationTriangle,
                    message: 'Emergency Protocols Active'
                };
            default:
                return {
                    color: 'gray',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-700',
                    progressColor: 'bg-gray-500',
                    icon: FaCheckCircle,
                    message: 'Status Unknown'
                };
        }
    };

    const config = getStatusConfig(status);
    const StatusIcon = config.icon;
    const percentage = Math.round((currentOccupancy / maxCapacity) * 100);

    // Get trend arrow
    const getTrendIndicator = (trend) => {
        switch (trend) {
            case 'increasing':
                return { symbol: '↑', color: 'text-red-500', label: 'Increasing' };
            case 'decreasing':
                return { symbol: '↓', color: 'text-green-500', label: 'Decreasing' };
            default:
                return { symbol: '→', color: 'text-gray-500', label: 'Stable' };
        }
    };

    const trendConfig = getTrendIndicator(trend);

    return (
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-6 shadow-lg`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <StatusIcon className={`text-2xl ${config.textColor}`} />
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Emergency Occupancy Status</h3>
                        <p className={`text-sm ${config.textColor} font-medium`}>{config.message}</p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`px-4 py-2 rounded-full ${config.progressColor} text-white font-bold text-sm uppercase tracking-wide`}>
                    {status}
                </div>
            </div>

            {/* Main Percentage Display */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative">
                    {/* Circular Progress Background */}
                    <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            fill="none"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            className={config.textColor}
                            strokeDasharray={`${percentage * 4.4} 440`}
                            style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                        />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${config.textColor}`}>{percentage}%</span>
                        <span className="text-gray-500 text-sm">Occupied</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-gray-800">{currentOccupancy}</p>
                    <p className="text-xs text-gray-500">Current</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-gray-800">{maxCapacity}</p>
                    <p className="text-xs text-gray-500">Capacity</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className={`text-2xl font-bold ${trendConfig.color}`}>{trendConfig.symbol}</p>
                    <p className="text-xs text-gray-500">{trendConfig.label}</p>
                </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
                    {/* Threshold markers */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400 z-10"></div>
                    <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-orange-400 z-10"></div>
                    <div className="absolute left-[85%] top-0 bottom-0 w-0.5 bg-red-400 z-10"></div>

                    {/* Progress fill */}
                    <div
                        className={`h-full ${config.progressColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                    <span>Critical</span>
                </div>
            </div>
        </div>
    );
};

export default OccupancyIndicator;
