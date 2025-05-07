import { useState, useEffect } from "react";
import { generateFakeEmail,getAgendaDelay } from "../utils/helper";
import { scheduleEmail } from "../utils/ScheduleEmail";

const EmailScheduler = ({ emails, leads, edges }) => {
  const [open, setOpen] = useState(false);
  const [emailChain, setEmailChain] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    if (!leads.length || !edges.length || !emails.length) return;
  
    const emailMap = Object.fromEntries(emails.map((e) => [e.id, e]));
    const chains = [];
  
    const leadTargets = edges
      .filter((edge) => leads.some((l) => l.id === edge.source))
      .map((edge) => ({
        leadId: edge.source,
        startId: edge.target,
      }));
  
    leadTargets.forEach(({ leadId, startId }) => {
      let currentId = startId;
      while (currentId) {
        const currentEmail = emailMap[currentId];
        if (!currentEmail) break;
  
        chains.push({
          ...currentEmail,
          leadId,
        });
  
        const nextEdge = edges.find((e) => e.source === currentId);
        currentId = nextEdge?.target || null;
      }
    });
  
    setEmailChain(chains);
  
    setScheduleData((prev) => {
      const prevMap = Object.fromEntries(prev.map((e) => [e.emailId, e]));
  
      return chains.map((email) => {
        const existing = prevMap[email.id];
        const lead = leads.find((l) => l.id === email.leadId);
  
        return {
          emailId: email.id,
          label: email.data.label,
          subject: email.data.subject,
          body: email.data.body,
          scheduledAt: existing?.scheduledAt || "",
          recipients: existing?.recipients?.length
          ? existing.recipients
          : lead
          ? [lead.data.email]  // <-- Change here: Use lead's email directly
          : []
        };
      });
    });
  }, [emails, leads, edges]);
  

  const updateSchedule = (index, date, time) => {
    const updated = [...scheduleData];
    const datetime = new Date(date);
    const [hours, minutes] = time.split(":");
    datetime.setHours(+hours);
    datetime.setMinutes(+minutes);
    updated[index].scheduledAt = datetime.toISOString();
    setScheduleData(updated);
  };

 
  const handleScheduleSubmit = async (scheduleData) => {
    try {
      for (const item of scheduleData) {
        const { subject, body, scheduledAt, recipients } = item;
        const delay = getAgendaDelay(scheduledAt);
  
        for (const recipient of recipients) {
          // Use recipient as-is if it's already an email
          const to = recipient.includes("@") ? recipient : generateFakeEmail(recipient);
  
         
  
          await scheduleEmail({
            to,
            subject,
            body,
            delay,
          });
        }
      }
  
      alert("All emails scheduled successfully!");
    } catch (err) {
      console.error("❌ Email scheduling error:", err);
      alert("Failed to schedule one or more emails.");
    }
    setOpen(false);
  };
  
  

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        Schedule Emails
      </button>

      {open && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Schedule Email Sequence</h2>
            <button
              className="text-red-500 text-xl font-bold"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {scheduleData.map((item, idx) => (
            <div key={item.emailId} className="mb-6 border-b pb-4">
              <p className="font-semibold text-lg">{item.label}</p>
              <p className="text-gray-700 mb-1">Subject: {item.subject}</p>
              <textarea
                value={item.body}
                readOnly
                className="w-full p-2 border rounded mb-2"
                rows={5}
              />
              <div className="flex gap-4 items-center">
                <label>
                  Date:{" "}
                  <input
                    type="date"
                    onChange={(e) => updateSchedule(idx, e.target.value, "09:00")}
                    className="border px-2 py-1 rounded"
                  />
                </label>
                <label>
                  Time:{" "}
                  <input
                    type="time"
                    defaultValue="09:00"
                    onChange={(e) =>
                      updateSchedule(
                        idx,
                        new Date().toISOString().split("T")[0],
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded"
                  />
                </label>
              </div>
            </div>
          ))}

          <button
            onClick={()=>handleScheduleSubmit(scheduleData)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Schedule
          </button>
        </div>
      )}
    </>
  );
};

export default EmailScheduler;
