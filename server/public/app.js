const api = axios.create({ baseURL: "http://localhost:5000" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const { useEffect, useState } = React;

function Layout({ user, onLogout, children, setView, currentView }) {
  const logo = "/Ultratechlogo.png";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="sticky top-0 z-50 bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <img 
            src={logo}
            alt="UltraTech Logo" 
            className="h-12 w-auto object-contain rounded" 
          />
          <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center font-bold text-slate-900 text-xl shadow-inner hidden">U</div>
          <div>
            <div className="font-bold text-lg tracking-tight">UltraTech Hirmi Works</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">Maintenance & Spare Parts</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-200">{user?.name}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 rounded tracking-wider">{user?.role}</span>
          </div>
          {user && (
            <button 
              onClick={onLogout} 
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2"
            >
              Logout
            </button>
          )}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <nav className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-1.5 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3">Main Navigation</div>
          {[
            ["Dashboard", "dashboard", "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"],
            ["Equipment", "equipment", "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"],
            ["Maintenance Logs", "maintenance", "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"],
            ["Spare Parts", "spares", "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"],
            ["Reports", "reports", "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14"],
          ].map(([label, value, iconPath]) => (
            <button 
              key={value} 
              onClick={() => setView(value)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                currentView === value 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <svg className={`w-5 h-5 transition-colors ${currentView === value ? "text-yellow-400" : "text-slate-400 group-hover:text-slate-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
              </svg>
              {label}
            </button>
          ))}
          <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">Help & Support</div>
            <p className="text-[10px] text-slate-400 leading-relaxed">For system issues, contact Hirmi IT Dept at ext 4501.</p>
          </div>
        </nav>
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-10">{children}</main>
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const logo = "data:image/png;base64,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";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl"></div>
      
      <form onSubmit={submit} className="bg-white shadow-2xl p-10 rounded-2xl w-[450px] relative z-10 border border-slate-200">
        <div className="flex justify-center mb-8">
          <img 
            src={logo}
            alt="UltraTech Logo" 
            className="h-24 w-auto object-contain rounded-xl shadow-md"
          />
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center font-bold text-yellow-500 text-3xl shadow-lg hidden">U</div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Hirmi Works Portal</h1>
        <p className="text-slate-500 text-center text-sm mb-8">Maintenance & Spare Parts Tracking</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              type="email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all" 
              placeholder="name@ultratech.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all" 
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-slate-200 transition-all active:scale-[0.98]">
          Sign In to System
        </button>
        
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Demo Credentials</div>
          <div className="grid grid-cols-1 gap-2">
            {[
              ["Supervisor", "supervisor@ultratech.com"],
              ["Technician", "technician@ultratech.com"],
              ["Store Manager", "store@ultratech.com"]
            ].map(([role, mail]) => (
              <div key={role} className="flex justify-between items-center text-[10px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-600">{role}</span>
                <span className="text-slate-400 font-mono">{mail}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

function Dashboard({ setView }) {
  const [summary, setSummary] = useState({ totalEquipment: 0, totalMaintenanceLogs: 0, lowStockCount: 0 });
  const [maintenanceDue, setMaintenanceDue] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const alerts = await api.get("/alerts");
        setSummary(alerts.data.summary);
        setMaintenanceDue(alerts.data.maintenanceDue);
        setLowStock(alerts.data.lowStock);
        const logs = await api.get("/maintenance");
        setRecentMaintenance(logs.data.sort((a, b) => new Date(b.dateOfService) - new Date(a.dateOfService)).slice(0, 5));
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Real-time overview of Hirmi plant maintenance status</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</div>
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Operational
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Equipment", value: summary.totalEquipment, icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z", color: "blue" },
          { label: "Maintenance Logs", value: summary.totalMaintenanceLogs, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", color: "purple" },
          { label: "Low Stock Parts", value: summary.lowStockCount, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "orange" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon}></path></svg>
              </div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live</span>
            </div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-tight mb-1">{card.label}</div>
            <div className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Recent Maintenance Activities
          </h2>
          <button onClick={() => setView('maintenance')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="p-0">
          {recentMaintenance.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400 italic">No recent maintenance logs found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentMaintenance.map((log) => (
                <div key={log._id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${log.maintenanceType === 'Breakdown' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {log.maintenanceType[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{log.equipment?.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 max-w-md">{log.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">{new Date(log.dateOfService).toLocaleDateString()}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.technicianName}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-orange-50/30">
            <h2 className="font-bold text-orange-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Spare Parts Inventory Alerts
            </h2>
          </div>
          <div className="p-6">
            {lowStock.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm italic">Stock levels are optimal.</div>
            ) : (
              <div className="space-y-3">
                {lowStock.map((p) => (
                  <div key={p._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{p.equipmentCategory}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-red-600">{p.currentStock} units left</div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Reorder @ {p.reorderLevel}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-red-50/30">
            <h2 className="font-bold text-red-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Maintenance Overdue
            </h2>
          </div>
          <div className="p-6">
            {maintenanceDue.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm italic text-green-600">All equipment is up to date.</div>
            ) : (
              <div className="space-y-3">
                {maintenanceDue.map((e) => (
                  <div key={e._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 group">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{e.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">ID: {e.equipmentId}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-black text-red-600 uppercase tracking-tighter">Due Now</div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Interval: {e.serviceIntervalDays}d</div>
                      </div>
                      <button 
                        onClick={() => {
                          localStorage.setItem("preselect_equipment", e.equipmentId);
                          setView('maintenance');
                        }} 
                        className="bg-slate-900 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600"
                        title="Log Maintenance Now"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
    try {
      const { data } = await api.get("/equipment");
      setItems(data);
    } catch (err) { console.error(err); }
  };
  useEffect(()=>{ load(); },[]);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/equipment", { ...form, installationDate: new Date(form.installationDate) });
      setForm({ equipmentId: "", name: "", type: "Crusher", plantSection: "", installationDate: "", serviceIntervalDays: 30, status: "Operational" });
      load();
    } catch (err) { alert("Error creating equipment"); }
  };
  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Equipment Management</h1>
          <p className="text-slate-500 text-sm">Monitor and manage Hirmi plant physical assets</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Asset ID</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Equipment Name</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Type</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Section</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Installation</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((e)=>(
                <tr key={e._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{e.equipmentId}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{e.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">{e.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{e.plantSection}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(e.installationDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                      e.status === 'Operational' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {user?.role === "Supervisor" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Register New Asset
          </h3>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset ID</label>
              <input placeholder="e.g. EQ-KM-001" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.equipmentId} onChange={(e)=>setForm({...form, equipmentId:e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Equipment Name</label>
              <input placeholder="e.g. Rotary Kiln" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none bg-white" value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})}>{["Crusher","Conveyor","Packing Machine","Kiln"].map(t=><option key={t}>{t}</option>)}</select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Plant Section</label>
              <input placeholder="e.g. Raw Mill" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.plantSection} onChange={(e)=>setForm({...form, plantSection:e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Install Date</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none bg-white" value={form.installationDate} onChange={(e)=>setForm({...form, installationDate:e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Interval (Days)</label>
              <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.serviceIntervalDays} onChange={(e)=>setForm({...form, serviceIntervalDays:Number(e.target.value)})} />
            </div>
            <div className="md:col-span-3 flex justify-end mt-2">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95">Add to Inventory</button>
            </div>
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
    maintenanceId: `ML-${Date.now().toString().slice(-6)}`, 
    equipmentId: "", 
    maintenanceType: "Preventive", 
    description: "", 
    technicianName: user?.name || "", 
    dateOfService: new Date().toISOString().split('T')[0], 
    sparesUsed: [], 
    downtimeDurationMinutes: 0, 
    remarks: ""
  });
  const load = async () => {
    try {
      const [{ data: logsData }, { data: eqData }, { data: spData }] = await Promise.all([ api.get("/maintenance"), api.get("/equipment"), api.get("/spares") ]);
      setLogs(logsData); setEquipment(eqData); setSpares(spData);
    } catch (err) { console.error(err); }
  };
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ if(user?.name){ setForm((f)=>({ ...f, technicianName: user.name })) }},[user]);
  
  // Effect to handle quick-action from dashboard
  useEffect(() => {
    const preselected = localStorage.getItem("preselect_equipment");
    if (preselected && equipment.length > 0) {
      setForm(f => ({ ...f, equipmentId: preselected }));
      localStorage.removeItem("preselect_equipment");
    }
  }, [equipment]);

  const addSpare = ()=> setForm((f)=>({ ...f, sparesUsed:[...f.sparesUsed, { partId:"", quantity:1 }] }));
  const updateSpare = (idx, field, value) => { const next=[...form.sparesUsed]; next[idx]= { ...next[idx], [field]: value }; setForm((f)=>({ ...f, sparesUsed: next })); };
  const removeSpare = (idx) => { const next=[...form.sparesUsed]; next.splice(idx,1); setForm((f)=>({ ...f, sparesUsed: next })); };
  
  const submit = async (e) => {
    e.preventDefault();
    if (!form.equipmentId) return alert("Please select an equipment.");
    if (!form.maintenanceId) return alert("Please provide a Maintenance ID.");
    
    try {
      const payload = { 
        ...form, 
        dateOfService: new Date(form.dateOfService), 
        downtimeDurationMinutes: Number(form.downtimeDurationMinutes) 
      };
      await api.post("/maintenance", payload);
      alert("Maintenance log submitted successfully!");
      setForm({ 
        maintenanceId: `ML-${Date.now().toString().slice(-6)}`, 
        equipmentId: "", 
        maintenanceType: "Preventive", 
        description: "", 
        technicianName: user?.name || "", 
        dateOfService: new Date().toISOString().split('T')[0], 
        sparesUsed: [], 
        downtimeDurationMinutes: 0, 
        remarks: "" 
      });
      load();
    } catch (err) { 
      const msg = err.response?.data?.message || "Error submitting maintenance log. Ensure all fields are valid and ID is unique.";
      alert(msg); 
    }
  };
  const approve = async (id) => { await api.put(`/maintenance/${id}/approve`); load(); };
  return (
    <div className="space-y-8 animate-in">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-4">
        <div className="bg-blue-500 text-white p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-sm">How to Log Maintenance</h4>
          <p className="text-blue-700 text-xs leading-relaxed mt-1">
            1. Select an <strong>Equipment</strong> from the dropdown.<br/>
            2. Choose <strong>Preventive</strong> (scheduled) or <strong>Breakdown</strong> (unplanned).<br/>
            3. Add <strong>Spare Parts</strong> if any were replaced (this will automatically decrease stock).<br/>
            4. Submit the report. A <strong>Supervisor</strong> must then approve it to finalize the record.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Maintenance Logs</h1>
        <p className="text-slate-500 text-sm">Review and record equipment service history</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Log ID</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Equipment</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Type</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Technician</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Date</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((l)=>(
                <tr key={l._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{l.maintenanceId}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{l.equipment?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      l.maintenanceType === 'Breakdown' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {l.maintenanceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{l.technicianName}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(l.dateOfService).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${l.approved ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`}></div>
                      <span className={`text-[10px] font-bold uppercase ${l.approved ? 'text-green-600' : 'text-orange-600'}`}>
                        {l.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {!l.approved && user?.role === "Supervisor" && (
                      <button 
                        onClick={()=>approve(l._id)} 
                        className="text-xs font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {user?.role !== "Store Manager" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Log Maintenance Activity
          </h3>
          <form onSubmit={submit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Log ID</label>
                <input placeholder="ML-00X" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.maintenanceId} onChange={(e)=>setForm({...form, maintenanceId:e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Equipment</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none bg-white" value={form.equipmentId} onChange={(e)=>setForm({...form, equipmentId:e.target.value})}>
                  <option value="">Select Equipment</option>
                  {equipment.map(eq=><option key={eq.equipmentId} value={eq.equipmentId}>{eq.name} ({eq.equipmentId})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none bg-white" value={form.maintenanceType} onChange={(e)=>setForm({...form, maintenanceType:e.target.value})}>
                  {["Preventive","Breakdown"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Date</label>
                <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none bg-white" value={form.dateOfService} onChange={(e)=>setForm({...form, dateOfService:e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Technician</label>
                <input placeholder="Technician Name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.technicianName} onChange={(e)=>setForm({...form, technicianName:e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Downtime (Min)</label>
                <input type="number" placeholder="Duration in minutes" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.downtimeDurationMinutes} onChange={(e)=>setForm({...form, downtimeDurationMinutes:e.target.value})} />
              </div>
              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description of Work</label>
                <textarea rows="2" placeholder="Detail the work performed..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none resize-none" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wider">Spare Parts Consumed</h4>
                </div>
                <button type="button" onClick={addSpare} className="text-xs font-bold text-blue-600 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  Add Spare
                </button>
              </div>
              <div className="space-y-3">
                {form.sparesUsed.map((item, idx)=>(
                  <div key={idx} className="grid grid-cols-12 gap-3 items-center animate-in fade-in slide-in-from-left-2 duration-200">
                    <div className="col-span-7">
                      <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-slate-900 transition-all outline-none bg-white" value={item.partId} onChange={(e)=>updateSpare(idx,"partId",e.target.value)}>
                        <option value="">Select Spare Part</option>
                        {spares.map(sp=><option key={sp.partId} value={sp.partId}>{sp.name} ({sp.partId})</option>)}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input type="number" placeholder="Qty" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-slate-900 transition-all outline-none" value={item.quantity} onChange={(e)=>updateSpare(idx,"quantity",Number(e.target.value))} />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button type="button" className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={()=>removeSpare(idx)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
                {form.sparesUsed.length === 0 && (
                  <div className="text-center py-4 text-slate-400 text-[10px] italic">No spares added to this log.</div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2">
                Submit Maintenance Report
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Spares({ user }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ partId:"", name:"", equipmentCategory:"General", currentStock:0, reorderLevel:0, supplierName:"", unitCost:0 });
  const load = async () => { try { const { data } = await api.get("/spares"); setItems(data); } catch (err) { console.error(err); } };
  useEffect(()=>{ load(); },[]);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/spares", { ...form, currentStock:Number(form.currentStock), reorderLevel:Number(form.reorderLevel), unitCost:Number(form.unitCost) });
      setForm({ partId:"", name:"", equipmentCategory:"General", currentStock:0, reorderLevel:0, supplierName:"", unitCost:0 });
      load();
    } catch (err) { alert("Error adding spare part"); }
  };
  const updateStock = async (id, stock) => { try { await api.put(`/spares/${id}`, { currentStock: stock }); load(); } catch (err) { console.error(err); } };
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Spare Parts Inventory</h1>
        <p className="text-slate-500 text-sm">Manage stock levels and supplier information for plant spares</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Part ID</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Name</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Category</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Stock</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Reorder Level</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Cost</th>
                {["Store Manager","Supervisor"].includes(user?.role)?<th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Stock Control</th>:null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((p)=>(
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{p.partId}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-slate-500">{p.equipmentCategory}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${p.currentStock <= p.reorderLevel ? 'text-red-600' : 'text-slate-900'}`}>
                      {p.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{p.reorderLevel}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{p.unitCost.toLocaleString()}</td>
                  {["Store Manager","Supervisor"].includes(user?.role) && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg transition-all" onClick={()=>updateStock(p._id, p.currentStock+1)}>+</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg transition-all" onClick={()=>updateStock(p._id, Math.max(0,p.currentStock-1))}>-</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {["Store Manager","Supervisor"].includes(user?.role) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Add New Spare Part
          </h3>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Part ID</label>
              <input placeholder="SP-00X" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.partId} onChange={(e)=>setForm({...form, partId:e.target.value})} />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Part Name</label>
              <input placeholder="e.g. Hydraulic Filter" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none bg-white" value={form.equipmentCategory} onChange={(e)=>setForm({...form, equipmentCategory:e.target.value})}>{["Crusher","Conveyor","Packing Machine","Kiln","General"].map(t=><option key={t}>{t}</option>)}</select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Supplier</label>
              <input placeholder="Company Name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.supplierName} onChange={(e)=>setForm({...form, supplierName:e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Stock</label>
              <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.currentStock} onChange={(e)=>setForm({...form, currentStock:e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reorder Level</label>
              <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.reorderLevel} onChange={(e)=>setForm({...form, reorderLevel:e.target.value})} />
            </div>
            <div className="space-y-1 col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit Cost (₹)</label>
              <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none" value={form.unitCost} onChange={(e)=>setForm({...form, unitCost:e.target.value})} />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95">Add Part to Catalog</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Reports() {
  const [logs, setLogs] = useState([]);
  const [equipmentMaintenanceFrequency, setEquipmentMaintenanceFrequency] = useState([]);
  const [sparePartsUsage, setSparePartsUsage] = useState([]);

  useEffect(() => {
    const loadReportsData = async () => {
      try {
        const { data: maintenanceLogs } = await api.get("/maintenance");
        setLogs(maintenanceLogs);

        const freqMap = {};
        maintenanceLogs.forEach(l => {
          const equipmentType = l.equipment?.type || "Unknown";
          freqMap[equipmentType] = (freqMap[equipmentType] || 0) + 1;
        });
        setEquipmentMaintenanceFrequency(Object.entries(freqMap).map(([type, count]) => ({ type, count })));

        const usageMap = {};
        maintenanceLogs.forEach(l => {
          l.sparesUsed.forEach(s => {
            const partName = s.part?.name || "Unknown";
            usageMap[partName] = (usageMap[partName] || 0) + s.quantity;
          });
        });
        setSparePartsUsage(Object.entries(usageMap).map(([name, quantity]) => ({ name, quantity })));
      } catch (err) { console.error(err); }
    };
    loadReportsData();
  }, []);

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-slate-500 text-sm">Key performance indicators and resource consumption trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Equipment Service Frequency</h2>
          </div>
          <div className="p-6">
            {equipmentMaintenanceFrequency.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm italic">No service data available.</div>
            ) : (
              <div className="space-y-4">
                {equipmentMaintenanceFrequency.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-bold text-slate-700">{item.type}</span>
                      <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">{item.count} Interventions</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(item.count / Math.max(...equipmentMaintenanceFrequency.map(i=>i.count))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Spare Parts Consumption</h2>
          </div>
          <div className="p-6">
            {sparePartsUsage.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm italic">No usage data available.</div>
            ) : (
              <div className="space-y-4">
                {sparePartsUsage.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                      <span className="text-xs font-black text-orange-600 uppercase tracking-tighter">{item.quantity} Units</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-orange-400 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(item.quantity / Math.max(...sparePartsUsage.map(i=>i.quantity))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
    <Layout user={user} onLogout={logout} setView={setView} currentView={view}>
      {view==="dashboard" && <Dashboard setView={setView} />}
      {view==="equipment" && <Equipment user={user} />}
      {view==="maintenance" && <Maintenance user={user} />}
      {view==="spares" && <Spares user={user} />}
      {view==="reports" && <Reports />}
    </Layout>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
