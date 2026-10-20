'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  FileText, 
  Folder, 
  Upload, 
  X, 
  File, 
  HardDrive, 
  Lock, 
  CheckCircle2, 
  Tag, 
  Calendar, 
  User, 
  Eye, 
  Download, 
  ShieldAlert,
  Layers
} from 'lucide-react';

// TypeScript Interface matching Feature 03.08: Project Documents (DMS)
interface ProjectDocument {
  id: string;
  projectUuid: string;
  title: string;
  category: 'Contracts' | 'Architectural Drawings' | 'Engineering Specs' | 'Permits & Approvals' | 'Financial Reports' | 'Site Inspection';
  version: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  accessLevel: 'Public' | 'Internal' | 'Confidential';
  tags: string[];
  remarks: string;
  hasFile: boolean;
}

// Initial Static Data
const initialDocuments: ProjectDocument[] = [
  {
    id: 'DOC-101',
    projectUuid: 'proj-skyline-001',
    title: 'Master Subcontractor Agreement - Phase 1',
    category: 'Contracts',
    version: 'v1.2',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    uploadedBy: 'Shamim Khan',
    uploadedDate: '2026-09-02',
    accessLevel: 'Confidential',
    tags: ['Legal', 'Contractor', 'Phase1'],
    remarks: 'Signed agreement with primary civil construction contractor.',
    hasFile: true
  },
  {
    id: 'DOC-102',
    projectUuid: 'proj-skyline-001',
    title: 'Structural Foundation Architectural Blueprint',
    category: 'Architectural Drawings',
    version: 'v2.0',
    fileType: 'DWG / PDF',
    fileSize: '18.4 MB',
    uploadedBy: 'Tanvir Ahmed',
    uploadedDate: '2026-09-05',
    accessLevel: 'Internal',
    tags: ['Blueprint', 'Structural', 'Foundation'],
    remarks: 'Approved structural drawings for foundation piling work.',
    hasFile: true
  },
  {
    id: 'DOC-103',
    projectUuid: 'proj-skyline-001',
    title: 'City Corporation Building Permit Approval',
    category: 'Permits & Approvals',
    version: 'v1.0',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    uploadedBy: 'Rahim Uddin',
    uploadedDate: '2026-09-10',
    accessLevel: 'Public',
    tags: ['Permit', 'Government', 'Compliance'],
    remarks: 'Official municipal approval certificate for 18-story building structure.',
    hasFile: true
  },
  {
    id: 'DOC-104',
    projectUuid: 'proj-skyline-001',
    title: 'Electrical Substation Engineering Specifications',
    category: 'Engineering Specs',
    version: 'v1.1',
    fileType: 'PDF',
    fileSize: '6.2 MB',
    uploadedBy: 'Shamim Khan',
    uploadedDate: '2026-09-14',
    accessLevel: 'Internal',
    tags: ['Electrical', 'Specs', 'HVAC'],
    remarks: 'Technical load requirements and cabling layout parameters.',
    hasFile: true
  },
  {
    id: 'DOC-105',
    projectUuid: 'proj-skyline-001',
    title: 'Q3 Concrete Strength & Quality Audit Report',
    category: 'Site Inspection',
    version: 'v1.0',
    fileType: 'PDF',
    fileSize: '3.5 MB',
    uploadedBy: 'Quality Assurance Team',
    uploadedDate: '2026-09-18',
    accessLevel: 'Internal',
    tags: ['QA', 'Inspection', 'Concrete'],
    remarks: 'Lab test results for cylinder compression test for Phase 2 columns.',
    hasFile: true
  }
];

