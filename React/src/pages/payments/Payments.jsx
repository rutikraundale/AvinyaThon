import { useState, useEffect } from "react";
import { CreditCard, IndianRupee, Users, HardHat, CheckCircle } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { getWorkersBySite } from "../../../appwrite/services/worker.service.js";
import { getEngineersBySite } from "../../../appwrite/services/engineer.service.js";
import { createPayment } from "../../../appwrite/services/payment.service.js";

const Payments = () => {
  const { selectedSite } = useSite();
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const today = new Date();
  const isEndOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() === today.getDate();
  const isWeekend = [0, 6].includes(today.getDay());

  useEffect(() => {
    fetchData();
  }, [selectedSite]);

  const fetchData = async () => {
    if (!selectedSite) {
      setPersonnel([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [workersRes, engineersRes] = await Promise.all([
        getWorkersBySite(selectedSite.$id),
        getEngineersBySite(selectedSite.$id)
      ]);

      const workers = (workersRes.documents || []).map(w => {
        const pdays = parseInt(w.presentDays || "0", 10);
        return {
          ...w,
          _type: 'labour',
          presentDays: pdays,
          payableAmount: pdays * (w.dailyWage || 0)
        };
      });
      // Sort increasing order of present days
      workers.sort((a, b) => a.presentDays - b.presentDays);

      const engineers = (engineersRes.documents || []).map(e => ({
        ...e,
        _type: 'engineer',
        salary: e.salary || 0,
        payableAmount: e.salary || 0
      }));

      setPersonnel([...engineers, ...workers]);
    } catch (err) {
      console.error("Failed to fetch payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (person) => {
    setProcessing(person.$id);
    try {
      const paymentData = {
        siteId: selectedSite.$id,
        personId: person.$id,
        amount: person.payableAmount,
        date: new Date().toISOString(),
        type: person._type,
      };
      await createPayment(paymentData);
      alert(`Payment of ₹${person.payableAmount} successful for ${person.name}`);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="flex-1 ml-64 bg-slate-50 min-h-screen p-8">
      <div className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden relative">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <IndianRupee className="text-orange-800" /> Payroll & Payments
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Process payments for workers and engineers based on daily conditions.
              </p>
            </div>
            <div className="flex items-center gap-4">
               {isEndOfMonth ? (
                 <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                    End of month (Salary accessible)
                 </span>
               ) : (
                 <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
                    Not end of month (Salary locked)
                 </span>
               )}
               <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                 {selectedSite ? (selectedSite.siteName || selectedSite.name || 'Unnamed Site') : 'No Site Selected'}
               </div>
            </div>
          </div>

          {!selectedSite ? (
             <div className="text-center py-10 text-gray-400 font-bold">Please select a site from the top-left dropdown.</div>
          ) : loading ? (
             <div className="text-center py-10 text-gray-400 font-bold animate-pulse">Loading payroll data...</div>
          ) : personnel.length === 0 ? (
             <div className="text-center py-10 text-gray-400 font-bold">No personnel found for this site.</div>
          ) : (
             <div className="space-y-10">
                {/* Labour Section */}
                <div>
                   <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                     <Users size={18} className="text-orange-600"/> Laborers Wages
                   </h4>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                         <tr>
                           <th className="px-4 py-4 rounded-tl-xl border-b border-gray-100">Labour Name</th>
                           <th className="px-4 py-4 border-b border-gray-100">Role</th>
                           <th className="px-4 py-4 text-center border-b border-gray-100">Present Days</th>
                           <th className="px-4 py-4 text-right border-b border-gray-100">Daily Wage</th>
                           <th className="px-4 py-4 text-right border-b border-gray-100">Total Payable</th>
                           <th className="px-4 py-4 text-right rounded-tr-xl border-b border-gray-100">Action</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 border-x border-b border-gray-100">
                          {personnel.filter(p => p._type === 'labour').length === 0 ? (
                             <tr><td colSpan="6" className="text-center py-6 text-gray-400 text-sm font-bold">No laborers found.</td></tr>
                          ) : personnel.filter(p => p._type === 'labour').map(person => {
                             const canPay = isWeekend;
                             return (
                               <tr key={person.$id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-4 py-5 font-bold text-sm text-gray-800">{person.name}</td>
                                 <td className="px-4 py-5 text-sm font-bold text-gray-500 uppercase tracking-tighter">{person.role}</td>
                                 <td className="px-4 py-5 text-center">
                                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${person.presentDays >= 7 ? 'text-green-700 bg-green-50 border border-green-100' : 'text-orange-700 bg-orange-50 border border-orange-100'}`}>
                                      {person.presentDays}
                                   </span>
                                 </td>
                                 <td className="px-4 py-5 text-sm font-bold text-gray-600 text-right">₹{person.dailyWage}</td>
                                 <td className="px-4 py-5 text-sm font-black text-gray-900 text-right bg-gray-50/50">₹{person.payableAmount}</td>
                                 <td className="px-4 py-5 text-right w-1/5">
                                    <button
                                      onClick={() => handlePay(person)}
                                      disabled={!canPay || processing === person.$id}
                                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                        canPay ? 'bg-orange-800 text-white shadow-md shadow-orange-900/20 hover:bg-orange-900 cursor-pointer active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 opacity-70'
                                      }`}
                                    >
                                      <CreditCard size={14} className={canPay ? 'text-orange-200' : ''} /> 
                                      {processing === person.$id ? 'Processing...' : (canPay ? 'Issue Payout' : 'Weekend Payout Only')}
                                    </button>
                                 </td>
                               </tr>
                             )
                          })}
                       </tbody>
                     </table>
                   </div>
                </div>

                {/* Engineer Section */}
                <div>
                   <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                     <HardHat size={18} className="text-zinc-600"/> Engineers Salary
                   </h4>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                         <tr>
                           <th className="px-4 py-4 rounded-tl-xl border-b border-gray-100">Engineer Name</th>
                           <th className="px-4 py-4 border-b border-gray-100">Specialization</th>
                           <th className="px-4 py-4 text-right border-b border-gray-100">Monthly Salary</th>
                           <th className="px-4 py-4 text-right rounded-tr-xl border-b border-gray-100">Action</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 border-x border-b border-gray-100">
                          {personnel.filter(p => p._type === 'engineer').length === 0 ? (
                             <tr><td colSpan="4" className="text-center py-6 text-gray-400 text-sm font-bold">No engineers found.</td></tr>
                          ) : personnel.filter(p => p._type === 'engineer').map(person => {
                             const canPay = isEndOfMonth;
                             return (
                               <tr key={person.$id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-4 py-5 font-bold text-sm text-gray-800">{person.name}</td>
                                 <td className="px-4 py-5 text-sm font-bold text-gray-500 uppercase tracking-tighter">{person.specialization || person.role || 'General'}</td>
                                 <td className="px-4 py-5 text-sm font-black text-gray-900 text-right bg-gray-50/50">₹{person.salary}</td>
                                 <td className="px-4 py-5 text-right w-1/4">
                                    <button
                                      onClick={() => handlePay(person)}
                                      disabled={!canPay || processing === person.$id}
                                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                        canPay ? 'bg-zinc-800 text-white shadow-md shadow-zinc-900/20 hover:bg-zinc-900 cursor-pointer active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 opacity-70'
                                      }`}
                                    >
                                      <CreditCard size={14} className={canPay ? 'text-zinc-400' : ''} /> 
                                      {processing === person.$id ? 'Processing...' : (canPay ? 'Issue Salary' : 'Locked till month-end')}
                                    </button>
                                 </td>
                               </tr>
                             )
                          })}
                       </tbody>
                     </table>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
