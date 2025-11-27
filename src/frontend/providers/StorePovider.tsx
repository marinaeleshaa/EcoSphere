"use client";

import { Provider } from 'react-redux';
import { store } from '../redux/store';
// import { store } from '@/frontend/redux/store';


export function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}