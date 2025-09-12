declare module 'swiper/react' {
  import * as React from 'react';
  
  export interface SwiperProps {
    slidesPerView?: number;
    spaceBetween?: number;
    navigation?: boolean;
    modules?: any[];
    className?: string;
    children?: React.ReactNode;
  }
  
  export const Swiper: React.FC<SwiperProps>;
  export const SwiperSlide: React.FC<{ children: React.ReactNode; key?: any }>;
}

declare module 'swiper/modules' {
  export const Navigation: any;
}

declare module 'swiper/css';
declare module 'swiper/css/navigation';