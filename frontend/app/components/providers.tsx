'use client';

import { ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "../app/store";

interface ProviderProps {
    children:ReactNode
}


const Providers:React.FC<ProviderProps>=({children})=>{
    return <Provider store={store}>{children}</Provider>
}

export default Providers