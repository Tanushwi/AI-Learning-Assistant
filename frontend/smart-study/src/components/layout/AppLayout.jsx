import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (

    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Right Content */}
      <div className="flex-1 flex flex-col">

        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>

  );

};

export default AppLayout;