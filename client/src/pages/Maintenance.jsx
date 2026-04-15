import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [spares, setSpares] = useState([]);
  const { user } = useAuth();

  const [form, setForm] = useState({
    maintenanceId: "",
    equipmentId: "",
    maintenanceType: "Preventive",
    description: "",
    technicianName: "",
    dateOfService: "",
    sparesUsed: [],
    downtimeDurationMinutes: 0,
    remarks: ""
  });

  const load = async () => {
    const [{ data: logsData }, { data: eqData }, { data: spData }] = await Promise.all([
      api.get("/maintenance"),
      api.get("/equipment"),
      api.get("/spares"),
    ]);
    setLogs(logsData);
    setEquipment(eqData);
    setSpares(spData);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (user?.name) {
      setForm((f) => ({ ...f, technicianName: user.name }));
    }
  }, [user]);

  const addSpare = () => {
    setForm((f) => ({ ...f, sparesUsed: [...f.sparesUsed, { partId: "", quantity: 1 }] }));
  };
  const updateSpare = (idx, field, value) => {
    const next = [...form.sparesUsed];
    next[idx] = { ...next[idx], [field]: value };
    setForm((f) => ({ ...f, sparesUsed: next }));
  };
  const removeSpare = (idx) => {
    const next = [...form.sparesUsed];
    next.splice(idx, 1);
    setForm((f) => ({ ...f, sparesUsed: next }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.post("/maintenance", {
      ...form,
      dateOfService: new Date(form.dateOfService),
      downtimeDurationMinutes: Number(form.downtimeDurationMinutes)
    });
    setForm({
      maintenanceId: "",
      equipmentId: "",
      maintenanceType: "Preventive",
      description: "",
      technicianName: user?.name || "",
      dateOfService: "",
      sparesUsed: [],
      downtimeDurationMinutes: 0,
      remarks: ""
    });
    load();
  };

  const approve = async (id) => {
    await api.put(`/maintenance/${id}/approve`);
    load();
  };

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Maintenance Logs</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">ID</th>
              <th>Equipment</th>
              <th>Type</th>
              <th>Technician</th>
              <th>Date</th>
              <th>Approved</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id} className="border-b">
                <td className="py-2">{l.maintenanceId}</td>
                <td>{l.equipment?.name}</td>
                <td>{l.maintenanceType}</td>
                <td>{l.technicianName}</td>
                <td>{new Date(l.dateOfService).toLocaleDateString()}</td>
                <td>{l.approved ? "Yes" : "No"}</td>
                <td>
                  {!l.approved && user?.role === "Supervisor" && (
                    <button onClick={() => approve(l._id)} className="text-blue-600">Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.role !== "Store Manager" && (
      <div className="bg-white p-4 rounded shadow mt-6">
        <h3 className="font-semibold mb-3">Log Maintenance Activity</h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Maintenance ID" className="border rounded px-3 py-2" value={form.maintenanceId} onChange={(e)=>setForm({...form, maintenanceId: e.target.value})} />
            <select className="border rounded px-3 py-2" value={form.equipmentId} onChange={(e)=>setForm({...form, equipmentId: e.target.value})}>
              <option value="">Select Equipment</option>
              {equipment.map(eq => <option key={eq.equipmentId} value={eq.equipmentId}>{eq.name} ({eq.equipmentId})</option>)}
            </select>
            <select className="border rounded px-3 py-2" value={form.maintenanceType} onChange={(e)=>setForm({...form, maintenanceType: e.target.value})}>
              {["Preventive","Breakdown"].map(t => <option key={t}>{t}</option>)}
            </select>
            <input type="date" className="border rounded px-3 py-2" value={form.dateOfService} onChange={(e)=>setForm({...form, dateOfService: e.target.value})} />
            <input placeholder="Technician Name" className="border rounded px-3 py-2" value={form.technicianName} onChange={(e)=>setForm({...form, technicianName: e.target.value})} />
            <input type="number" placeholder="Downtime (minutes)" className="border rounded px-3 py-2" value={form.downtimeDurationMinutes} onChange={(e)=>setForm({...form, downtimeDurationMinutes: e.target.value})} />
            <input placeholder="Remarks" className="border rounded px-3 py-2 md:col-span-2" value={form.remarks} onChange={(e)=>setForm({...form, remarks: e.target.value})} />
            <textarea placeholder="Description" className="border rounded px-3 py-2 md:col-span-2" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Spare Parts Used</h4>
              <button type="button" onClick={addSpare} className="text-blue-600">Add</button>
            </div>
            <div className="space-y-2">
              {form.sparesUsed.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2">
                  <select className="border rounded px-2 py-2 col-span-6" value={item.partId} onChange={(e)=>updateSpare(idx, "partId", e.target.value)}>
                    <option value="">Select Spare</option>
                    {spares.map(sp => <option key={sp.partId} value={sp.partId}>{sp.name} ({sp.partId})</option>)}
                  </select>
                  <input type="number" className="border rounded px-2 py-2 col-span-3" value={item.quantity} onChange={(e)=>updateSpare(idx, "quantity", Number(e.target.value))} />
                  <button type="button" className="col-span-3 text-red-600" onClick={()=>removeSpare(idx)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
          <button className="bg-gray-900 text-white px-4 py-2 rounded">Submit Log</button>
        </form>
      </div>
      )}
    </Layout>
  );
};

export default Maintenance;

