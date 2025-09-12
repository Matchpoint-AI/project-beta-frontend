import React from 'react';
interface PhysicalLocationsProps {
    physicalLocations: string[];
    setPhysicalLocations: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}
export default function NoPhysicalLocations(props: PhysicalLocationsProps): import("react/jsx-runtime").JSX.Element;
export declare function PhysicalLocationsFound(props: PhysicalLocationsProps): import("react/jsx-runtime").JSX.Element;
export declare function PhysicalLocations(props: PhysicalLocationsProps): import("react/jsx-runtime").JSX.Element;
export {};
