import React, { ReactNode } from 'react';
type CustomComponentProps = {
  title: string;
  subtitle: string;
  isDialogOpen?: boolean;
  children: ReactNode;
};
declare const CustomComponent: React.FC<CustomComponentProps>;
export default CustomComponent;
