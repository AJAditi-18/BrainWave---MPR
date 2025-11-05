import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetableEditor({ isDark, timetable, setTimetable, open, setOpen }) {
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(timetable)));

  const handleSlotChange = (dayIdx, slotIdx, field, value) => {
    const copy = JSON.parse(JSON.stringify(draft));
    copy[dayIdx].slots[slotIdx][field] = value;
    setDraft(copy);
  };

  const handleAddSlot = (dayIdx) => {
    const copy = JSON.parse(JSON.stringify(draft));
    copy[dayIdx].slots.push({ time: "", subject: "", class: "" });
    setDraft(copy);
  };

  const handleRemoveSlot = (dayIdx, slotIdx) => {
    const copy = JSON.parse(JSON.stringify(draft));
    copy[dayIdx].slots.splice(slotIdx, 1);
    setDraft(copy);
  };

  const handleSave = () => {
    setTimetable(draft);
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(timetable)));
  }, [open]); // reset editor when (re)opened

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex justify-center items-center">
      <div className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-white"} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>Edit Timetable</h2>
          <button className="text-gray-400 hover:text-red-500" onClick={handleClose}>
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <div className="space-y-6">
          {daysOfWeek.map((day, dayIdx) => (
            <div key={dayIdx} className="border-b pb-4 mb-4">
              <h3 className={`${isDark ? "text-cyan-200" : "text-cyan-600"} font-semibold mb-2`}>{day}</h3>
              {draft[dayIdx].slots.map((slot, slotIdx) => (
                <div key={slotIdx} className="flex gap-2 items-center mb-2">
                  <input value={slot.time} onChange={e => handleSlotChange(dayIdx, slotIdx, "time", e.target.value)}
                    placeholder="Time (e.g. 9:00-10:00)"
                    className={`px-2 py-1 border rounded w-32 text-sm ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} />
                  <input value={slot.subject} onChange={e => handleSlotChange(dayIdx, slotIdx, "subject", e.target.value)}
                    placeholder="Subject"
                    className={`px-2 py-1 border rounded w-40 text-sm ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} />
                  <input value={slot.class} onChange={e => handleSlotChange(dayIdx, slotIdx, "class", e.target.value)}
                    placeholder="Class/Section"
                    className={`px-2 py-1 border rounded w-24 text-sm ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`} />
                  <button type="button" className="px-2 py-1 text-xs text-red-600" onClick={() => handleRemoveSlot(dayIdx, slotIdx)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button"
                className="px-3 py-1 text-xs font-semibold rounded bg-cyan-700 text-white hover:bg-cyan-800"
                onClick={() => handleAddSlot(dayIdx)}>
                + Add Slot
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={handleSave} className="bg-green-600 px-5 py-2 text-white font-semibold rounded hover:bg-green-700">
            Save Timetable
          </button>
          <button onClick={handleClose} className="bg-gray-500 px-5 py-2 text-white rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
