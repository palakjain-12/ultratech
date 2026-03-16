const api = axios.create({ baseURL: "http://localhost:5000" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const { useEffect, useState } = React;

function Layout({ user, onLogout, children, setView }) {
  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
        <div className="font-semibold">UltraTech Hirmi – Maintenance Module</div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Role: {user?.role || "Guest"}</span>
          {user && (
            <button onClick={onLogout} className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded">
              Logout
            </button>
          )}
        </div>
      </header>
      <div className="flex">
        <nav className="w-64 bg-white border-r p-4 space-y-2">
          {[
            ["Dashboard", "dashboard"],
            ["Equipment", "equipment"],
            ["Maintenance Logs", "maintenance"],
            ["Spare Parts", "spares"],
            ["Reports", "reports"],
          ].map(([label, value]) => (
            <button key={value} onClick={() => setView(value)} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
              {label}
            </button>
          ))}
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      onLogin({ role: data.role, name: data.name });
    } catch {
      setError("Invalid credentials");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white shadow p-6 rounded w-96">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block text-sm mb-1">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2 mb-3" />
        <label className="block text-sm mb-1">Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full border rounded px-3 py-2 mb-4" />
        <button className="w-full bg-gray-900 text-white py-2 rounded">Sign In</button>
        <div className="text-xs text-gray-500 mt-3">
          Use: supervisor@ultratech.com / technician@ultratech.com / store@ultratech.com (password: password123)
        </div>
      </form>
    </div>
  );
}

function Dashboard() {
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
      setTimeout(() => {
        const ctx = document.getElementById("monthlyChart");
        if (ctx) {
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: monthly.map((m) => m.month),
              datasets: [{ label: "Maintenance per month", data: monthly.map(m=>m.count), backgroundColor: "#8884d8" }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
          });
        }
      }, 0);
    };
    load();
  }, []);

  return (
    <div>
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
      <div className="bg-white p-4 rounded shadow mt-6">
        <h2 className="font-semibold mb-2">Monthly Maintenance Activities</h2>
        <canvas id="monthlyChart" height="120"></canvas>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
        <div className="bg-white p-4 rounded shadow">
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
      </div>
    </div>
  );
}

