// components/modals/EmailModal.js
import { IoMdMail } from "react-icons/io";
import { useState } from "react";
import { EmailTemplates } from "../../utils/Emails";

const EmailModal = ({ onInsertEmail, onClose }) => {
  const [isNewTemplateOpen, setNewTemplateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body: "",
    to: "",
  });

  const handleInputChange = (e) => {
    setNewTemplate({ ...newTemplate, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onInsertEmail(newTemplate);
    setNewTemplate({ name: "", subject: "", body: "" });
    setNewTemplateOpen(false);
    onClose(); // Close modal after insert
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative dark:bg-gray-800">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Email
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <div className="relative">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2"
              onClick={() =>
                document
                  .getElementById("email-template")
                  .classList.toggle("hidden")
              }
            >
              Select Template
            </button>
            <div
              id="email-template"
              className="absolute top-12 left-0 hidden bg-white border rounded-lg shadow-md z-10 w-64 dark:bg-gray-700"
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-white">
                {EmailTemplates.map((email) => (
                  <li
                    key={email.id}
                    className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      onInsertEmail(email);
                      onClose();
                    }}
                  >
                    {email.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2"
            onClick={() => setNewTemplateOpen(true)}
          >
            New Template
          </button>
        </div>
      </div>

      {/* Fullscreen Template Modal */}
      {isNewTemplateOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60">
          <div className="bg-white w-full h-full p-8 overflow-auto dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-white">
                New Email Template
              </h2>
              <button
                onClick={() => setNewTemplateOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="name"
                value={newTemplate.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                placeholder="Template name"
              />
              <input
                name="subject"
                value={newTemplate.subject}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                placeholder="Email subject"
              />
              <input
                type="email"
                name="to"
                value={newTemplate.to}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                placeholder="Recipient email address"
              />
              <textarea
                name="body"
                value={newTemplate.body}
                onChange={handleInputChange}
                rows={10}
                required
                className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                placeholder="Write your email here..."
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
              >
                Save Template
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailModal;
