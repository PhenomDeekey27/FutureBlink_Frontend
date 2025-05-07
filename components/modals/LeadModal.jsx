import { useState } from "react";
import { leads as initialLeads } from "../../utils/Leads";
import { FaWindowClose } from "react-icons/fa";
import { FaAngleDoubleDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

const LeadModal = ({ onInsert }) => {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInsert = () => {
    if (selectedLead) {
      onInsert(selectedLead);
      document.getElementById("default-modal").classList.add("hidden");
    }
  };

  const handleAddNew = () => {
    if (newLeadName.trim() && newLeadEmail.trim()) {
      const newLead = { name: newLeadName.trim(), email: newLeadEmail.trim() };
      setLeads([...leads, newLead]);
      setSelectedLead(newLead);
      setNewLeadName("");
      setNewLeadEmail("");
      setShowDropdown(false);
    }
  };

  return (
    <div className="p-2">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 rounded-lg 
        text-sm flex items-center justify-between gap-4 cursor-pointer"
        onClick={() =>
          document.getElementById("default-modal").classList.remove("hidden")
        }
      >
        <FaPlus /> Add Lead Source
      </button>

      {/* Modal */}
      <div
        id="default-modal"
        className="hidden fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="bg-slate-300 p-6 rounded-lg w-96 shadow-lg">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-bold">Add Lead</h2>
            <button
              onClick={() =>
                document.getElementById("default-modal").classList.add("hidden")
              }
              className="text-black hover:text-red-500 cursor-pointer"
            >
              <FaWindowClose size={20} />
            </button>
          </div>

          {/* Selected Lead */}
          {selectedLead && (
            <div className="mb-4 text-center text-blue-700 font-semibold">
              Selected:
              <div className="bg-blue-600 text-white p-2 mt-1 rounded-md text-sm">
                {selectedLead.name} <br />
                <span className="text-xs">{selectedLead.email}</span>
              </div>
            </div>
          )}

          {/* Dropdown */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-blue-600 text-white w-full px-4 py-2 rounded mb-2 hover:cursor-pointer flex items-center justify-between"
          >
            {selectedLead ? "Change Lead" : "Select Lead"} <FaAngleDoubleDown />
          </button>

          {showDropdown && (
            <div className="bg-gray-100 max-h-40 overflow-y-auto rounded p-2 mb-2">
              <ul className="flex flex-col gap-2">
                {leads.map((lead, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowDropdown(false);
                    }}
                    className="w-full px-3 py-2 cursor-pointer hover:bg-blue-300 rounded text-center text-sm"
                  >
                    <strong>{lead.name}</strong>
                    <div className="text-xs text-gray-700">{lead.email}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add New Lead */}
          <input
            value={newLeadName}
            onChange={(e) => setNewLeadName(e.target.value)}
            placeholder="Company name"
            className="w-full border p-2 rounded mb-2"
          />
          <input
            value={newLeadEmail}
            onChange={(e) => setNewLeadEmail(e.target.value)}
            placeholder="Company email"
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white w-full py-2 rounded mb-4 flex items-center justify-center gap-4 cursor-pointer"
          >
            <FaPlus /> Add New Company
          </button>

          {/* Final Insert */}
          <button
            onClick={handleInsert}
            className="bg-blue-700 text-white w-full py-2 rounded cursor-pointer"
            disabled={!selectedLead}
          >
            Insert Lead into Flow
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
