import { useState } from "react";

import Header from "./Header";

import Sidebar from "./Sidebar";

const AppLayout = ({
  children,
}) => {

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  const toggleSidebar =
    () => {

      setIsSidebarOpen(
        !isSidebarOpen
      );
    };

  return (

    <div
      className="
      h-screen
      overflow-hidden
      bg-slate-50
      flex
      "
    >

      {/* SIDEBAR */}

      <div className="shrink-0">

        <Sidebar
          isSidebarOpen={
            isSidebarOpen
          }
          toggleSidebar={
            toggleSidebar
          }
        />

      </div>

      {/* MAIN CONTENT */}

      <div
        className="
        flex-1
        flex
        flex-col
        overflow-hidden
        "
      >

        {/* HEADER */}

        <Header
          toggleSidebar={
            toggleSidebar
          }
        />

        {/* PAGE CONTENT */}

        <main
          className="
          flex-1
          overflow-y-auto
          p-6
          "
        >

          {children}

        </main>

      </div>

    </div>
  );
};

export default AppLayout;