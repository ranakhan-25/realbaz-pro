/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";
import {
  Search,
  Plus,
  FileCog,
  Zap,
  Settings2,
  ChevronRight,
  Edit3,
  Trash2,
  Box,
} from "lucide-react";
import FeatureFormModal from "./components/FeatureFormModal";
import ActionFormModal from "./components/ActionFormModal";

// ডামি ডেটা
const DUMMY_FEATURES = [
  {
    uuid: "f1",
    module: "Organization",
    code: "org",
    name: "Organizations List",
    description: "Main list view for organizations",
    order_no: 1,
    is_core: true,
    status: "active",
  },
  {
    uuid: "f2",
    module: "Organization",
    code: "org.create",
    name: "Create Organization",
    description: "Form to create a new organization",
    order_no: 2,
    is_core: true,
    status: "active",
  },
  {
    uuid: "f3",
    module: "Users",
    code: "user",
    name: "User Management",
    description: "Manage system users and roles",
    order_no: 3,
    is_core: true,
    status: "active",
  },
  {
    uuid: "f4",
    module: "Billing",
    code: "billing",
    name: "Invoices",
    description: "View and manage invoices",
    order_no: 4,
    is_core: false,
    status: "inactive",
  },
];

const DUMMY_ACTIONS = [
  {
    uuid: "a1",
    feature_code: "org",
    code: "view",
    name: "View Organization",
    label: "View",
  },
  {
    uuid: "a2",
    feature_code: "org",
    code: "create",
    name: "Create Organization",
    label: "Create",
  },
  {
    uuid: "a3",
    feature_code: "org",
    code: "update",
    name: "Update Organization",
    label: "Update",
  },
  {
    uuid: "a4",
    feature_code: "org",
    code: "delete",
    name: "Delete Organization",
    label: "Delete",
  },
  {
    uuid: "a5",
    feature_code: "org.create",
    code: "create",
    name: "Submit Form",
    label: "Create",
  },
  {
    uuid: "a6",
    feature_code: "user",
    code: "view",
    name: "View Users",
    label: "View",
  },
  {
    uuid: "a7",
    feature_code: "user",
    code: "export",
    name: "Export Users",
    label: "Export",
  },
];

