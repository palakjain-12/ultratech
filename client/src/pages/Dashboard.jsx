import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Layout from "../components/Layout.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalEquipment: 0, totalMaintenanceLogs: 0, lowStockCount: 0 });
  const [maintenanceDue, setMaintenanceDue] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    const load = async () => {
      const alerts = await api.get("/alerts");
      setSummary(alerts.data.summary);
      setMaintenanceDue(alerts.data.maintenanceDue);
      setLowStock(alerts.data.lowStock);
      const logs = await api.get("/maintenance");
      const monthlyCounts = {};
      logs.data.forEach((l) => {
        const key = new Date(l.dateOfService).toISOString().slice(0, 7);
        monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
      });
      setMonthly(Object.entries(monthlyCounts).map(([month, count]) => ({ month, count })));
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Equipment</div>
          <div className="text-3xl font-semibold">{summary.totalEquipment}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Maintenance Logs</div>
          <div className="text-3xl font-semibold">{summary.totalMaintenanceLogs}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Low Stock Parts</div>
          <div className="text-3xl font-semibold">{summary.lowStockCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Monthly Maintenance Activities</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Spare Parts Low in Stock</h2>
          <ul className="divide-y">
            {lowStock.map((p) => (
              <li key={p._id} className="py-2 flex justify-between">
                <span>{p.name}</span>
                <span className="text-red-600">{p.currentStock} / {p.reorderLevel}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mt-6">
        <h2 className="font-semibold mb-2">Maintenance Due Alert</h2>
        {maintenanceDue.length === 0 ? (
          <div className="text-sm text-gray-500">No equipment due for maintenance</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Equipment</th>
                <th>Last Maintenance</th>
                <th>Interval (days)</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceDue.map((e) => (
                <tr key={e._id} className="border-b">
                  <td className="py-2">{e.name} ({e.equipmentId})</td>
                  <td>{e.lastMaintenanceDate ? new Date(e.lastMaintenanceDate).toLocaleDateString() : "N/A"}</td>
                  <td>{e.serviceIntervalDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

