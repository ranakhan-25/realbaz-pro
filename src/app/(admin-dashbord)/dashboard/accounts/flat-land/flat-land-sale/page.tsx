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
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-800">
      
      {/* Breadcrumb & Top Add Button (Increased padding/size) */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-sm sm:text-base text-slate-600 space-x-2">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-5 h-5 text-slate-400" />
          <span className="hover:text-blue-600 cursor-pointer">Flat/Land</span>
          <ChevronRight className="w-5 h-5 text-slate-400" />
          <span className="font-semibold text-slate-900">Flat/Land Sale Offer List</span>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-[#6b58e8] hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg flex items-center shadow-md transition"
        >
          +New Sale Offer
        </button>
      </div>

      {/* Main Card Container (Increased padding: p-6 instead of p-5) */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-6">
        
        {/* Filter Section (Increased input heights and paddings) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-5 border-b border-slate-100 text-sm">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Select Date</label>
            <input 
              type="text" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Sales By</label>
            <select 
              value={salesByFilter} 
              onChange={(e) => setSalesByFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
              <option value="Tazmul Reza">Tazmul Reza</option>
              <option value="Mohin Uddin">Mohin Uddin</option>
              <option value="Rifat Hosain">Rifat Hosain</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Team</label>
            <select 
              value={teamFilter} 
              onChange={(e) => setTeamFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Project</label>
            <select 
              value={projectFilter} 
              onChange={(e) => setProjectFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-purple-500"
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
          <div className="flex items-center text-sm text-slate-600 space-x-2">
            <span>Show</span>
            <select 
              value={entries} 
              onChange={(e) => { setEntries(e.target.value); setCurrentPage(1); }}
              className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 font-medium">Search:</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="border border-slate-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-purple-500" 
            />
          </div>
        </div>

        {/* Data Table (Increased cell padding: p-3.5 instead of p-2.5) */}
        <div className="overflow-x-auto border border-purple-300 rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#6b58e8] text-white text-xs font-bold uppercase tracking-wider">
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">ID</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">DATE</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">CODE</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">PROJECT</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">FLAT/PLOT NO</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">CUSTOMER NAME</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">RATE</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">OTHER COST</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">PARKING</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">UTILITY CHARGE</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">DISCOUNT</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">SUBTOTAL</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">GRAND TOTAL</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">PAID</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">DUE</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">SALES BY</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">ATTACHMENT</th>
                <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">APPROVE</th>
                <th className="p-3.5 whitespace-nowrap text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {currentOffers.length === 0 ? (
                <tr>
                  <td colSpan={19} className="text-center py-10 text-slate-400 italic bg-slate-50 text-base">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentOffers.map((offer) => (
                  <tr key={offer.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 border-r">{offer.id}</td>
                    <td className="p-3.5 border-r">{offer.date}</td>
                    <td className="p-3.5 border-r font-semibold text-slate-900">{offer.code}</td>
                    <td className="p-3.5 border-r">{offer.project}</td>
                    <td className="p-3.5 border-r text-blue-600 font-semibold cursor-pointer hover:underline">{offer.flatPlotNo}</td>
                    <td className="p-3.5 border-r">{offer.customerName}</td>
                    <td className="p-3.5 border-r">{offer.rate}</td>
                    <td className="p-3.5 border-r">{offer.otherCost || ''}</td>
                    <td className="p-3.5 border-r">{offer.parking || ''}</td>
                    <td className="p-3.5 border-r">{offer.utilityCharge || ''}</td>
                    <td className="p-3.5 border-r">{offer.discount || ''}</td>
                    <td className="p-3.5 border-r">{offer.subtotal}</td>
                    <td className="p-3.5 border-r">{offer.grandTotal}</td>
                    <td className="p-3.5 border-r">{offer.paid}</td>
                    <td className="p-3.5 border-r">{offer.due}</td>
                    <td className="p-3.5 border-r">{offer.salesBy}</td>
                    <td className="p-3.5 border-r text-center">{offer.attachment}</td>
                    <td className="p-3.5 border-r text-rose-500 italic text-xs">{offer.approve}</td>
                    <td className="p-3.5 text-center whitespace-nowrap space-x-1.5">
                      {/* Edit Action Button */}
                      <button 
                        onClick={() => handleEditClick(offer)} 
                        className="bg-sky-400 hover:bg-sky-500 text-white p-2 rounded-md shadow transition"
                        title="Edit Offer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* View Action Button */}
                      <button 
                        onClick={() => handleViewClick(offer)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow transition"
                        title="View Details"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {/* Share / Print Action Button */}
                      <button 
                        onClick={() => alert(`Share or Print option for: ${offer.code}`)} 
                        className="bg-[#6b58e8] hover:bg-purple-700 text-white p-2 rounded-md shadow transition"
                        title="Print / Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-wrap items-center justify-between text-sm text-slate-600 pt-3 gap-2">
          <span>Showing {filteredOffers.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredOffers.length)} of {filteredOffers.length} entries</span>
          <div className="flex space-x-1.5">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              className={`px-4 py-2 rounded-lg font-medium ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-semibold ${currentPage === page ? 'bg-purple-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              className={`px-4 py-2 rounded-lg font-medium ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Add New Offer Modal (Larger width: max-w-xl) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-purple-300 overflow-hidden my-6">
            <div className="bg-[#6b58e8] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Add New Sale Offer</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-5 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Date*</label>
                <input 
                  type="date" 
                  value={formDate} 
                  onChange={(e) => setFormDate(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-purple-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Project*</label>
                <input 
                  type="text" 
                  value={formProject} 
                  onChange={(e) => setFormProject(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-purple-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Flat/Plot No*</label>
                <input 
                  type="text" 
                  placeholder="e.g. F 2"
                  value={formFlatPlotNo} 
                  onChange={(e) => setFormFlatPlotNo(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-purple-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Customer Name*</label>
                <input 
                  type="text" 
                  placeholder="Enter Customer Name"
                  value={formCustomerName} 
                  onChange={(e) => setFormCustomerName(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-purple-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Rate*</label>
                <input 
                  type="number" 
                  value={formRate} 
                  onChange={(e) => setFormRate(Number(e.target.value))} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-purple-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Sales By</label>
                <input 
                  type="text" 
                  value={formSalesBy} 
                  onChange={(e) => setFormSalesBy(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-purple-500 text-base" 
                />
              </div>
              <div className="flex justify-end space-x-3 pt-5 border-t">
                <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 border rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200">Cancel</button>
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
                  className="px-6 py-2.5 bg-[#6b58e8] text-white rounded-lg font-semibold hover:bg-purple-700 shadow-lg"
                >
                  Save Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal (Larger width: max-w-xl) */}
      {isEditModalOpen && currentOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-sky-300 overflow-hidden my-6">
            <div className="bg-sky-500 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Edit Sale Offer ({currentOffer.code})</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-5 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Date*</label>
                <input 
                  type="date" 
                  value={formDate} 
                  onChange={(e) => setFormDate(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-sky-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Project*</label>
                <input 
                  type="text" 
                  value={formProject} 
                  onChange={(e) => setFormProject(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-sky-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Flat/Plot No*</label>
                <input 
                  type="text" 
                  value={formFlatPlotNo} 
                  onChange={(e) => setFormFlatPlotNo(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-sky-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Customer Name*</label>
                <input 
                  type="text" 
                  value={formCustomerName} 
                  onChange={(e) => setFormCustomerName(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-sky-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Rate*</label>
                <input 
                  type="number" 
                  value={formRate} 
                  onChange={(e) => setFormRate(Number(e.target.value))} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-sky-500 text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Sales By</label>
                <input 
                  type="text" 
                  value={formSalesBy} 
                  onChange={(e) => setFormSalesBy(e.target.value)} 
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-sky-500 text-base" 
                />
              </div>
              <div className="flex justify-end space-x-3 pt-5 border-t">
                <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 border rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200">Cancel</button>
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
                  className="px-6 py-2.5 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 shadow-lg"
                >
                  Update Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal (Larger width: max-w-lg) */}
      {isViewModalOpen && currentOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-blue-300 overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Sale Offer Details: {currentOffer.code}</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-3.5 text-sm">
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Date:</strong> <span className="font-medium text-slate-900">{currentOffer.date}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Project:</strong> <span className="font-medium text-slate-900">{currentOffer.project}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Flat/Plot No:</strong> <span className="font-medium text-slate-900">{currentOffer.flatPlotNo}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Customer Name:</strong> <span className="font-medium text-slate-900">{currentOffer.customerName}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Rate:</strong> <span className="font-medium text-slate-900">{currentOffer.rate}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Subtotal:</strong> <span className="font-medium text-slate-900">{currentOffer.subtotal}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Grand Total:</strong> <span className="font-medium text-slate-900">{currentOffer.grandTotal}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Paid:</strong> <span className="font-medium text-slate-900">{currentOffer.paid}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Due:</strong> <span className="font-medium text-slate-900">{currentOffer.due}</span></p>
              <p className="flex justify-between border-b pb-2"><strong className="text-slate-600">Sales By:</strong> <span className="font-medium text-slate-900">{currentOffer.salesBy}</span></p>
              <p className="flex justify-between pb-1"><strong className="text-slate-600">Approve Status:</strong> <span className="text-rose-500 font-semibold">{currentOffer.approve}</span></p>
              <div className="flex justify-end pt-5 border-t">
                <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}