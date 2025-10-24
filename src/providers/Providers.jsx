"use client";
import { ReactQueryProvider } from "./ReactQueryProvider"

export const Providers = ({children}) => {
    return (
        <ReactQueryProvider>
            {children}
        </ReactQueryProvider>
    )
}