function Equipment({ user }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    equipmentId: "", name: "", type: "Crusher", plantSection: "", installationDate: "", serviceIntervalDays: 30, status: "Operational"
  });
  const load = async () => {
    const { data } = await api.get("/equipment");
    setItems(data);
  };
  useEffect(()=>{ load(); },[]);
  const submit = async (e) => {
    e.preventDefault();
    await api.post("/equipment", { ...form, installationDate: new Date(form.installationDate) });
    setForm({ equipmentId: "", name: "", type: "Crusher", plantSection: "", installationDate: "", serviceIntervalDays: 30, status: "Operational" });
    load();
  };
  return (
    <div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Equipment</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-2">ID</th><th>Name</th><th>Type</th><th>Section</th><th>Installed</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((e)=>(
              <tr key={e._id} className="border-b">
                <td className="py-2">{e.equipmentId}</td><td>{e.name}</td><td>{e.type}</td><td>{e.plantSection}</td><td>{new Date(e.installationDate).toLocaleDateString()}</td><td>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {user?.role === "Supervisor" && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="font-semibold mb-3">Add Equipment</h3>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Equipment ID" className="border rounded px-3 py-2" value={form.equipmentId} onChange={(e)=>setForm({...form, equipmentId:e.target.value})} />
            <input placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            <select className="border rounded px-3 py-2" value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})}>{["Crusher","Conveyor","Packing Machine","Kiln"].map(t=><option key={t}>{t}</option>)}</select>
            <input placeholder="Plant Section" className="border rounded px-3 py-2" value={form.plantSection} onChange={(e)=>setForm({...form, plantSection:e.target.value})} />
            <input type="date" className="border rounded px-3 py-2" value={form.installationDate} onChange={(e)=>setForm({...form, installationDate:e.target.value})} />
            <input type="number" placeholder="Service Interval (days)" className="border rounded px-3 py-2" value={form.serviceIntervalDays} onChange={(e)=>setForm({...form, serviceIntervalDays:Number(e.target.value)})} />
            <select className="border rounded px-3 py-2" value={form.status} onChange={(e)=>setForm({...form, status:e.target.value})}>{["Operational","Under Maintenance"].map(s=><option key={s}>{s}</option>)}</select>
            <div className="md:col-span-2"><button className="bg-gray-900 text-white px-4 py-2 rounded">Create</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function Maintenance({ user }) {
  const [logs, setLogs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [spares, setSpares] = useState([]);
  const [form, setForm] = useState({
    maintenanceId: "", equipmentId: "", maintenanceType: "Preventive", description: "", technicianName: user?.name || "", dateOfService: "", sparesUsed: [], downtimeDurationMinutes: 0, remarks: ""
  });
  const load = async () => {
    const [{ data: logsData }, { data: eqData }, { data: spData }] = await Promise.all([ api.get("/maintenance"), api.get("/equipment"), api.get("/spares") ]);
    setLogs(logsData); setEquipment(eqData); setSpares(spData);
  };
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ if(user?.name){ setForm((f)=>({ ...f, technicianName: user.name })) }},[user]);
  const addSpare = ()=> setForm((f)=>({ ...f, sparesUsed:[...f.sparesUsed, { partId:"", quantity:1 }] }));
  const updateSpare = (idx, field, value) => { const next=[...form.sparesUsed]; next[idx]= { ...next[idx], [field]: value }; setForm((f)=>({ ...f, sparesUsed: next })); };
  const removeSpare = (idx) => { const next=[...form.sparesUsed]; next.splice(idx,1); setForm((f)=>({ ...f, sparesUsed: next })); };
  const submit = async (e) => {
    e.preventDefault();
    await api.post("/maintenance", { ...form, dateOfService: new Date(form.dateOfService), downtimeDurationMinutes: Number(form.downtimeDurationMinutes) });
    setForm({ maintenanceId:"", equipmentId:"", maintenanceType:"Preventive", description:"", technicianName:user?.name||"", dateOfService:"", sparesUsed:[], downtimeDurationMinutes:0, remarks:"" });
    load();
  };
  const approve = async (id) => { await api.put(`/maintenance/${id}/approve`); load(); };
  return (
    <div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Maintenance Logs</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-2">ID</th><th>Equipment</th><th>Type</th><th>Technician</th><th>Date</th><th>Approved</th><th></th></tr></thead>
          <tbody>
            {logs.map((l)=>(
              <tr key={l._id} className="border-b">
                <td className="py-2">{l.maintenanceId}</td><td>{l.equipment?.name}</td><td>{l.maintenanceType}</td><td>{l.technicianName}</td><td>{new Date(l.dateOfService).toLocaleDateString()}</td><td>{l.approved?"Yes":"No"}</td>
                <td>{!l.approved && user?.role==="Supervisor" && (<button onClick={()=>approve(l._id)} className="text-blue-600">Approve</button>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {user?.role !== "Store Manager" && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="font-semibold mb-3">Log Maintenance Activity</h3>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Maintenance ID" className="border rounded px-3 py-2" value={form.maintenanceId} onChange={(e)=>setForm({...form, maintenanceId:e.target.value})} />
              <select className="border rounded px-3 py-2" value={form.equipmentId} onChange={(e)=>setForm({...form, equipmentId:e.target.value})}>
                <option value="">Select Equipment</option>
                {equipment.map(eq=><option key={eq.equipmentId} value={eq.equipmentId}>{eq.name} ({eq.equipmentId})</option>)}
              </select>
              <select className="border rounded px-3 py-2" value={form.maintenanceType} onChange={(e)=>setForm({...form, maintenanceType:e.target.value})}>
                {["Preventive","Breakdown"].map(t=><option key={t}>{t}</option>)}
              </select>
              <input type="date" className="border rounded px-3 py-2" value={form.dateOfService} onChange={(e)=>setForm({...form, dateOfService:e.target.value})} />
              <input placeholder="Technician Name" className="border rounded px-3 py-2" value={form.technicianName} onChange={(e)=>setForm({...form, technicianName:e.target.value})} />
              <input type="number" placeholder="Downtime (minutes)" className="border rounded px-3 py-2" value={form.downtimeDurationMinutes} onChange={(e)=>setForm({...form, downtimeDurationMinutes:e.target.value})} />
              <input placeholder="Remarks" className="border rounded px-3 py-2 md:col-span-2" value={form.remarks} onChange={(e)=>setForm({...form, remarks:e.target.value})} />
              <textarea placeholder="Description" className="border rounded px-3 py-2 md:col-span-2" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Spare Parts Used</h4>
                <button type="button" onClick={addSpare} className="text-blue-600">Add</button>
              </div>
              <div className="space-y-2">
                {form.sparesUsed.map((item, idx)=>(
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <select className="border rounded px-2 py-2 col-span-6" value={item.partId} onChange={(e)=>updateSpare(idx,"partId",e.target.value)}>
                      <option value="">Select Spare</option>
                      {spares.map(sp=><option key={sp.partId} value={sp.partId}>{sp.name} ({sp.partId})</option>)}
                    </select>
                    <input type="number" className="border rounded px-2 py-2 col-span-3" value={item.quantity} onChange={(e)=>updateSpare(idx,"quantity",Number(e.target.value))} />
                    <button type="button" className="col-span-3 text-red-600" onClick={()=>removeSpare(idx)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
            <button className="bg-gray-900 text-white px-4 py-2 rounded">Submit Log</button>
          </form>
        </div>
      )}
    </div>
  );
}

function Spares({ user }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ partId:"", name:"", equipmentCategory:"General", currentStock:0, reorderLevel:0, supplierName:"", unitCost:0 });
  const load = async () => { const { data } = await api.get("/spares"); setItems(data); };
  useEffect(()=>{ load(); },[]);
  const submit = async (e) => {
    e.preventDefault();
    await api.post("/spares", { ...form, currentStock:Number(form.currentStock), reorderLevel:Number(form.reorderLevel), unitCost:Number(form.unitCost) });
    setForm({ partId:"", name:"", equipmentCategory:"General", currentStock:0, reorderLevel:0, supplierName:"", unitCost:0 });
    load();
  };
  const updateStock = async (id, stock) => { await api.put(`/spares/${id}`, { currentStock: stock }); load(); };
  return (
    <div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Spare Parts Inventory</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-2">ID</th><th>Name</th><th>Category</th><th>Stock</th><th>Reorder</th><th>Supplier</th><th>Unit Cost</th>{["Store Manager","Supervisor"].includes(user?.role)?<th>Actions</th>:null}</tr></thead>
          <tbody>
            {items.map((p)=>(
              <tr key={p._id} className="border-b">
                <td className="py-2">{p.partId}</td><td>{p.name}</td><td>{p.equipmentCategory}</td><td>{p.currentStock}</td><td>{p.reorderLevel}</td><td>{p.supplierName}</td><td>₹{p.unitCost}</td>
                {["Store Manager","Supervisor"].includes(user?.role) && (
                  <td><button className="text-blue-600 mr-2" onClick={()=>updateStock(p._id, p.currentStock+1)}>+1</button><button className="text-blue-600" onClick={()=>updateStock(p._id, Math.max(0,p.currentStock-1))}>-1</button></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {["Store Manager","Supervisor"].includes(user?.role) && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="font-semibold mb-3">Add Spare Part</h3>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Part ID" className="border rounded px-3 py-2" value={form.partId} onChange={(e)=>setForm({...form, partId:e.target.value})} />
            <input placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            <select className="border rounded px-3 py-2" value={form.equipmentCategory} onChange={(e)=>setForm({...form, equipmentCategory:e.target.value})}>{["Crusher","Conveyor","Packing Machine","Kiln","General"].map(t=><option key={t}>{t}</option>)}</select>
            <input placeholder="Supplier" className="border rounded px-3 py-2" value={form.supplierName} onChange={(e)=>setForm({...form, supplierName:e.target.value})} />
            <input type="number" placeholder="Current Stock" className="border rounded px-3 py-2" value={form.currentStock} onChange={(e)=>setForm({...form, currentStock:e.target.value})} />
            <input type="number" placeholder="Reorder Level" className="border rounded px-3 py-2" value={form.reorderLevel} onChange={(e)=>setForm({...form, reorderLevel:e.target.value})} />
            <input type="number" placeholder="Unit Cost" className="border rounded px-3 py-2" value={form.unitCost} onChange={(e)=>setForm({...form, unitCost:e.target.value})} />
            <div className="md:col-span-2"><button className="bg-gray-900 text-white px-4 py-2 rounded">Create</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function Reports() {
  const [logs, setLogs] = useState([]);
  useEffect(()=>{ (async()=>{ const {data}=await api.get("/maintenance"); setLogs(data); setTimeout(()=>{ const ctx=document.getElementById("sparesPie"); if(ctx){ const usage={}; logs.forEach(l=>{ l.sparesUsed.forEach(s=>{ const key=(s.part&&s.part.name)||"Unknown"; usage[key]=(usage[key]||0)+s.quantity; }); }); new Chart(ctx,{ type:"pie", data:{ labels:Object.keys(usage), datasets:[{ data:Object.values(usage) }] }, options:{ responsive:true } }); } },0); })(); },[]);
  const freq = Object.values(logs.reduce((acc,l)=>{ const key=l.equipment?.name||"Unknown"; acc[key]=acc[key]||{ equipment:key, count:0 }; acc[key].count+=1; return acc; },{}));
  useEffect(()=>{ setTimeout(()=>{ const ctx=document.getElementById("equipBar"); if(ctx){ new Chart(ctx,{ type:"bar", data:{ labels:freq.map(f=>f.equipment), datasets:[{ data:freq.map(f=>f.count), backgroundColor:"#82ca9d" }] }, options:{ responsive:true, scales:{ y:{ beginAtZero:true } } } }); } },0); },[logs]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow"><h2 className="font-semibold mb-2">Equipment Maintenance Frequency</h2><canvas id="equipBar" height="120"></canvas></div>
      <div className="bg-white p-4 rounded shadow"><h2 className="font-semibold mb-2">Spare Parts Usage</h2><canvas id="sparesPie" height="120"></canvas></div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  useEffect(()=>{ const token=localStorage.getItem("token"); const role=localStorage.getItem("role"); const name=localStorage.getItem("name"); if(token && role){ setUser({ role, name }); } },[]);
  const logout = ()=>{ localStorage.removeItem("token"); localStorage.removeItem("role"); localStorage.removeItem("name"); setUser(null); };
  if(!user) return <Login onLogin={(u)=>setUser(u)} />;
  return (
    <Layout user={user} onLogout={logout} setView={setView}>
      {view==="dashboard" && <Dashboard />}
      {view==="equipment" && <Equipment user={user} />}
      {view==="maintenance" && <Maintenance user={user} />}
      {view==="spares" && <Spares user={user} />}
      {view==="reports" && <Reports />}
    </Layout>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

