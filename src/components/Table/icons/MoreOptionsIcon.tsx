import React from 'react';

interface MoreOptionsIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const MoreOptionsIcon: React.FC<MoreOptionsIconProps> = ({
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
        d="M7.99935 8.66732C8.36754 8.66732 8.66602 8.36884 8.66602 8.00065C8.66602 7.63246 8.36754 7.33398 7.99935 7.33398C7.63116 7.33398 7.33268 7.63246 7.33268 8.00065C7.33268 8.36884 7.63116 8.66732 7.99935 8.66732Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.666 8.66732C13.0342 8.66732 13.3327 8.36884 13.3327 8.00065C13.3327 7.63246 13.0342 7.33398 12.666 7.33398C12.2978 7.33398 11.9993 7.63246 11.9993 8.00065C11.9993 8.36884 12.2978 8.66732 12.666 8.66732Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33268 8.66732C3.70087 8.66732 3.99935 8.36884 3.99935 8.00065C3.99935 7.63246 3.70087 7.33398 3.33268 7.33398C2.96449 7.33398 2.66602 7.63246 2.66602 8.00065C2.66602 8.36884 2.96449 8.66732 3.33268 8.66732Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MoreOptionsIcon;
