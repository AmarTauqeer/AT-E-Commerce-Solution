'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrateCart } from '../app/store/cart';


export default function ReduxHydrator({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        // This runs EXACTLY once when the browser loads the app
        dispatch(rehydrateCart());
    }, [dispatch]);

    return <>{children}</>;
}