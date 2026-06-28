import React from 'react';

export const SidebarExpand: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="0" y="0" width="200" height="200" rx="36" fill="transparent" />
    <rect x="28" y="50" width="124" height="22" rx="11" fill="#f0f0f0" />
    <polyline points="37,78 57,100 37,122" fill="none" stroke="#f0f0f0" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="68" y="89" width="84" height="22" rx="11" fill="#f0f0f0" />
    <rect x="28" y="128" width="124" height="22" rx="11" fill="#f0f0f0" />
  </svg>
);