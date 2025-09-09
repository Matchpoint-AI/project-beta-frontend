import { useCallback, useEffect, useReducer, useRef } from "react";
import { useAuth } from "../features/auth/context/AuthContext";

type TState<T = unknown> = {
   data: T | null;
   loading: boolean;
   error: string | null;
};
type TAction = {
   type: "FETCH_REQUEST" | "FETCH_SUCCESS" | "FETCH_FAILURE";
   payload?: unknown;
};

function reducer<T>(state: TState<T>, action: TAction): TState<T> {
   const { type, payload } = action;
   switch (type) {
      case "FETCH_REQUEST":
         return { ...state, loading: true, error: null };
      case "FETCH_SUCCESS":
         return { ...state, loading: false, data: payload as T };
      case "FETCH_FAILURE":
         return { ...state, loading: false, error: payload as string };
      default:
         return state;
   }
}

export default function useApi<T = unknown>(
   apiHandler: (action: { type: unknown; [key: string]: unknown }, token: string) => Promise<T>,
   action: { type: unknown; [key: string]: unknown },
   manual?: "TRIGGER" // the action won't trigger at first render
) {
   const [state, dispatch] = useReducer(reducer<T>, {
      data: null,
      loading: false,
      error: null,
   });

   const hasRun = useRef(false);
   const { profile } = useAuth();

   const fetchData = useCallback(async () => {
      if (!profile?.token) {
         dispatch({
            type: "FETCH_FAILURE",
            payload: "No authentication token available",
         });
         return;
      }

      dispatch({ type: "FETCH_REQUEST" });
      try {
         const response = await apiHandler(action, profile.token);
         dispatch({ type: "FETCH_SUCCESS", payload: response });
      } catch (error) {
         dispatch({ type: "FETCH_FAILURE", payload: error });
      }
   }, [action.type, apiHandler, profile?.token]);

   const triggerRequest = useCallback(async () => {
      await fetchData();
   }, [fetchData]);

   useEffect(() => {
      hasRun.current = true;
      if (manual) return;

      if (action) {
         fetchData();
      }
   }, [fetchData]);

   return { ...state, triggerRequest };
}
