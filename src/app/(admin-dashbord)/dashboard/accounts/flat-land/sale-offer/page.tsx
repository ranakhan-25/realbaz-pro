'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  X, 
  Edit, 
  FileText, 
  Share2, 
  Plus 
} from 'lucide-react';

interface SaleOfferItem {
  id: number;
  date: string;
  code: string;
  project: string;
  flatPlotNo: string;
  customerName: string;
  rate: number;
  otherCost: number;
  parking: number;
  utilityCharge: number;
  discount: number;
  subtotal: number;
  grandTotal: number;
  paid: number;
  due: number;
  salesBy: string;
  attachment: string;
  approve: string;
}

export default function FlatLandSaleOfferListPage() {
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<SaleOfferItem | null>(null);

  // Filter & Search States
  const [selectedDate, setSelectedDate] = useState('1 September, 2026 - 30 September, 2026');
  const [salesByFilter, setSalesByFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  // Form Fields State (For Add/Edit actions)
  const [formDate, setFormDate] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formFlatPlotNo, setFormFlatPlotNo] = useState('');
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formRate, setFormRate] = useState<number>(0);
  const [formSalesBy, setFormSalesBy] = useState('');

  // Table Data State
  const [offers, setOffers] = useState<SaleOfferItem[]>([
    { id: 1, date: '2026-09-12', code: 'SaleOffer-1074184', project: 'Sheba Eyecon Tower', flatPlotNo: 'F 2', customerName: 'Sagor kumar', rate: 9000, otherCost: 0, parking: 300000, utilityCharge: 200000, discount: 0, subtotal: 11070000, grandTotal: 11570000, paid: 0, due: 11570000, salesBy: 'Tazmul Reza', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 2, date: '2026-09-10', code: 'SaleOffer-7981177', project: 'Sheba Eyecon Tower', flatPlotNo: 'F 2', customerName: 'Sagor kumar', rate: 9000, otherCost: 0, parking: 300000, utilityCharge: 200000, discount: 0, subtotal: 11070000, grandTotal: 11570000, paid: 0, due: 11570000, salesBy: 'Tazmul Reza', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 3, date: '2026-09-03', code: 'SaleOffer-5154844', project: 'Sheba Eyecon Tower', flatPlotNo: 'F 2', customerName: 'Mr. Raju raz', rate: 9000, otherCost: 0, parking: 300000, utilityCharge: 200000, discount: 0, subtotal: 0, grandTotal: 0, paid: 0, due: 0, salesBy: 'Mohin Uddin', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 4, date: '2026-09-03', code: 'SaleOffer-3674401', project: 'Sheba Eyecon Tower', flatPlotNo: 'F 4', customerName: 'Sagor kumar', rate: 60, otherCost: 0, parking: 0, utilityCharge: 0, discount: 0, subtotal: 73800, grandTotal: 73800, paid: 0, due: 73800, salesBy: 'Tazmul Reza', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 5, date: '2026-09-03', code: 'SaleOffer-920540', project: 'Sheba Eyecon Tower', flatPlotNo: 'F 4', customerName: 'Mr. Raju raz', rate: 60, otherCost: 0, parking: 0, utilityCharge: 0, discount: 0, subtotal: 73800, grandTotal: 73800, paid: 0, due: 73800, salesBy: 'Mohin Uddin', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 6, date: '2026-09-03', code: 'SaleOffer-4181717', project: 'Lake Garden', flatPlotNo: 'C-9', customerName: 'Mr. Raju raz', rate: 6000, otherCost: 0, parking: 800000, utilityCharge: 500000, discount: 0, subtotal: 0, grandTotal: 0, paid: 0, due: 0, salesBy: 'Rifat Hosain', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 7, date: '2026-09-03', code: 'SaleOffer-566922', project: 'Sheba Eyecon Tower', flatPlotNo: 'F 2', customerName: 'Mr. Raju raz', rate: 0, otherCost: 0, parking: 300000, utilityCharge: 200000, discount: 0, subtotal: 0, grandTotal: 0, paid: 0, due: 0, salesBy: 'Mohin Uddin', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 8, date: '2026-09-02', code: 'SaleOffer-8597937', project: 'Sheba Eyecon Tower', flatPlotNo: 'F 2', customerName: 'Mr. Raju raz', rate: 9000, otherCost: 0, parking: 300000, utilityCharge: 200000, discount: 0, subtotal: 0, grandTotal: 0, paid: 0, due: 0, salesBy: '', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 9, date: '2026-09-02', code: 'SaleOffer-700064', project: 'Sheba Eyecon Tower', flatPlotNo: 'F 2', customerName: 'Vertex Group', rate: 0, otherCost: 0, parking: 0, utilityCharge: 0, discount: 0, subtotal: 0, grandTotal: 0, paid: 0, due: 0, salesBy: 'Mohin Uddin', attachment: '', approve: 'Approval Layer has not been set yet.' },
    { id: 10, date: '2026-09-02', code: 'SaleOffer-2231331', project: 'Estern 19', flatPlotNo: '2', customerName: 'Mr. Raju raz', rate: 500000, otherCost: 0, parking: 0, utilityCharge: 0, discount: 0, subtotal: 0, grandTotal: 0, paid: 0, due: 0, salesBy: 'Tazmul Reza', attachment: '', approve: 'Approval Layer has not been set yet.' },
  ]);

  // Handlers for Modals
  const handleOpenAddModal = () => {
    setFormDate('2026-09-16');
    setFormProject('Sheba Eyecon Tower');
    setFormFlatPlotNo('');
    setFormCustomerName('');
    setFormRate(0);
    setFormSalesBy('Tazmul Reza');
    setIsAddModalOpen(true);
  };

  const handleEditClick = (offer: SaleOfferItem) => {
    setCurrentOffer(offer);
    setFormDate(offer.date);
    setFormProject(offer.project);
    setFormFlatPlotNo(offer.flatPlotNo);
    setFormCustomerName(offer.customerName);
    setFormRate(offer.rate);
    setFormSalesBy(offer.salesBy);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (offer: SaleOfferItem) => {
    setCurrentOffer(offer);
    setIsViewModalOpen(true);
  };

  // Filtering Logic
  const filteredOffers = offers.filter(o => {
    const matchesSalesBy = salesByFilter ? o.salesBy.toLowerCase().includes(salesByFilter.toLowerCase()) : true;
    const matchesProject = projectFilter ? o.project.toLowerCase().includes(projectFilter.toLowerCase()) : true;
    const matchesSearch = searchQuery 
      ? o.code.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.flatPlotNo.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSalesBy && matchesProject && matchesSearch;
  });

  // Pagination Logic
  const itemsPerPage = parseInt(entries);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* Breadcrumb & Top Add Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-slate-600 space-x-2">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="hover:text-blue-600 cursor-pointer">Flat/Land</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-800">Flat/Land Sale Offer List</span>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-[#6b58e8] hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded flex items-center shadow transition"
        >
          +New Sale Offer
        </button>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 space-y-4">
        
        {/* Filter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Date</label>
            <input 
              type="text" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Sales By</label>
            <select 
              value={salesByFilter} 
              onChange={(e) => setSalesByFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
              <option value="Tazmul Reza">Tazmul Reza</option>
              <option value="Mohin Uddin">Mohin Uddin</option>
              <option value="Rifat Hosain">Rifat Hosain</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Team</label>
            <select 
              value={teamFilter} 
              onChange={(e) => setTeamFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Project</label>
            <select 
              value={projectFilter} 
              onChange={(e) => setProjectFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">Select Project</option>
              <option value="Sheba Eyecon Tower">Sheba Eyecon Tower</option>
              <option value="Lake Garden">Lake Garden</option>
              <option value="Estern 19">Estern 19</option>
            </select>
          </div>
        </div>

        {/* Search & Entry Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center text-xs text-slate-600 space-x-1">
            <span>Show</span>
            <select 
              value={entries} 
              onChange={(e) => { setEntries(e.target.value); setCurrentPage(1); }}
              className="border border-slate-300 rounded px-2 py-1 bg-white text-xs"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600">Search:</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="border border-slate-300 rounded px-3 py-1 text-xs w-full sm:w-48 focus:outline-none focus:border-purple-500" 
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-purple-300 rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#6b58e8] text-white text-[11px] font-semibold uppercase tracking-wider">
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">ID</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">DATE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">CODE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PROJECT</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">FLAT/PLOT NO</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">CUSTOMER NAME</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">RATE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">OTHER COST</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PARKING</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">UTILITY CHARGE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">DISCOUNT</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SUBTOTAL</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">GRAND TOTAL</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PAID</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">DUE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SALES BY</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">ATTACHMENT</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">APPROVE</th>
                <th className="p-2.5 whitespace-nowrap text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {currentOffers.length === 0 ? (
                <tr>
                  <td colSpan={19} className="text-center py-8 text-slate-400 italic bg-slate-50">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentOffers.map((offer) => (
                  <tr key={offer.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 border-r">{offer.id}</td>
                    <td className="p-2.5 border-r">{offer.date}</td>
                    <td className="p-2.5 border-r font-medium text-slate-900">{offer.code}</td>
                    <td className="p-2.5 border-r">{offer.project}</td>
                    <td className="p-2.5 border-r text-blue-600 font-medium cursor-pointer hover:underline">{offer.flatPlotNo}</td>
                    <td className="p-2.5 border-r">{offer.customerName}</td>
                    <td className="p-2.5 border-r">{offer.rate}</td>
                    <td className="p-2.5 border-r">{offer.otherCost || ''}</td>
                    <td className="p-2.5 border-r">{offer.parking || ''}</td>
                    <td className="p-2.5 border-r">{offer.utilityCharge || ''}</td>
                    <td className="p-2.5 border-r">{offer.discount || ''}</td>
                    <td className="p-2.5 border-r">{offer.subtotal}</td>
                    <td className="p-2.5 border-r">{offer.grandTotal}</td>
                    <td className="p-2.5 border-r">{offer.paid}</td>
                    <td className="p-2.5 border-r">{offer.due}</td>
                    <td className="p-2.5 border-r">{offer.salesBy}</td>
                    <td className="p-2.5 border-r text-center">{offer.attachment}</td>
                    <td className="p-2.5 border-r text-rose-500 italic text-[11px]">{offer.approve}</td>
                    <td className="p-2.5 text-center whitespace-nowrap space-x-1">
                      {/* Edit Action Button */}
                      <button 
                        onClick={() => handleEditClick(offer)} 
                        className="bg-sky-400 hover:bg-sky-500 text-white p-1.5 rounded shadow-sm transition"
                        title="Edit Offer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {/* View Action Button */}
                      <button 
                        onClick={() => handleViewClick(offer)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded shadow-sm transition"
                        title="View Details"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      {/* Share / Print Action Button */}
                      <button 
                        onClick={() => alert(`Share or Print option for: ${offer.code}`)} 
                        className="bg-[#6b58e8] hover:bg-purple-700 text-white p-1.5 rounded shadow-sm transition"
                        title="Print / Share"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 gap-2">
          <span>Showing {filteredOffers.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredOffers.length)} of {filteredOffers.length} entries</span>
          <div className="flex space-x-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded font-medium ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Add New Offer Modal Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-purple-300 overflow-hidden my-6">
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add New Sale Offer</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Date*</label>
                <input 
                  type="date" 
                  value={formDate} 
                  onChange={(e) => setFormDate(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Project*</label>
                <input 
                  type="text" 
                  value={formProject} 
                  onChange={(e) => setFormProject(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Flat/Plot No*</label>
                <input 
                  type="text" 
                  placeholder="e.g. F 2"
                  value={formFlatPlotNo} 
                  onChange={(e) => setFormFlatPlotNo(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Customer Name*</label>
                <input 
                  type="text" 
                  placeholder="Enter Customer Name"
                  value={formCustomerName} 
                  onChange={(e) => setFormCustomerName(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Rate*</label>
                <input 
                  type="number" 
                  value={formRate} 
                  onChange={(e) => setFormRate(Number(e.target.value))} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Sales By</label>
                <input 
                  type="text" 
                  value={formSalesBy} 
                  onChange={(e) => setFormSalesBy(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button 
                  onClick={() => {
                    if(!formCustomerName || !formFlatPlotNo) { alert('Please fill required fields'); return; }
                    const newOffer: SaleOfferItem = {
                      id: offers.length + 1,
                      date: formDate || '2026-09-16',
                      code: `SaleOffer-${Math.floor(1000000 + Math.random() * 9000000)}`,
                      project: formProject,
                      flatPlotNo: formFlatPlotNo,
                      customerName: formCustomerName,
                      rate: formRate,
                      otherCost: 0,
                      parking: 0,
                      utilityCharge: 0,
                      discount: 0,
                      subtotal: formRate * 100,
                      grandTotal: formRate * 100,
                      paid: 0,
                      due: formRate * 100,
                      salesBy: formSalesBy,
                      attachment: '',
                      approve: 'Approval Layer has not been set yet.'
                    };
                    setOffers([newOffer, ...offers]);
                    setIsAddModalOpen(false);
                    alert('Sale Offer Added Successfully!');
                  }} 
                  className="px-4 py-2 bg-[#6b58e8] text-white rounded font-medium hover:bg-purple-700 shadow"
                >
                  Save Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal Form */}
      {isEditModalOpen && currentOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-sky-300 overflow-hidden my-6">
            <div className="bg-sky-500 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Edit Sale Offer ({currentOffer.code})</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Date*</label>
                <input 
                  type="date" 
                  value={formDate} 
                  onChange={(e) => setFormDate(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Project*</label>
                <input 
                  type="text" 
                  value={formProject} 
                  onChange={(e) => setFormProject(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Flat/Plot No*</label>
                <input 
                  type="text" 
                  value={formFlatPlotNo} 
                  onChange={(e) => setFormFlatPlotNo(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Customer Name*</label>
                <input 
                  type="text" 
                  value={formCustomerName} 
                  onChange={(e) => setFormCustomerName(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Rate*</label>
                <input 
                  type="number" 
                  value={formRate} 
                  onChange={(e) => setFormRate(Number(e.target.value))} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Sales By</label>
                <input 
                  type="text" 
                  value={formSalesBy} 
                  onChange={(e) => setFormSalesBy(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button 
                  onClick={() => {
                    setOffers(offers.map(o => o.id === currentOffer.id ? { 
                      ...o, 
                      date: formDate, 
                      project: formProject, 
                      flatPlotNo: formFlatPlotNo, 
                      customerName: formCustomerName, 
                      rate: formRate, 
                      salesBy: formSalesBy 
                    } : o));
                    setIsEditModalOpen(false);
                    alert('Sale Offer Updated Successfully!');
                  }} 
                  className="px-4 py-2 bg-sky-500 text-white rounded font-medium hover:bg-sky-600 shadow"
                >
                  Update Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && currentOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-blue-300 overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Sale Offer Details: {currentOffer.code}</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-2 text-xs">
              <p><strong className="text-slate-600">Date:</strong> {currentOffer.date}</p>
              <p><strong className="text-slate-600">Project:</strong> {currentOffer.project}</p>
              <p><strong className="text-slate-600">Flat/Plot No:</strong> {currentOffer.flatPlotNo}</p>
              <p><strong className="text-slate-600">Customer Name:</strong> {currentOffer.customerName}</p>
              <p><strong className="text-slate-600">Rate:</strong> {currentOffer.rate}</p>
              <p><strong className="text-slate-600">Subtotal:</strong> {currentOffer.subtotal}</p>
              <p><strong className="text-slate-600">Grand Total:</strong> {currentOffer.grandTotal}</p>
              <p><strong className="text-slate-600">Paid:</strong> {currentOffer.paid}</p>
              <p><strong className="text-slate-600">Due:</strong> {currentOffer.due}</p>
              <p><strong className="text-slate-600">Sales By:</strong> {currentOffer.salesBy}</p>
              <p><strong className="text-slate-600">Approve Status:</strong> <span className="text-rose-500">{currentOffer.approve}</span></p>
              <div className="flex justify-end pt-3 border-t">
                <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-1.5 bg-slate-600 text-white rounded">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}