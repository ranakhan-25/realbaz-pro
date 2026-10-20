/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";
import {
  Search,
  Settings2,
  ShieldAlert,
  Eye,
  EyeOff,
  Edit3,
  Key,
  Save,
  Filter,
  Database,
} from "lucide-react";
import ConfigEditModal from "./components/ConfigEditModal";

const DUMMY_CONFIGS = [
  {
    uuid: "1",
    key: "app_name",
    category: "General",
    is_secret: false,
    value_json: '"My SaaS App"',
    updated_at: "2024-05-20",
  },
  {
    uuid: "2",
    key: "support_email",
    category: "General",
    is_secret: false,
    value_json: '"support@example.com"',
    updated_at: "2024-05-19",
  },
  {
    uuid: "3",
    key: "stripe_secret_key",
    category: "Payment",
    is_secret: true,
    value_json: '"sk_test_51Mz..."',
    updated_at: "2024-05-18",
  },
  {
    uuid: "4",
    key: "aws_s3_bucket",
    category: "Storage",
    is_secret: false,
    value_json: '"my-app-bucket"',
    updated_at: "2024-05-15",
  },
  {
    uuid: "5",
    key: "aws_access_key",
    category: "Storage",
    is_secret: true,
    value_json: '"AKIAIOSFODNN7..."',
    updated_at: "2024-05-15",
  },
  {
    uuid: "6",
    key: "enable_maintenance",
    category: "System",
    is_secret: false,
    value_json: "false",
    updated_at: "2024-05-21",
  },
];

export default function ConfigListPage() {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [configs, setConfigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // Modal & Filter States
  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [revealedSecrets, setRevealedSecrets] = useState<string[]>([]);

  // ফেচ ডেটা
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        // const res = await fetch("/api/config");
        // if (!res.ok) throw new Error("API Error");
        // const data = await res.json();
        // setConfigs(data);
        setTimeout(() => {
          setConfigs(DUMMY_CONFIGS);
          setIsUsingDummy(true);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setConfigs(DUMMY_CONFIGS);
        setIsUsingDummy(true);
        setIsLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  // Update Config
  const handleSave = async (payload: any) => {
    try {
      // await fetch(`/api/config/${selectedConfig.key}`, { method: "PUT", body: JSON.stringify(payload) });
      setConfigs((prev) =>
        prev.map((c) =>
          c.uuid === selectedConfig.uuid ? { ...c, ...payload } : c,
        ),
      );
    } catch (error) {
      setConfigs((prev) =>
        prev.map((c) =>
          c.uuid === selectedConfig.uuid ? { ...c, ...payload } : c,
        ),
      );
    }
    setIsModalOpen(false);
  };

  const toggleSecret = (uuid: string) => {
    setRevealedSecrets((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid],
    );
  };

  // Extract unique categories for filter
  const categories = useMemo(() => {
    return Array.from(new Set(configs.map((c) => c.category)));
  }, [configs]);

  // Filter Logic
  const filteredConfigs = useMemo(() => {
    return configs.filter((c) => {
      const matchesSearch = c.key
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || c.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [configs, searchQuery, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Settings2 className="h-7 w-7" style={{ color: brandColor }} />
              System Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage environment variables, API keys, and global system
              settings.
            </p>
          </div>
        </div>

        {isUsingDummy && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 shadow-sm">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <span>
              API is offline. Showing <strong>Demo Data</strong>. Do not use
              these keys in production.
            </span>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search configuration keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Category:</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 appearance-none min-w-[150px]"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Premium Table Layout */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Key & Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading configurations...
                    </td>
                  </tr>
                ) : filteredConfigs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-16 text-center flex flex-col items-center"
                    >
                      <Database className="h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-gray-500 font-medium">
                        No configuration found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredConfigs.map((config) => (
                    <tr
                      key={config.uuid}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${config.is_secret ? "bg-amber-50" : "bg-gray-50"}`}
                          >
                            {config.is_secret ? (
                              <Key className="h-4 w-4 text-amber-600" />
                            ) : (
                              <Settings2 className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-semibold text-gray-900">
                              {config.key}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                              {config.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {config.is_secret &&
                          !revealedSecrets.includes(config.uuid) ? (
                            <span className="font-mono text-sm text-gray-400 tracking-widest bg-gray-100 px-2 py-1 rounded">
                              ••••••••••••
                            </span>
                          ) : (
                            <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1.5 rounded-md text-gray-700 max-w-[300px] truncate block">
                              {config.value_json}
                            </code>
                          )}

                          {config.is_secret && (
                            <button
                              onClick={() => toggleSecret(config.uuid)}
                              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md transition-colors"
                            >
                              {revealedSecrets.includes(config.uuid) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {config.updated_at}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedConfig(config);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 ml-auto"
                          style={{ color: brandColor }}
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfigEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        configData={selectedConfig}
      />
    </div>
  );
}
