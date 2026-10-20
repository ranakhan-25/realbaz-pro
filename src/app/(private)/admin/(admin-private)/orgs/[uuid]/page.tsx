/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import Link from "next/link";

export default function OrgDetailPage({
  params,
}: {
  params: { uuid: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    "overview",
    "users",
    "subscriptions",
    "usage",
    "audit",
    "config",
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Organization Profile</h1>
          <p className="text-gray-500 text-sm">UUID: {params.uuid}</p>
        </div>
        <Link href="/admin/orgs" className="text-blue-600 hover:underline">
          &larr; Back to List
        </Link>
      </div>

      <div className="border-b mb-4">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="text-sm text-gray-500">Users</h3>
              <p className="text-xl font-bold">12</p>
            </div>
            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="text-sm text-gray-500">Projects</h3>
              <p className="text-xl font-bold">5</p>
            </div>
            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="text-sm text-gray-500">Storage Used</h3>
              <p className="text-xl font-bold">2.4 GB</p>
            </div>
            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="text-sm text-gray-500">Status</h3>
              <p className="text-xl font-bold text-green-600">Active</p>
            </div>
          </div>
        )}
        {activeTab !== "overview" && (
          <div className="text-center py-10 text-gray-500">
            <p>{activeTab} data will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
