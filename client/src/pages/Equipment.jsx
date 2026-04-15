import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Equipment = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    equipmentId: "",
    name: "",
    type: "Crusher",
    plantSection: "",
    installationDate: "",
    serviceIntervalDays: 30,
    status: "Operational"
  });
  const { user } = useAuth();

  const load = async () => {
    const { data } = await api.get("/equipment");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.post("/equipment", { ...form, installationDate: new Date(form.installationDate) });
    setForm({
      equipmentId: "",
      name: "",
      type: "Crusher",
      plantSection: "",
      installationDate: "",
      serviceIntervalDays: 30,
      status: "Operational"
    });
    load();
  };

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Equipment</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Section</th>
              <th>Installed</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e._id} className="border-b">
                <td className="py-2">{e.equipmentId}</td>
                <td>{e.name}</td>
                <td>{e.type}</td>
                <td>{e.plantSection}</td>
                <td>{new Date(e.installationDate).toLocaleDateString()}</td>
                <td>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.role === "Supervisor" && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="font-semibold mb-3">Add Equipment</h3>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Equipment ID" className="border rounded px-3 py-2" value={form.equipmentId} onChange={(e)=>setForm({...form, equipmentId: e.target.value})} />
            <input placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
            <select className="border rounded px-3 py-2" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
              {["Crusher","Conveyor","Packing Machine","Kiln"].map(t => <option key={t}>{t}</option>)}
            </select>
            <input placeholder="Plant Section" className="border rounded px-3 py-2" value={form.plantSection} onChange={(e)=>setForm({...form, plantSection: e.target.value})} />
            <input type="date" className="border rounded px-3 py-2" value={form.installationDate} onChange={(e)=>setForm({...form, installationDate: e.target.value})} />
            <input type="number" placeholder="Service Interval (days)" className="border rounded px-3 py-2" value={form.serviceIntervalDays} onChange={(e)=>setForm({...form, serviceIntervalDays: Number(e.target.value)})} />
            <select className="border rounded px-3 py-2" value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})}>
              {["Operational","Under Maintenance"].map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="md:col-span-2">
              <button className="bg-gray-900 text-white px-4 py-2 rounded">Create</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default Equipment;

