/* eslint-disable prettier/prettier */
"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { ChevronDown, ChevronRight, Check } from "lucide-react";

// আপনার সিস্টেমের ফিচার এবং অ্যাকশনগুলোর ডামি স্ট্রাকচার
const PERMISSION_STRUCTURE = [
  {
    module: "Organization Management",
    features: [
      { code: "org.view", name: "View Organizations" },
      { code: "org.create", name: "Create Organization" },
      { code: "org.edit", name: "Edit Organization" },
      { code: "org.delete", name: "Delete Organization" },
    ],
  },
  {
    module: "User Management",
    features: [
      { code: "user.view", name: "View Users" },
      { code: "user.create", name: "Create Users" },
      { code: "user.edit", name: "Edit Users" },
      { code: "user.delete", name: "Delete Users" },
      { code: "user.roles", name: "Assign Roles" },
    ],
  },
  {
    module: "Billing & Plans",
    features: [
      { code: "plan.view", name: "View Plans" },
      { code: "plan.manage", name: "Manage Plans & Pricing" },
      { code: "billing.export", name: "Export Invoices" },
    ],
  },
];

const ACTIONS = ["view", "create", "edit", "delete", "approve", "export"];

interface Props {
  initialPermissions?: string[]; // e.g. ["org.view", "user.create"]
  onSave: (permissions: string[]) => void;
}

export default function PermissionMatrix({
  initialPermissions = [],
  onSave,
}: Props) {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [selectedPerms, setSelectedPerms] =
    useState<string[]>(initialPermissions);
  const [expandedModules, setExpandedModules] = useState<string[]>([
    "Organization Management",
    "User Management",
  ]);

  const toggleModule = (moduleName: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((m) => m !== moduleName)
        : [...prev, moduleName],
    );
  };

  const togglePermission = (featureCode: string, action: string) => {
    const permString = `${featureCode}.${action}`;
    setSelectedPerms((prev) =>
      prev.includes(permString)
        ? prev.filter((p) => p !== permString)
        : [...prev, permString],
    );
  };

  // Check if a specific action is selected for a feature
  const isChecked = (featureCode: string, action: string) => {
    return selectedPerms.includes(`${featureCode}.${action}`);
  };

  // Toggle all actions for a specific feature row
  const toggleRow = (featureCode: string, isCheckedRow: boolean) => {
    const rowPerms = ACTIONS.map((action) => `${featureCode}.${action}`);
    if (isCheckedRow) {
      setSelectedPerms((prev) => prev.filter((p) => !rowPerms.includes(p)));
    } else {
      setSelectedPerms((prev) => [...new Set([...prev, ...rowPerms])]);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">
                Module / Feature
              </th>
              {ACTIONS.map((action) => (
                <th
                  key={action}
                  className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center capitalize"
                >
                  {action}
                </th>
              ))}
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                All
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PERMISSION_STRUCTURE.map((moduleGroup) => {
              const isExpanded = expandedModules.includes(moduleGroup.module);

              return (
                <tbody key={moduleGroup.module} className="contents">
                  {/* Module Header Row */}
                  <tr
                    className="bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleModule(moduleGroup.module)}
                  >
                    <td colSpan={ACTIONS.length + 2} className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="font-semibold text-gray-800 text-sm">
                          {moduleGroup.module}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Feature Rows */}
                  {isExpanded &&
                    moduleGroup.features.map((feature) => {
                      const allChecked = ACTIONS.every((action) =>
                        isChecked(feature.code, action),
                      );

                      return (
                        <tr
                          key={feature.code}
                          className="hover:bg-gray-50/30 transition-colors group"
                        >
                          <td className="px-8 py-3">
                            <span className="text-sm text-gray-700 font-medium">
                              {feature.name}
                            </span>
                            <span className="block text-[10px] text-gray-400 font-mono mt-0.5">
                              {feature.code}
                            </span>
                          </td>

                          {ACTIONS.map((action) => (
                            <td key={action} className="px-4 py-3 text-center">
                              <label className="inline-flex items-center justify-center cursor-pointer p-1">
                                <input
                                  type="checkbox"
                                  checked={isChecked(feature.code, action)}
                                  onChange={() =>
                                    togglePermission(feature.code, action)
                                  }
                                  className="w-4 h-4 rounded border-gray-300 transition-colors focus:ring-0"
                                  style={{ accentColor: brandColor }}
                                />
                              </label>
                            </td>
                          ))}

                          {/* Row Toggle (All) */}
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                toggleRow(feature.code, allChecked)
                              }
                              className={`p-1 rounded-md transition-colors ${allChecked ? "text-white" : "text-gray-400 hover:bg-gray-100"}`}
                              style={
                                allChecked
                                  ? { backgroundColor: brandColor }
                                  : {}
                              }
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sticky Footer for Save */}
      <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          <strong className="text-gray-900">{selectedPerms.length}</strong>{" "}
          permissions selected
        </span>
        <button
          onClick={() => onSave(selectedPerms)}
          className="px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
          style={{ backgroundColor: brandColor }}
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
}
