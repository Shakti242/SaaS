import Props  from "next/script";
import React from "react";
import Sidebar from '@/components/sidebar';
import InfoBar from "@/components/infobar";

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
    return (
        <div className="flex overflow-hidden h-screen">
            <Sidebar />
            <div className="flex flex-col flex-grow">
                <InfoBar />
                <div className="flex-grow">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Layout;
