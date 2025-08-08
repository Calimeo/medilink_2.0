// AppointmentsApp.jsx
import React, { useState, useEffect } from "react";

const initialAppointments = [
  // Sample initial data (could be empty)
  // {
  //   id: '1',
  //   patientName: "John Doe",
  //   date: "2024-07-01",
  //   time: "14:00",
  //   reason: "General Checkup",
  // },
];

export default function AppointmentsApp() {
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem("appointments");
    return stored ? JSON.parse(stored) : initialAppointments;
  });

  const [form, setForm] = useState({
    patientName: "",
    date: "",
    time: "",
    reason: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Simple validation
    if (
      form.patientName.trim() === "" ||
      form.date === "" ||
      form.time === ""
    ) {
      alert("Please fill in at least patient name, date and time.");
      return;
    }

    if (editId) {
      // Update existing
      setAppointments((apps) =>
        apps.map((app) =>
          app.id === editId ? { ...app, ...form } : app
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newAppointment = { ...form, id: Date.now().toString() };
      setAppointments((apps) => [...apps, newAppointment]);
    }
    setForm({
      patientName: "",
      date: "",
      time: "",
      reason: "",
    });
  }

  function handleEdit(id) {
    const app = appointments.find((a) => a.id === id);
    if (app) {
      setForm({
        patientName: app.patientName,
        date: app.date,
        time: app.time,
        reason: app.reason,
      });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments((apps) => apps.filter((app) => app.id !== id));
      if (editId === id) {
        // Cancel editing if we delete the editing appointment
        setEditId(null);
        setForm({
          patientName: "",
          date: "",
          time: "",
          reason: "",
        });
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Doctor Appointment Scheduler
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-10"
        aria-label="Appointment form"
      >
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
          {editId ? "Edit Appointment" : "New Appointment"}
        </h2>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Patient Name *</span>
          <input
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Your full name"
            required
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Date *</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Time *</span>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>
        </div>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Reason (Optional)</span>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Briefly describe your reason for appointment"
          />
        </label>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-md px-6 py-2 font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {editId ? "Update Appointment" : "Send Appointment"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({
                  patientName: "",
                  date: "",
                  time: "",
                  reason: "",
                });
              }}
              className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section aria-label="Appointments list">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
          Your Appointments
        </h2>

        {appointments.length === 0 && (
          <p className="text-gray-600">No appointments scheduled yet.</p>
        )}

        <ul className="space-y-4">
          {appointments
            .slice()
            .sort(
              (a, b) =>
                new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
            )
            .map(({ id, patientName, date, time, reason }) => (
              <li
                key={id}
                className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg text-indigo-700">
                    {patientName}
                  </p>
                  <p className="text-gray-600">
                    <time dateTime={`${date}T${time}`}>{date}</time> at {time}
                  </p>
                  {reason && (
                    <p className="mt-1 text-gray-700 italic">{reason}</p>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 flex gap-2">
                  <button
                    onClick={() => handleEdit(id)}
                    className="px-3 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    aria-label={`Edit appointment for ${patientName} on ${date} at ${time}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
                    aria-label={`Delete appointment for ${patientName} on ${date} at ${time}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}