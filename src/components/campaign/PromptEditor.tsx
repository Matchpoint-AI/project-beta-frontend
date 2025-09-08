import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import ResetPromptBtn from "./ResetPromptBtn";
import Dropdown from "../shared/Dropdown";
import { useAuth } from "../../context/AuthContext";
import SavePromptBtn from "./SavePromptBtn";
import { Prompt } from "../../pages/PromptSettings";

interface PromptEditorProps {
   promptsArr: Prompt[];
   placeholders: string[];
   target: "content_generation" | "scrape_website";
   switchPrompts: (
      version: number,
      target: "content_generation" | "scrape_website"
   ) => void;
   addPrompts: (
      prompt: string,
      target: "content_generation" | "scrape_website"
   ) => void;
}

export default function PromptEditor({
   promptsArr,
   placeholders,
   target,
   switchPrompts,
   addPrompts,
}: PromptEditorProps) {
   const promptRef = useRef<HTMLTextAreaElement>(null);
   const { profile } = useAuth();
   const [error, setError] = useState("");
   const [prompt, setPrompt] = useState("");
   const [version, setVersion] = useState(`${promptsArr.length}`);

   const addPlaceholder = (placeholder: string) => {
      if (!prompt.includes(`{${placeholder}}`)) {
         setPrompt((old: string) => {
            return `${old.trim()} {${placeholder}} `;
         });
      }
      promptRef.current?.focus();
   };

   const changeHandler: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      setPrompt(e.target.value);
      setError("");
   };

   const onVersionSelect = (_: string, i: number) => {
      setVersion(`${i + 1}`);
      setPrompt(promptsArr[i].prompt);
   };

   const updatePromptVersion = (
      version: number,
      target: "content_generation" | "scrape_website"
   ) => {
      switchPrompts(version, target);
      setVersion(`${promptsArr.length}`);
   };

   useEffect(() => {
      setPrompt(promptsArr.at(-1)!.prompt);
      setVersion(`${promptsArr.length}`);
   }, [promptsArr]);

   return (
      <form>
         <div className="flex flex-col gap-3 w-full">
            <label className="font-medium text-lg capitalize">
               {target === "scrape_website"
                  ? "Scrape brand website"
                  : "Content generation"}
            </label>
            <div className="flex flex-wrap">
               <div className="flex gap-1">
                  {placeholders.map((ph) => (
                     <button
                        key={ph}
                        onClick={() => addPlaceholder(ph)}
                        type="button"
                        className="bg-white py-1 px-2 text-[#03543F] text-sm rounded-md">{`{${ph}}`}</button>
                  ))}
               </div>
               <div className="ml-auto flex items-center gap-2">
                  <span>Version</span>
                  <Dropdown
                     currentValue={version}
                     options={Array.from(
                        { length: promptsArr.length },
                        (_, i) => String(i + 1)
                     )}
                     onUpdateContext={onVersionSelect}
                  />
               </div>
            </div>
            <textarea
               ref={promptRef}
               value={prompt}
               onChange={changeHandler}
               className="w-full h-[200px] outline-none p-2 resize-none rounded-sm whitespace-pre-wrap"
            />
            {error !== "" && (
               <p className="text-sm text-[#F05252] font-medium">{error}</p>
            )}
            <div className="flex gap-3 ">
               <SavePromptBtn
                  prompt={prompt}
                  setErrorMsg={setError}
                  target={target}
                  addPrompts={addPrompts}
               />
               <ResetPromptBtn
                  version={Number(version)}
                  token={profile?.token ?? ""}
                  target={target}
                  switchPrompts={updatePromptVersion}
               />
            </div>
         </div>
      </form>
   );
}
