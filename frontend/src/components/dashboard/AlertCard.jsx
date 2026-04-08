// AlertCard Component - Displays recent alerts on dashboard
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes } from 'react-icons/fa';

const AlertCard = ({ alerts }) => {
    // Get icon and colors based on alert type
    const getAlertConfig = (type) => {
        switch (type) {
            case 'critical':
                return {
                    icon: FaExclamationTriangle,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700',
                    iconColor: 'text-red-500'
                };
            case 'warning':
                return {
                    icon: FaExclamationTriangle,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700',
                    iconColor: 'text-yellow-500'
                };
            case 'info':
                return {
                    icon: FaInfoCircle,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-700',
                    iconColor: 'text-blue-500'
                };
            case 'success':
                return {
                    icon: FaCheckCircle,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700',
                    iconColor: 'text-green-500'
                };
            default:
                return {
                    icon: FaInfoCircle,
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-700',
                    iconColor: 'text-gray-500'
                };
        }
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Alerts</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {alerts.length} new
                </span>
            </div>

            <div className="space-y-3">
                {alerts.map((alert) => {
                    const config = getAlertConfig(alert.type);
                    const AlertIcon = config.icon;

                    return (
                        <div
                            key={alert.id}
                            className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 flex items-start gap-3 transition-all duration-200 hover:shadow-md`}
                        >
                            <AlertIcon className={`${config.iconColor} text-lg mt-0.5 flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                                <p className={`${config.textColor} text-sm font-medium`}>
                                    {alert.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatTime(alert.timestamp)}
                                </p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes className="text-sm" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* View All Link */}
            <button className="w-full mt-4 text-center text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
                View All Alerts →
            </button>
        </div>
    );
};

export default AlertCard;