export default function ProjectDocumentsPage() {
  // GET State
  const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('All');

  // POST State (Modal + Form)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Contracts' as ProjectDocument['category'],
    version: 'v1.0',
    accessLevel: 'Internal' as ProjectDocument['accessLevel'],
    tags: '',
    remarks: '',
    fileName: ''
  });

  // POST Handler (Create / Upload New Document)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDoc: ProjectDocument = {
      id: `DOC-${100 + documents.length + 1}`,
      projectUuid: 'proj-skyline-001',
      title: formData.title || 'Untitled Document',
      category: formData.category,
      version: formData.version || 'v1.0',
      fileType: formData.fileName ? formData.fileName.split('.').pop()?.toUpperCase() || 'PDF' : 'PDF',
      fileSize: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      uploadedBy: 'Shamim Khan',
      uploadedDate: new Date().toISOString().split('T')[0],
      accessLevel: formData.accessLevel,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : ['Project'],
      remarks: formData.remarks || 'No additional notes provided.',
      hasFile: true
    };

    setDocuments([newDoc, ...documents]);
    setIsModalOpen(false);

    // Reset Form Data
    setFormData({
      title: '',
      category: 'Contracts',
      version: 'v1.0',
      accessLevel: 'Internal',
      tags: '',
      remarks: '',
      fileName: ''
    });
  };

  // GET Filter Logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = 
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.remarks.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesAccess = selectedAccessLevel === 'All' || doc.accessLevel === selectedAccessLevel;

      return matchesSearch && matchesCategory && matchesAccess;
    });
  }, [documents, searchQuery, selectedCategory, selectedAccessLevel]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const totalDocs = documents.length;
    const confidentialCount = documents.filter(d => d.accessLevel === 'Confidential').length;
    const internalCount = documents.filter(d => d.accessLevel === 'Internal').length;
    const publicCount = documents.filter(d => d.accessLevel === 'Public').length;

    return { totalDocs, confidentialCount, internalCount, publicCount };
  }, [documents]);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/projects" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1 text-slate-600" /> Projects
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="hover:text-blue-600 cursor-pointer">proj-skyline-001</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Documents (DMS)</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Document Management</h1>
        </div>

        {/* Action Button (POST Trigger) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Documents</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalDocs}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Folder className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Internal Access</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.internalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidential</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.confidentialCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Public Docs</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.publicCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Search Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter by Category */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Contracts">Contracts</option>
                <option value="Architectural Drawings">Architectural Drawings</option>
                <option value="Engineering Specs">Engineering Specs</option>
                <option value="Permits & Approvals">Permits & Approvals</option>
                <option value="Financial Reports">Financial Reports</option>
                <option value="Site Inspection">Site Inspection</option>
              </select>
            </div>

            {/* Filter by Access Level */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Access:</label>
              <select
                value={selectedAccessLevel}
                onChange={(e) => setSelectedAccessLevel(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
              >
                <option value="All">All Access Levels</option>
                <option value="Public">Public</option>
                <option value="Internal">Internal</option>
                <option value="Confidential">Confidential</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search documents, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Documents Table (GET List View) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Doc Code</th>
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Ver</th>
                <th className="py-3.5 px-4">File Info</th>
                <th className="py-3.5 px-4">Access</th>
                <th className="py-3.5 px-4">Uploaded By</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{doc.id}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex flex-col">
                        <span>{doc.title}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {doc.tags.map((tag, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{doc.category}</td>
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-600">{doc.version}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {doc.fileType} ({doc.fileSize})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {doc.accessLevel === 'Public' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Public
                        </span>
                      )}
                      {doc.accessLevel === 'Internal' && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Internal
                        </span>
                      )}
                      {doc.accessLevel === 'Confidential' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <Lock className="w-3 h-3" /> Confidential
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{doc.uploadedBy}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">{doc.uploadedDate}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors" title="View Document">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Download File">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No documents found matching your selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredDocuments.length} of {documents.length} document records</span>
          <span>Project DMS Engine v03.08</span>
        </div>

      </div>

      {/* POST Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Upload Project Document</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Document Title */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase 1 Electrical Wiring Schematic"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Category & Version */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  >
                    <option value="Contracts">Contracts</option>
                    <option value="Architectural Drawings">Architectural Drawings</option>
                    <option value="Engineering Specs">Engineering Specs</option>
                    <option value="Permits & Approvals">Permits & Approvals</option>
                    <option value="Financial Reports">Financial Reports</option>
                    <option value="Site Inspection">Site Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Version *</label>
                  <input
                    type="text"
                    required
                    placeholder="v1.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Access Security Level *</label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as any })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                >
                  <option value="Internal">Internal (Project Team Only)</option>
                  <option value="Confidential">Confidential (Management Only)</option>
                  <option value="Public">Public (Shared with Vendors)</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Structural, Phase1, Electrical"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* File Attachment Simulation */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Select Attachment File</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.files?.[0]?.name || '' })}
                  className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3.5 py-2 w-full focus:outline-none shadow-sm cursor-pointer"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Remarks / Document Notes</label>
                <textarea
                  rows={2}
                  placeholder="Brief explanation of document contents..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                >
                  Save Document
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}