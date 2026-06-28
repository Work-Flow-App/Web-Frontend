import React from 'react';

interface EllipsisIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const EllipsisIcon: React.FC<EllipsisIconProps> = ({
  width = 8,
  height = 7,
  color = '#525252',
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 8 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.000532687 6.97656L2.18235 3.45384H3.81303V3.56747L1.51758 6.97656H0.000532687ZM0.000532687 -0.000710487H1.51758L3.81303 3.40838V3.52202H2.18235L0.000532687 -0.000710487ZM3.20508 6.97656L5.3869 3.45384H7.01758V3.56747L4.72212 6.97656H3.20508ZM3.20508 -0.000710487H4.72212L7.01758 3.40838V3.52202H5.3869L3.20508 -0.000710487Z"
        fill={color}
      />
    </svg>
  );
};

export default EllipsisIcon;
