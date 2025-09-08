import React, { useContext, useState } from "react";

import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { UsersContext } from "../../context/UsersContext";
import { useAuth } from "../../context/AuthContext";
import posthog from "../../helpers/posthog";

function TableDataCell({ content }: { content: string | number }) {
   return (
      <td className="user-data-cell py-3 px-4 max-w-[200px]">
         <div className="w-full overflow-x-auto box-border group-hover:text-white p-0 text-[#111928] font-medium">
            {content}
         </div>
      </td>
   );
}

export default function UsersTable() {
   const usersContext = useContext(UsersContext);
   const { profile } = useAuth();
   const [page, setPage] = useState(1);
   const navigate = useNavigate();

   const handleChangePage = (incr: number) => {
      const newPage = page + incr;

      if (newPage > 0 && newPage * 10 - 9 <= usersContext.total)
         setPage(newPage);
      if (newPage * 10 > usersContext.users.length) {
         usersContext.handleNextPage();
      }
   };

   const handleCellClick = (id: string) => {
      if (posthog.__loaded) {
         posthog.capture("Admin Accessed User Management", {
            distinct_id: profile?.id,
         });
      }

      navigate(id);
   };

   return (
      <div className="h-5">
         <table className="w-full border-collapse text-[14px] rounded-t-md overflow-hidden">
            <thead>
               <tr className="bg-[#5145CD] text-white p-2 rounded-t-md text-left font-semibold">
                  <th className="py-3 px-4 capitalize">name</th>
                  <th className="py-3 px-4 capitalize">email</th>
                  <th className="py-3 px-4 capitalize">business</th>
                  <th className="py-3 px-4 capitalize">plan</th>
                  <th className="py-3 px-4 capitalize">campaigns</th>
                  <th className="py-3 px-4 capitalize">joined</th>
               </tr>
            </thead>
            <tbody>
               {usersContext.users
                  .slice(page * 10 - 10, page * 10)
                  .map((u, i) => {
                     const date = new Date(u.created_at * 1000);
                     const formattedDate = new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                     }).format(date);
                     return (
                        <tr
                           key={u.id}
                           onClick={() => handleCellClick(u.id)}
                           className={`group border-b border-[#ddd] ${
                              i % 2 ? "bg-[#5145CD1A]" : "bg-transparent"
                           } hover:bg-[#5145CD] cursor-pointer`}>
                           <TableDataCell content={u?.name} />
                           <TableDataCell content={u?.email} />
                           <TableDataCell content={u?.business || "None"} />
                           <TableDataCell content={u?.plan} />
                           <TableDataCell content={u?.totalCampaigns} />
                           <TableDataCell content={formattedDate} />
                        </tr>
                     );
                  })}
            </tbody>
         </table>
         <div className="bg-[#5145CD] py-2 flex items-center justify-center text-white text-sm rounded-b-md">
            <button type="button" onClick={() => handleChangePage(-1)}>
               <MdKeyboardArrowLeft color="white" size={20} />
            </button>
            <span>
               {page * 10 - 9} - {page * 10} of {usersContext.total}
            </span>
            <button type="button" onClick={() => handleChangePage(1)}>
               <MdKeyboardArrowRight color="white" size={20} />
            </button>
         </div>
      </div>
   );
}
