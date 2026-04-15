import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Layout from "../components/Layout.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/maintenance");
      setLogs(data);
    };
    load();
  }, []);

  const freqByEquipment = Object.values(
    logs.reduce((acc, l) => {
      const key = l.equipment?.name || "Unknown";
      acc[key] = acc[key] || { equipment: key, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {})
  );

  const spareUsage = Object.values(
    logs.reduce((acc, l) => {
      l.sparesUsed.forEach((s) => {
        const key = s.part?.name || "Unknown";
        acc[key] = acc[key] || { part: key, quantity: 0 };
        acc[key].quantity += s.quantity;
      });
      return acc;
    }, {})
  );

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Equipment Maintenance Frequency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={freqByEquipment}>
              <XAxis dataKey="equipment" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Spare Parts Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={spareUsage} dataKey="quantity" nameKey="part" cx="50%" cy="50%" outerRadius={100}>
                {spareUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;

