import React from 'react';

interface SortIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const SortIcon: React.FC<SortIconProps> = ({
  width = 16,
  height = 16,
  color = '#A1A1A1',
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.3333 2.66602V13.3327M11.3333 13.3327L8.66667 10.666M11.3333 13.3327L14 10.666M4.66667 13.3327V2.66602M4.66667 2.66602L2 5.33268M4.66667 2.66602L7.33333 5.33268"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SortIcon;