export default function FeaturesPage() {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [features, setFeatures] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // Selection States
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [editingAction, setEditingAction] = useState<any>(null);

  // ফেচ ডেটা
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [fRes, aRes] = await Promise.all([fetch("/api/features"), fetch("/api/actions")]);
        // ...
        setTimeout(() => {
          setFeatures(DUMMY_FEATURES);
          setActions(DUMMY_ACTIONS);
          setSelectedFeature(DUMMY_FEATURES[0]);
          setIsUsingDummy(true);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setFeatures(DUMMY_FEATURES);
        setActions(DUMMY_ACTIONS);
        setSelectedFeature(DUMMY_FEATURES[0]);
        setIsUsingDummy(true);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ফিল্টার ফিচার
  const filteredFeatures = useMemo(() => {
    return features.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.module.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [features, searchQuery]);

  // সিলেক্টেড ফিচারের অ্যাকশন
  const currentActions = useMemo(() => {
    if (!selectedFeature) return [];
    return actions.filter((a) => a.feature_code === selectedFeature.code);
  }, [actions, selectedFeature]);

  // --- CRUD Operations ---
  const handleSaveFeature = (payload: any) => {
    if (editingFeature) {
      setFeatures((prev) =>
        prev.map((f) =>
          f.uuid === editingFeature.uuid ? { ...f, ...payload } : f,
        ),
      );
      if (selectedFeature?.uuid === editingFeature.uuid)
        setSelectedFeature({ ...selectedFeature, ...payload });
    } else {
      const newFeature = {
        ...payload,
        uuid: Date.now().toString(),
        status: "active",
      };
      setFeatures((prev) => [...prev, newFeature]);
    }
    setIsFeatureModalOpen(false);
  };

  const handleDeleteFeature = (uuid: string) => {
    if (!confirm("Delete this feature and its actions?")) return;
    setFeatures((prev) => prev.filter((f) => f.uuid !== uuid));
    setActions((prev) =>
      prev.filter((a) => a.feature_code !== selectedFeature?.code),
    );
    if (selectedFeature?.uuid === uuid) setSelectedFeature(null);
  };

  const handleSaveAction = (payload: any) => {
    if (editingAction) {
      setActions((prev) =>
        prev.map((a) =>
          a.uuid === editingAction.uuid ? { ...a, ...payload } : a,
        ),
      );
    } else {
      setActions((prev) => [
        ...prev,
        {
          ...payload,
          uuid: Date.now().toString(),
          feature_code: selectedFeature.code,
        },
      ]);
    }
    setIsActionModalOpen(false);
  };

  const handleDeleteAction = (uuid: string) => {
    if (!confirm("Delete this action?")) return;
    setActions((prev) => prev.filter((a) => a.uuid !== uuid));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <FileCog className="h-7 w-7" style={{ color: brandColor }} />
              Features & Actions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage system features and the specific actions allowed within
              them.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingFeature(null);
              setIsFeatureModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="h-4 w-4" /> Create Feature
          </button>
        </div>

        {isUsingDummy && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              API is offline. Showing <strong>Demo Data</strong>.
            </span>
          </div>
        )}

        {/* Split View Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Left Side: Features List */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredFeatures.map((feature) => {
                const isSelected = selectedFeature?.uuid === feature.uuid;
                return (
                  <div
                    key={feature.uuid}
                    onClick={() => setSelectedFeature(feature)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all group ${
                      isSelected
                        ? "border-transparent shadow-md"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: `${brandColor}10`,
                            borderColor: `${brandColor}30`,
                          }
                        : {}
                    }
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {feature.module}
                        </span>
                        {feature.is_core && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            Core
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFeature(feature);
                            setIsFeatureModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-500 rounded"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFeature(feature.uuid);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 text-sm">
                      {feature.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] font-mono text-gray-400">
                        {feature.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${feature.status === "active" ? "text-green-600 bg-green-50" : "text-gray-500 bg-gray-100"}`}
                      >
                        {feature.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Actions Panel */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden">
            {selectedFeature ? (
              <>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="h-5 w-5" style={{ color: brandColor }} />
                      Actions for: {selectedFeature.name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Define the operations users can perform on this feature.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAction(null);
                      setIsActionModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                    style={{ backgroundColor: brandColor }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Action
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
                  {currentActions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <Box className="h-12 w-12 mb-3 text-gray-200" />
                      <p className="text-sm">
                        No actions defined for this feature.
                      </p>
                      <p className="text-xs mt-1">
                        Click "Add Action" to create one.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentActions.map((action) => (
                        <div
                          key={action.uuid}
                          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative"
                        >
                          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingAction(action);
                                setIsActionModalOpen(true);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-500"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAction(action.uuid)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="p-1.5 rounded-lg"
                              style={{ backgroundColor: `${brandColor}15` }}
                            >
                              <Zap
                                className="h-4 w-4"
                                style={{ color: brandColor }}
                              />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">
                              {action.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 font-medium">
                            {action.name}
                          </p>
                          <span className="inline-block mt-2 text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            {action.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6">
                <Settings2 className="h-16 w-16 mb-4 text-gray-200" />
                <h3 className="text-lg font-semibold text-gray-600">
                  No Feature Selected
                </h3>
                <p className="text-sm text-center mt-2 max-w-sm">
                  Select a feature from the left panel to view and manage its
                  actions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <FeatureFormModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        onSave={handleSaveFeature}
        featureData={editingFeature}
      />
      <ActionFormModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSave={handleSaveAction}
        actionData={editingAction}
        featureCode={selectedFeature?.code}
      />
    </div>
  );
}
