// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Use throughout your app instead of plain `useDispatch` and `useSelector`
 * Keeps typesafe access to the store for TypeScript.
 */

// Typed useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
