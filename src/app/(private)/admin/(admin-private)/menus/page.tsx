/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import MenuItemModal from "./components/MenuItemModal";
import { useTheme } from "@/lib/theme";
import {
  GripVertical,
  Edit3,
  Trash2,
  Plus,
  CornerDownRight,
  Layers,
  Search,
} from "lucide-react";

// ডামি ডেটা
const DUMMY_MENUS = [
  {
    id: "1",
    title: "Home",
    url: "/",
    icon: "Home",
    order_no: 1,
    parent_id: null,
    is_active: true,
  },
  {
    id: "2",
    title: "About Us",
    url: "/about",
    icon: "Info",
    order_no: 2,
    parent_id: null,
    is_active: true,
  },
  {
    id: "3",
    title: "Services",
    url: "/services",
    icon: "Briefcase",
    order_no: 3,
    parent_id: null,
    is_active: true,
  },
  {
    id: "4",
    title: "Web Development",
    url: "/services/web",
    icon: "Code",
    order_no: 1,
    parent_id: "3",
    is_active: true,
  },
  {
    id: "5",
    title: "Contact",
    url: "/contact",
    icon: "Phone",
    order_no: 4,
    parent_id: null,
    is_active: false,
  },
];

export default function MenuManagementPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);

  // ডেটা ফেচ
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/menus");
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      if (!data || data.length === 0) {
        setMenus(DUMMY_MENUS);
        setIsUsingDummy(true);
      } else {
        setMenus(data);
        setIsUsingDummy(false);
      }
    } catch (error) {
      setMenus(DUMMY_MENUS);
      setIsUsingDummy(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleSave = async (payload: any) => {
    const isEdit = !!payload.id;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/menus/${payload.id}` : "/api/menus";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const savedMenu = await res.json();
      if (isEdit)
        setMenus((prev) =>
          prev.map((m) => (m.id === savedMenu.id ? savedMenu : m)),
        );
      else setMenus((prev) => [...prev, savedMenu]);
    } catch (error) {
      if (isEdit)
        setMenus((prev) =>
          prev.map((m) => (m.id === payload.id ? { ...m, ...payload } : m)),
        );
      else
        setMenus((prev) => [
          ...prev,
          { ...payload, id: Date.now().toString(), order_no: menus.length + 1 },
        ]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await fetch(`/api/menus/${id}`, { method: "DELETE" });
      setMenus((prev) => prev.filter((m) => m.id !== id && m.parent_id !== id));
    } catch (error) {
      setMenus((prev) => prev.filter((m) => m.id !== id && m.parent_id !== id));
    }
  };

  const handleEdit = (menu: any) => {
    setSelectedMenu(menu);
    setDefaultParentId(menu.parent_id);
    setIsModalOpen(true);
  };

  const handleCreate = (parentId: string | null = null) => {
    setSelectedMenu(null);
    setDefaultParentId(parentId);
    setIsModalOpen(true);
  };

  const renderMenuTree = (parentId: string | null = null, depth = 0) => {
    return menus
      .filter((m) => m.parent_id === parentId)
      .sort((a, b) => a.order_no - b.order_no)
      .map((menu) => (
        <div key={menu.id} className="group">
          <div
            className={`flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50/80 transition-all duration-200 ${depth > 0 ? "bg-gray-50/30" : ""}`}
            style={{ paddingLeft: `${depth * 2 + 1}rem` }}
          >
            <div className="flex items-center space-x-3">
              <GripVertical className="h-5 w-5 text-gray-300 group-hover:text-gray-500 cursor-grab transition-colors" />
              {depth > 0 && (
                <CornerDownRight className="h-4 w-4 text-gray-400" />
              )}

              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800 text-sm">
                    {menu.title}
                  </span>
                  {!menu.is_active && (
                    <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border border-red-100">
                      Hidden
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 font-mono mt-0.5">
                  {menu.url}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => handleCreate(menu.id)}
                className="p-1.5 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-gray-500 hover:text-gray-800"
                title="Add Sub-menu"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleEdit(menu)}
                className="p-1.5 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-blue-500"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(menu.id)}
                className="p-1.5 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {renderMenuTree(menu.id, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Layers className="h-7 w-7" style={{ color: brandColor }} />
              Navigation Menus
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your website's structure, drag to reorder, and organize
              sub-menus.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menus..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all shadow-sm"
                style={{ "--tw-ring-color": brandColor } as any}
              />
            </div>
            <button
              onClick={() => handleCreate(null)}
              className="px-4 py-2 rounded-lg text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
              style={{ backgroundColor: brandColor }}
            >
              <Plus className="h-4 w-4" /> New Item
            </button>
          </div>
        </div>

        {isUsingDummy && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              API is currently offline. Showing <strong>Demo Data</strong> for
              preview.
            </span>
          </div>
        )}

        {/* Main List Container */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"
                style={{ borderColor: brandColor }}
              ></div>
              <p className="text-sm">Loading menus...</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <Layers className="h-12 w-12 text-gray-200 mb-4" />
              <p className="text-lg font-medium text-gray-800">No menus yet</p>
              <p className="text-sm text-gray-400 mb-6">
                Create your first navigation item to get started.
              </p>
              <button
                onClick={() => handleCreate(null)}
                className="px-5 py-2.5 rounded-lg text-white font-medium shadow-sm"
                style={{ backgroundColor: brandColor }}
              >
                + Create Menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col">{renderMenuTree(null)}</div>
          )}
        </div>
      </div>

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        menuData={selectedMenu}
        defaultParentId={defaultParentId}
        allMenus={menus}
      />
    </div>
  );
}
