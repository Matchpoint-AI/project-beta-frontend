import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
// import Close from "@mui/icons-material/Close";
import { useContext } from "react";
import { BrandContext } from "../../../context/BrandContext";

interface ZipCodeInputProps {
   currentValues: string[] | undefined;
   setCurrentValues: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

const ZipCodeInput = ({
   currentValues,
   setCurrentValues,
}: ZipCodeInputProps) => {
   const { businessInfo, setBusinessInfo } = useContext(BrandContext);
   const [myOptions, setMyOptions] = useState<string[]>([]);
   const [zipCodesMap, setzipCodesMap] = useState<Map<string, string>>(null!);
   const [zipcode, setZipCode] = useState<string>("");

   useEffect(() => {
      const myMap = new Map<string, string>();
      fetch("/zip_codes.json")
         .then((response) => response.json())
         .then((result) => {
            result.map((item: { zip: string; city_state: string }) => {
               myMap.set(item.zip, item.city_state);
               return item;
            });
            setzipCodesMap(myMap);
            const uniqueValues = new Set<string>();
            Array.from(myMap).forEach(([, value]) => {
               if (uniqueValues.size < 1000) {
                  uniqueValues.add(value);
               }
            });
            const arr = Array.from(uniqueValues);
            setMyOptions(arr);
         });
   }, []);

   useEffect(() => {
      if (zipCodesMap === null) return;
      const findClosestMatch = (locations: string[] | undefined) => {
         if (locations === undefined) return;
         const results = [];
         for (const location of locations) {
            let closestMatch = "";
            let highestMatchScore = 0;

            Array.from(zipCodesMap).forEach(([, value]) => {
               const matchScore = getMatchScore(location, value);
               if (matchScore > highestMatchScore) {
                  highestMatchScore = matchScore;
                  closestMatch = value;
               }
            });

            results.push(closestMatch);
         }

         return Array.from(new Set(results));
      };

      // Simple function to calculate match score
      const getMatchScore = (str1: string, str2: string): number => {
         const tokens1 = str1.toLowerCase().split(" ");
         const tokens2 = str2.toLowerCase().split(/[ ,/]+/);

         let score = 0;
         for (const token1 of tokens1) {
            for (const token2 of tokens2) {
               if (token1 === token2) {
                  score++;
               }
            }
         }

         return score;
      };
      const results = findClosestMatch(currentValues);
      if (results?.length === 1 && results[0] === "") {
         setCurrentValues([]);
         setBusinessInfo({
            ...businessInfo,
            locations_fetched: false,
         });
      } else setCurrentValues(results);
   }, [zipCodesMap]);

   const getMatch = (prefix: string, limit: number = 100) => {
      if (zipCodesMap === null) return;
      const uniqueValues = new Set<string>();

      Array.from(zipCodesMap)
         .filter(([key]) => key.startsWith(prefix))
         .forEach(([, value]) => {
            if (uniqueValues.size < limit) {
               uniqueValues.add(value);
            }
         });
      const arr = Array.from(uniqueValues).slice(0, limit);
      setMyOptions(arr);
   };

   useEffect(() => {
      getMatch(zipcode);
   }, [zipcode]);

   useEffect(() => {
      setBusinessInfo({
         ...businessInfo,
         physical_locations: currentValues,
      });
   }, [currentValues]);

   return (
      <Autocomplete
         autoComplete={false}
         filterOptions={(x) => x}
         options={myOptions}
         multiple
         freeSolo
         className="w-full"
         value={currentValues}
         onChange={(event: React.SyntheticEvent, newValue: string[]) => {
            setCurrentValues(newValue);
         }}
         inputValue={zipcode}
         onInputChange={(event, newInputValue) => {
            setZipCode(newInputValue);
         }}
         renderTags={(tags, getTagProps) => {
            return tags.map((item, index) => {
               const { ...tagProps } = getTagProps({ index });
               return (
                  <Chip
                     variant="solid"
                     sx={{ margin: 0.5 }}
                     style={{
                        backgroundColor: "#BCF0DA",
                        color: "black",
                        borderRadius: "6px",
                     }}
                     key={index}
                     endDecorator={
                        <ChipDelete
                           variant="plain"
                           style={{
                              backgroundColor: "#BCF0DA",
                              color: "gray",
                           }}
                           {...tagProps}></ChipDelete>
                     }>
                     {item}
                  </Chip>
               );
            });
         }}
         renderInput={(params) => {
            return <TextField {...params} label="Physical Locations" />;
         }}
      />
   );
};

export default ZipCodeInput;
