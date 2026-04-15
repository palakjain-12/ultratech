import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Spares = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    partId: "",
    name: "",
    equipmentCategory: "General",
    currentStock: 0,
    reorderLevel: 0,
    supplierName: "",
    unitCost: 0
  });
  const { user } = useAuth();

  const load = async () => {
    const { data } = await api.get("/spares");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.post("/spares", { ...form, currentStock: Number(form.currentStock), reorderLevel: Number(form.reorderLevel), unitCost: Number(form.unitCost) });
    setForm({
      partId: "",
      name: "",
      equipmentCategory: "General",
      currentStock: 0,
      reorderLevel: 0,
      supplierName: "",
      unitCost: 0
    });
    load();
  };

  const updateStock = async (id, stock) => {
    await api.put(`/spares/${id}`, { currentStock: stock });
    load();
  };

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Spare Parts Inventory</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Reorder</th>
              <th>Supplier</th>
              <th>Unit Cost</th>
              {["Store Manager","Supervisor"].includes(user?.role) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="py-2">{p.partId}</td>
                <td>{p.name}</td>
                <td>{p.equipmentCategory}</td>
                <td>{p.currentStock}</td>
                <td>{p.reorderLevel}</td>
                <td>{p.supplierName}</td>
                <td>₹{p.unitCost}</td>
                {["Store Manager","Supervisor"].includes(user?.role) && (
                  <td>
                    <button className="text-blue-600 mr-2" onClick={() => updateStock(p._id, p.currentStock + 1)}>+1</button>
                    <button className="text-blue-600" onClick={() => updateStock(p._id, Math.max(0, p.currentStock - 1))}>-1</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {["Store Manager","Supervisor"].includes(user?.role) && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="font-semibold mb-3">Add Spare Part</h3>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Part ID" className="border rounded px-3 py-2" value={form.partId} onChange={(e)=>setForm({...form, partId: e.target.value})} />
            <input placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
            <select className="border rounded px-3 py-2" value={form.equipmentCategory} onChange={(e)=>setForm({...form, equipmentCategory: e.target.value})}>
              {["Crusher","Conveyor","Packing Machine","Kiln","General"].map(t => <option key={t}>{t}</option>)}
            </select>
            <input placeholder="Supplier" className="border rounded px-3 py-2" value={form.supplierName} onChange={(e)=>setForm({...form, supplierName: e.target.value})} />
            <input type="number" placeholder="Current Stock" className="border rounded px-3 py-2" value={form.currentStock} onChange={(e)=>setForm({...form, currentStock: e.target.value})} />
            <input type="number" placeholder="Reorder Level" className="border rounded px-3 py-2" value={form.reorderLevel} onChange={(e)=>setForm({...form, reorderLevel: e.target.value})} />
            <input type="number" placeholder="Unit Cost" className="border rounded px-3 py-2" value={form.unitCost} onChange={(e)=>setForm({...form, unitCost: e.target.value})} />
            <div className="md:col-span-2">
              <button className="bg-gray-900 text-white px-4 py-2 rounded">Create</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default Spares;

