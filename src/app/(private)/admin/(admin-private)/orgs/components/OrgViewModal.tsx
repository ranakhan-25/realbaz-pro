"use client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orgData: any;
}

export default function OrgViewModal({ isOpen, onClose, orgData }: Props) {
  if (!isOpen || !orgData) return null;

  return (
    // z-[999] এবং fixed inset-0 নিশ্চিত করবে এটি সবার উপরে থাকবে
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Organization Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{orgData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Slug</p>
            <p className="font-medium text-gray-900">{orgData.slug}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{orgData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">
              {orgData.phone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Plan</p>
            <p className="font-medium text-gray-900">{orgData.plan || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium text-gray-900 capitalize">
              {orgData.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trial Ends At</p>
            <p className="font-medium text-gray-900">
              {orgData.trial_ends_at || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium text-gray-900">
              {orgData.created_at || "N/A"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
