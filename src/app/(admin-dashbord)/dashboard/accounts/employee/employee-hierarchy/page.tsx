"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Minus, Plus, ZoomIn, ZoomOut, RotateCcw, Users } from "lucide-react";

// --- Data Interface (Future API Ready) ---
export interface EmployeeNode {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  role: string;
  isExpanded?: boolean;
  children?: EmployeeNode[];
}

// Initial Mock Data (Matching Screenshot)
const initialHierarchyData: EmployeeNode = {
  id: "1",
  name: "Tazmul Reza",
  status: "Active",
  role: "Executive",
  isExpanded: true,
  children: [
    {
      id: "2",
      name: "Rifat Hosain",
      status: "Active",
      role: "Software Engineer",
    },
    {
      id: "3",
      name: "Mohin Uddin",
      status: "Active",
      role: "Tea Boy",
    },
  ],
};

export default function EmployeeHierarchyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hierarchyData, setHierarchyData] = useState<EmployeeNode>(initialHierarchyData);
  const [scale, setScale] = useState<number>(1);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  // --- Mouse Wheel Zoom Implementation ---
  useEffect(() => {
    const container = graphContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSensitivity = 0.0015;
      const delta = -e.deltaY * zoomSensitivity;
      setScale((prevScale) => Math.min(Math.max(0.4, prevScale + delta), 2.5));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Zoom Button Handlers
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.15, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => setScale(1);

  // Toggle Children Visibility
  const toggleExpand = () => {
    setHierarchyData((prev) => ({
      ...prev,
      isExpanded: !prev.isExpanded,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200 flex flex-col justify-between">
      <div>
        {/* Breadcrumb / Title Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-[#131c31] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/10 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Employee Hierarchy
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual organization structure and reporting chain
              </p>
            </div>
          </div>
        </div>

        {/* Main Workspace Card */}
        <div className="bg-white dark:bg-[#080d1a] rounded-xl shadow-lg border border-slate-200 dark:border-[#131c31] p-5 mb-6">
          
          {/* Top Bar Controls (Search & Zoom Controllers) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            
            {/* Interactive Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#030712] p-1.5 rounded-lg border border-slate-200 dark:border-[#1e293b]">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2 text-slate-500 dark:text-slate-400">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Right Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search... type ? to get help."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Graph Interactive Viewport Container */}
          <div
            ref={graphContainerRef}
            className="w-full min-h-[480px] bg-slate-50/50 dark:bg-[#030712]/50 border border-dashed border-slate-200 dark:border-[#131c31] rounded-xl flex items-center justify-center p-8 overflow-hidden cursor-grab active:cursor-grabbing select-none relative"
          >
            {/* Zoomable Canvas Area */}
            <div
              className="transition-transform duration-150 ease-out flex flex-col items-center"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              {/* Root Employee Card */}
              <div className="relative group">
                <div className="bg-[#2e4c4e] dark:bg-[#1a383a] text-white px-8 py-3.5 rounded-lg shadow-lg border border-[#3e6365] dark:border-[#284b4d] text-center min-w-[220px] transition-all group-hover:border-teal-400/50">
                  <div className="font-semibold text-sm tracking-wide">
                    {hierarchyData.name} ({hierarchyData.status})
                  </div>
                  <div className="text-xs text-slate-200 dark:text-slate-300 mt-0.5 font-light">
                    {hierarchyData.role}
                  </div>
                </div>
              </div>

              {/* Connecting Line Down from Root */}
              {hierarchyData.children && hierarchyData.children.length > 0 && (
                <>
                  <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />

                  {/* Expand / Collapse Toggle Button */}
                  <button
                    onClick={toggleExpand}
                    className="w-6 h-6 rounded-full bg-white dark:bg-[#080d1a] border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-teal-500 hover:text-teal-500 dark:hover:text-teal-400 transition-colors shadow-sm z-10"
                    title={hierarchyData.isExpanded ? "Collapse" : "Expand"}
                  >
                    {hierarchyData.isExpanded ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Children Tree Branch */}
                  {hierarchyData.isExpanded && (
                    <div className="flex flex-col items-center">
                      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />

                      {/* Children Container */}
                      <div className="relative flex items-start justify-center gap-12 pt-0">
                        {/* Horizontal Connector Bridge Line */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-slate-300 dark:bg-slate-700" />

                        {hierarchyData.children.map((child) => (
                          <div key={child.id} className="flex flex-col items-center relative">
                            {/* Vertical Line down to Child Card */}
                            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />

                            {/* Child Card */}
                            <div className="bg-[#2e4c4e] dark:bg-[#1a383a] text-white px-7 py-3 rounded-lg shadow-md border border-[#3e6365] dark:border-[#284b4d] text-center min-w-[200px] transition-all hover:border-teal-400/50">
                              <div className="font-semibold text-sm tracking-wide">
                                {child.name} ({child.status})
                              </div>
                              <div className="text-xs text-slate-200 dark:text-slate-300 mt-0.5 font-light">
                                {child.role}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-[#131c31] pt-4 mt-auto">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}