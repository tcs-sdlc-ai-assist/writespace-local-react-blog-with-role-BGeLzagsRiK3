import React from 'react';
import PropTypes from 'prop-types';

export function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-xl select-none ${bgColor || 'bg-gray-200'}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bgColor: PropTypes.string,
};

StatCard.defaultProps = {
  bgColor: 'bg-gray-200',
};

export default StatCard;