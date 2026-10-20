/* eslint-disable @typescript-eslint/no-explicit-any *//* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme";
import {
  Settings,
  Palette,
  Globe,
  Wrench,
  Save,
  UploadCloud,
  CheckCircle2,
  Image as ImageIcon,
  Search,
  ShieldAlert,
  Link as LinkIcon,
} from "lucide-react";

const TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "seo", label: "SEO & Meta", icon: Globe },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
];

export default function WebSettingsPage() {
  // useTheme থেকে setPrimaryColor বা updateTheme বের করার চেষ্টা করা হলো
  const themeContext = useTheme() as any;
  const { primaryColor } = themeContext;
  const setPrimaryColor =
    themeContext.setPrimaryColor ||
    themeContext.updateTheme ||
    themeContext.setColor;

  const brandColor = primaryColor || "#2ed573";

  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States
  const [selectedColor, setSelectedColor] = useState(brandColor);
  const [isMaintenance, setIsMaintenance] = useState(false);

  // যদি গ্লোবাল কালার বদলায়, লোকাল স্টেটও সিঙ্ক হবে
  useEffect(() => {
    setSelectedColor(brandColor);
  }, [brandColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);

    // ১. গ্লোবাল থিম আপডেট (যদি useTheme-এ ফাংশন থাকে)
    if (setPrimaryColor) {
      setPrimaryColor(newColor);
    }

    // ২. CSS Variable আপডেট (টেইলউইন্ড কনফিগারেশনে থাকলে কাজ করবে)
    document.documentElement.style.setProperty("--primary", newColor);
    document.documentElement.style.setProperty("--primary-color", newColor);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Globe className="h-7 w-7" style={{ color: selectedColor }} />
              Web Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure your website's identity, SEO, and maintenance settings.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: selectedColor }}
          >
            <Save className="h-4 w-4" />{" "}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-6 right-6 z-50 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 fade-in">
            <CheckCircle2 className="h-5 w-5" /> Settings saved successfully!
          </div>
        )}

        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-4 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "" : "text-gray-400"}`}
                    style={isActive ? { color: selectedColor } : {}}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 p-6 md:p-8">
            <form onSubmit={handleSave}>
              {/* ================= GENERAL TAB ================= */}
              {activeTab === "general" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      General Settings
                    </h2>
                    <p className="text-sm text-gray-500">
                      Basic information about your website.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Site Name *
                      </label>
                      <input
                        type="text"
                        defaultValue="My SaaS App"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                        style={
                          { "--tw-ring-color": `${selectedColor}40` } as any
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Tagline
                      </label>
                      <input
                        type="text"
                        defaultValue="The best SaaS platform"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                        style={
                          { "--tw-ring-color": `${selectedColor}40` } as any
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Support Email
                      </label>
                      <input
                        type="email"
                        defaultValue="support@example.com"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                        style={
                          { "--tw-ring-color": `${selectedColor}40` } as any
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Support Phone
                      </label>
                      <input
                        type="text"
                        defaultValue="+1 234 567 890"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                        style={
                          { "--tw-ring-color": `${selectedColor}40` } as any
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= BRANDING TAB ================= */}
              {activeTab === "branding" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Branding & Appearance
                    </h2>
                    <p className="text-sm text-gray-500">
                      Manage your logos and primary theme colors.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Primary Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          <UploadCloud
                            className="h-6 w-6"
                            style={{ color: selectedColor }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Click to upload
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Favicon
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          <ImageIcon
                            className="h-6 w-6"
                            style={{ color: selectedColor }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Click to upload
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Theme Color Picker */}
                  <div className="space-y-2 pt-4">
                    <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
                      <span>Primary Theme Color</span>
                      <span className="text-[10px] text-gray-400 normal-case font-normal">
                        Changes apply globally instantly
                      </span>
                    </label>
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                      <div
                        className="h-12 w-12 rounded-lg shadow-inner border border-gray-200"
                        style={{ backgroundColor: selectedColor }}
                      ></div>
                      <div className="flex-1">
                        <input
                          type="color"
                          value={selectedColor}
                          onChange={handleColorChange} // আপডেট করা ফাংশন
                          className="w-full h-10 cursor-pointer rounded-lg bg-transparent"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="text"
                          value={selectedColor.toUpperCase()}
                          readOnly
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-center outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SEO TAB ================= */}
              {activeTab === "seo" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      SEO & Tracking
                    </h2>
                    <p className="text-sm text-gray-500">
                      Optimize your site for search engines and analytics.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        defaultValue="My SaaS App - Best Platform"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                        style={
                          { "--tw-ring-color": `${selectedColor}40` } as any
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Meta Description
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="The most powerful SaaS platform for your business."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none resize-none"
                        style={
                          { "--tw-ring-color": `${selectedColor}40` } as any
                        }
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <Search className="h-3 w-3" /> Google Analytics ID
                        </label>
                        <input
                          type="text"
                          placeholder="G-XXXXXXXXXX"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono"
                          style={
                            { "--tw-ring-color": `${selectedColor}40` } as any
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                          <LinkIcon className="h-3 w-3" /> Facebook Pixel ID
                        </label>
                        <input
                          type="text"
                          placeholder="1234567890"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono"
                          style={
                            { "--tw-ring-color": `${selectedColor}40` } as any
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= MAINTENANCE TAB ================= */}
              {activeTab === "maintenance" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Maintenance Mode
                    </h2>
                    <p className="text-sm text-gray-500">
                      Temporarily disable public access to your website.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
                    <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-800">
                        Enable Maintenance Mode
                      </h3>
                      <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        When enabled, all visitors will see a "Under
                        Maintenance" page.
                      </p>

                      <label className="flex items-center gap-3 mt-4 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isMaintenance}
                            onChange={(e) => setIsMaintenance(e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`block w-10 h-6 rounded-full transition-colors ${isMaintenance ? "bg-amber-500" : "bg-gray-300"}`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isMaintenance ? "translate-x-4" : ""}`}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {isMaintenance ? "ON" : "OFF"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
