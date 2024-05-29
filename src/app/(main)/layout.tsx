import { Props } from "next/script";
import React from "react";
type props = { children: React.ReactNode }
const Layout = (props: Props) => {
    return(
        <div className="flex overflow-hidden h-screen">
            <div className="e-full"> {props.children}
            </div>
        </div>
    )
}

export default Layout