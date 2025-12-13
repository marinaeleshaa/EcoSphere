import { configureStore, combineReducers, Reducer } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistedState } from "redux-persist";
import storage from "redux-persist/lib/storage";
import FavSlice from "./Slice/FavSlice";
import AuthSlice from "./Slice/AuthSlice";
import UserSlice from "./Slice/UserSlice";
import CartSlice from "./Slice/CartSlice";

// Persist config
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["cart", "fav"], // persist ONLY the cart slice
};

// Combine all reducers
const rootReducer = combineReducers({
	fav: FavSlice,
	auth: AuthSlice,
	cart: CartSlice,
	user: UserSlice,
});

const persistedReducer =
	globalThis.window === undefined
		? rootReducer
		: persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer as Reducer,
	middleware: (getDefault) =>
		getDefault({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		}),
	devTools: process.env.NODE_ENV !== "production",
});

// Persister for <PersistGate>
export const persister = persistStore(store);

// TS Types
export type RootState = ReturnType<typeof rootReducer> & PersistedState
export type AppDispatch = typeof store.dispatch;

export const selectIsHydrated = (state: RootState) => state._persist.rehydrated;