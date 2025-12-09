"use client";

import { Provider } from "react-redux";
import { persister, store } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";

export function StoreProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persister}>
				{children}
			</PersistGate>
		</Provider>
	);
}
