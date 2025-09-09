import type { SVGProps } from 'react';

export function TrainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 4h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4Z" />
      <path d="M4 15h16" />
      <path d="M12 4v11" />
      <path d="M6 15h.01" />
      <path d="M18 15h.01" />
      <path d="M8 19h8" />
      <path d="M10 15v4" />
      <path d="M14 15v4" />
    </svg>
  );
}
