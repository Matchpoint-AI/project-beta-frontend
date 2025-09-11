export type Chip = {
    id: number;
    label: string;
    selected: boolean;
};
declare const convertToChipsArray: (attribute: string[] | Chip[]) => {
    id: number;
    label: string | Chip;
    selected: boolean;
}[];
export default convertToChipsArray;
