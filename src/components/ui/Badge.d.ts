import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}
export declare const Badge: React.FC<BadgeProps>;
export {};
