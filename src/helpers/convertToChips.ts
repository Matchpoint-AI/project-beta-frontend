// Words to remove from chip labels
// const wordsToRemove = [
//    "To",
//    "on",
//    "and",
//    "the",
//    "in",
//    "with",
//    "of",
//    "by",
//    "for",
//    "particularly",
//    "after",
//    "beyond",
//    "to",
//    "for",
//    "themselves",
// ];

export type Chip = {
   id: number;
   label: string;
   selected: boolean;
};

// Convert brand attributes to chips array
const convertToChipsArray = (attribute: string[] | Chip[]) => {
   if (typeof attribute[0] === "object") {
      // Ensure existing chips have IDs
      return (attribute as Chip[]).map((chip, index) => ({
         ...chip,
         id: chip.id ?? index,
      }));
   }
   return attribute
      ?.filter((v) => !!v && typeof v === "string" && v.trim() !== "")
      .map((value, index) => ({
         id: index,
         label: value,
         selected: true,
      }));
};

export default convertToChipsArray;
