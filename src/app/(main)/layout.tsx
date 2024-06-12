import { Props } from "next/script";
import React from "react";
import Sidebar from '@/components/sidebar'
import InfoBar from "@/components/infobar";
type props = { children: React.ReactNode }
const Layout = (props: Props) => {
    return(
        <div className="flex overflow-hidden h-screen">
            <Sidebar />
            <div className="e-full">
                <InfoBar/>

                {props.children}
            </div>
        </div>
    )
}

export default Layout