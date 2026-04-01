const { useState, useEffect } = React;

const STORAGE_KEY = "kine-cabinet-data";
const USERS_STORAGE_KEY = "cabinet-users";
const SESSION_KEY = "cabinet-session";

const defaultData = {
  patients: [],
  appointments: [],
  payments: [],
  treatments: [],
};

const APPOINTMENT_TYPES = [
  "Bilan initial",
  "Séance de rééducation",
  "Séance de massage",
  "Électrothérapie",
  "Rééducation respiratoire",
  "Rééducation neurologique",
  "Drainage lymphatique",
  "Thérapie manuelle",
  "Rééducation post-opératoire",
  "Contrôle / Suivi",
  "Urgence",
];

const TREATMENT_TYPES = [
  "Rééducation du genou",
  "Rééducation de l'épaule",
  "Rééducation lombaire",
  "Rééducation cervicale",
  "Rééducation post-fracture",
  "Rééducation post-opératoire",
  "Rééducation neurologique",
  "Rééducation respiratoire",
  "Rééducation périnéale",
  "Kinésithérapie sportive",
  "Drainage lymphatique",
  "Rééducation de la hanche",
  "Rééducation du dos",
  "Rééducation de la cheville",
  "Thérapie manuelle",
];

const BODY_ZONES = [
  "Épaule", "Genou", "Dos / Lombaire", "Cervical", "Hanche",
  "Cheville / Pied", "Poignet / Main", "Coude", "Thorax",
  "Périnée", "Neurologique", "Respiratoire", "Général",
];

const PAYMENT_METHODS = ["Espèces", "Chèque", "Virement", "Carte bancaire"];

// ==================== STYLES ====================
const styles = {
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  loginBox: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  loginTitle: {
    color: "#667eea",
    marginBottom: "10px",
    fontSize: "28px",
  },
  loginSubtitle: {
    color: "#666",
    marginBottom: "30px",
    fontSize: "18px",
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
    textAlign: "right",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  loginButton: {
    width: "100%",
    padding: "12px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  toggleText: {
    color: "#666",
    marginTop: "20px",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
    fontSize: "14px",
  },
  errorMessage: {
    background: "#fee",
    color: "#c33",
    padding: "12px",
    borderRadius: "5px",
    marginBottom: "20px",
    borderLeft: "4px solid #c33",
  },
  demoText: {
    color: "#999",
    fontSize: "12px",
    marginTop: "15px",
  },
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(amount);
}

// ============ STORAGE HELPERS (localStorage for Electron) ============
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.log("No saved data, starting fresh");
  }
  return defaultData;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}

// ============ ICONS ============
const Icons = {
  Dashboard: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}, React.createElement("rect",{x:"3",y:"3",width:"7",height:"7",rx:"1"}), React.createElement("rect",{x:"14",y:"3",width:"7",height:"7",rx:"1"}), React.createElement("rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}), React.createElement("rect",{x:"14",y:"14",width:"7",height:"7",rx:"1"})); },
  Patients: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}, React.createElement("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}), React.createElement("circle",{cx:"9",cy:"7",r:"4"}), React.createElement("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}), React.createElement("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})); },
  Calendar: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}, React.createElement("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2"}), React.createElement("line",{x1:"16",y1:"2",x2:"16",y2:"6"}), React.createElement("line",{x1:"8",y1:"2",x2:"8",y2:"6"}), React.createElement("line",{x1:"3",y1:"10",x2:"21",y2:"10"})); },
  Money: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}, React.createElement("line",{x1:"12",y1:"1",x2:"12",y2:"23"}), React.createElement("path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})); },
  Treatment: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}, React.createElement("path",{d:"M22 12h-4l-3 9L9 3l-3 9H2"})); },
  Plus: function() { return React.createElement("svg", {width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"}, React.createElement("line",{x1:"12",y1:"5",x2:"12",y2:"19"}), React.createElement("line",{x1:"5",y1:"12",x2:"19",y2:"12"})); },
  Search: function() { return React.createElement("svg", {width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("circle",{cx:"11",cy:"11",r:"8"}), React.createElement("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})); },
  Close: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("line",{x1:"18",y1:"6",x2:"6",y2:"18"}), React.createElement("line",{x1:"6",y1:"6",x2:"18",y2:"18"})); },
  Edit: function() { return React.createElement("svg", {width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}), React.createElement("path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})); },
  Trash: function() { return React.createElement("svg", {width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("polyline",{points:"3 6 5 6 21 6"}), React.createElement("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})); },
  Eye: function() { return React.createElement("svg", {width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}), React.createElement("circle",{cx:"12",cy:"12",r:"3"})); },
  Body: function() { return React.createElement("svg", {width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}, React.createElement("circle",{cx:"12",cy:"4",r:"2.5"}), React.createElement("path",{d:"M12 6.5V10"}), React.createElement("path",{d:"M8 8.5L12 10L16 8.5"}), React.createElement("path",{d:"M12 10V14"}), React.createElement("path",{d:"M12 14L8.5 21"}), React.createElement("path",{d:"M12 14L15.5 21"}), React.createElement("path",{d:"M10 17H14"})); },
  Logout: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}), React.createElement("polyline",{points:"16 17 21 12 16 7"}), React.createElement("line",{x1:"21",y1:"12",x2:"9",y2:"12"})); },
  Check: function() { return React.createElement("svg", {width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"}, React.createElement("polyline",{points:"20 6 9 17 4 12"})); },
  Clock: function() { return React.createElement("svg", {width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("circle",{cx:"12",cy:"12",r:"10"}), React.createElement("polyline",{points:"12 6 12 12 16 14"})); },
  ChevronLeft: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("polyline",{points:"15 18 9 12 15 6"})); },
  ChevronRight: function() { return React.createElement("svg", {width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("polyline",{points:"9 18 15 12 9 6"})); },
  Phone: function() { return React.createElement("svg", {width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"})); },
  Sessions: function() { return React.createElement("svg", {width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}, React.createElement("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}), React.createElement("polyline",{points:"14 2 14 8 20 8"}), React.createElement("line",{x1:"16",y1:"13",x2:"8",y2:"13"}), React.createElement("line",{x1:"16",y1:"17",x2:"8",y2:"17"})); },
};

// ============ LOGIN ============
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getStoredUsers = () => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initializeDefaultUsers();
  };

  const initializeDefaultUsers = () => {
    const defaultUsers = [
      { email: "test@test.com", password: "1234", name: "المستخدم التجريبي" },
      { email: "doctor@cabinet.com", password: "0000", name: "الطبيب" }
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  };

  useEffect(() => {
    // Initialize default users if none exist
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      initializeDefaultUsers();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const session = { email: user.email, name: user.name, loginTime: new Date().toISOString() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      onLogin("doctor"); // Pass role to maintain compatibility
    } else {
      setError("Identifiants incorrects");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 4) {
      setError("Le mot de passe doit contenir au moins 4 caractères");
      return;
    }

    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      setError("Cet email est déjà enregistré");
      return;
    }

    const newUser = { email, password, name: email.split("@")[0] };
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const session = { email: newUser.email, name: newUser.name, loginTime: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    onLogin("doctor");
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h1 style={styles.loginTitle}>🏥 Gestion de Cabinet</h1>
        <h2 style={styles.loginSubtitle}>{isSignup ? "Créer un nouveau compte" : "Connexion"}</h2>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={isSignup ? handleSignup : handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
              style={styles.input}
            />
          </div>

          {isSignup && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirmer le mot de passe:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez le mot de passe"
                style={styles.input}
              />
            </div>
          )}

          <button type="submit" style={styles.loginButton}>
            {isSignup ? "Créer un compte" : "Se connecter"}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isSignup ? "Vous avez un compte?" : "Pas encore de compte?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
            }}
            style={styles.toggleButton}
          >
            {isSignup ? "Se connecter" : "Créer un compte"}
          </button>
        </p>

        <p style={styles.demoText}>
          📝 Test: utilisez test@test.com / mot de passe: 1234
        </p>
      </div>
    </div>
  );
}

// ============ MODAL ============
function Modal({ title, onClose, children, width }) {
  width = width || "560px";
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(4px)" }}>
      <div onClick={function(e){e.stopPropagation()}} style={{ background:"#fff", borderRadius:"16px", width:width, maxWidth:"95vw", maxHeight:"90vh", overflow:"auto", boxShadow:"0 20px 50px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px", borderBottom:"1px solid #f0f0f0" }}>
          <h2 style={{ margin:0, fontSize:"17px", fontWeight:"600", color:"#1a1a2e" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#999", padding:"4px" }}><Icons.Close /></button>
        </div>
        <div style={{ padding:"24px" }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return <div style={{ marginBottom:"16px" }}><label style={{ display:"block", fontSize:"13px", fontWeight:"500", color:"#555", marginBottom:"6px" }}>{label}</label>{children}</div>;
}

var inputStyle = { width:"100%", padding:"10px 14px", border:"1.5px solid #e0e0e0", borderRadius:"10px", fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
var selectStyle = Object.assign({}, inputStyle, { background:"#fff" });
var btnPrimary = { padding:"11px 24px", background:"linear-gradient(135deg, #1a3a5c, #2563a0)", color:"#fff", border:"none", borderRadius:"10px", fontSize:"14px", fontWeight:"600", cursor:"pointer" };
var btnSecondary = { padding:"11px 24px", background:"#f5f5f5", color:"#555", border:"none", borderRadius:"10px", fontSize:"14px", fontWeight:"500", cursor:"pointer" };

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ background:"#fff", borderRadius:"14px", padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", flex:1, minWidth:"180px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
        <span style={{ fontSize:"12px", fontWeight:"500", color:"#888", textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</span>
        <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:color+"15", display:"flex", alignItems:"center", justifyContent:"center", color:color }}>{icon}</div>
      </div>
      <div style={{ fontSize:"28px", fontWeight:"700", color:"#1a1a2e" }}>{value}</div>
    </div>
  );
}

// ============ DASHBOARD ============
function Dashboard({ data, setPage, setSelectedPatient }) {
  var today = new Date().toISOString().split("T")[0];
  var todayAppts = data.appointments.filter(function(a){return a.date===today});
  var m = new Date().getMonth(), y = new Date().getFullYear();
  var monthRev = data.payments.filter(function(p){var d=new Date(p.date);return d.getMonth()===m&&d.getFullYear()===y}).reduce(function(s,p){return s+Number(p.montant)},0);
  var todaySess = todayAppts.filter(function(a){return a.type.indexOf("Séance")>=0||a.type.indexOf("rééducation")>=0}).length;
  var upcoming = data.appointments.filter(function(a){return a.date>=today&&a.status!=="Annulé"}).sort(function(a,b){return (a.date+a.heure).localeCompare(b.date+b.heure)}).slice(0,8);
  var getPat = function(id){return data.patients.find(function(p){return p.id===id})};

  return (
    <div>
      <div style={{ marginBottom:"28px" }}>
        <h1 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:"0 0 4px" }}>Tableau de bord</h1>
        <p style={{ fontSize:"14px", color:"#888", margin:0 }}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
      </div>
      <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:"28px" }}>
        <StatCard label="Patients" value={data.patients.length} color="#2563a0" icon={<Icons.Patients/>}/>
        <StatCard label="RDV Aujourd'hui" value={todayAppts.length} color="#e67e22" icon={<Icons.Calendar/>}/>
        <StatCard label="Séances Aujourd'hui" value={todaySess} color="#8e44ad" icon={<Icons.Sessions/>}/>
        <StatCard label="Revenus ce mois" value={formatCurrency(monthRev)} color="#27ae60" icon={<Icons.Money/>}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
        <div style={{ background:"#fff", borderRadius:"14px", padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
            <h3 style={{ margin:0, fontSize:"15px", fontWeight:"600", color:"#1a1a2e" }}>Prochains rendez-vous</h3>
            <button onClick={function(){setPage("appointments")}} style={Object.assign({},btnSecondary,{padding:"6px 14px",fontSize:"12px"})}>Voir tout</button>
          </div>
          {upcoming.length===0 ? <p style={{ color:"#aaa", fontSize:"14px", textAlign:"center", padding:"20px" }}>Aucun rendez-vous</p> :
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {upcoming.map(function(appt){var pat=getPat(appt.patientId);var isT=appt.date===today;return(
              <div key={appt.id} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 12px", borderRadius:"10px", background:isT?"#eef4fb":"#fafafa", border:isT?"1px solid #c5d8ed":"1px solid transparent" }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:isT?"#2563a0":"#e8e8e8", color:isT?"#fff":"#888", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"600", lineHeight:"1.2" }}>
                  <span style={{ fontSize:"14px" }}>{new Date(appt.date).getDate()}</span>
                  <span>{new Date(appt.date).toLocaleDateString("fr-FR",{month:"short"})}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"13px", fontWeight:"600", color:"#1a1a2e" }}>{pat?(pat.prenom+" "+pat.nom):"Patient inconnu"}</div>
                  <div style={{ fontSize:"12px", color:"#888" }}>{appt.heure} · {appt.type}</div>
                </div>
                <span style={{ fontSize:"11px", padding:"3px 10px", borderRadius:"20px", fontWeight:"500",
                  background:appt.status==="Confirmé"?"#e8f5e9":appt.status==="En attente"?"#fff3e0":"#fce4ec",
                  color:appt.status==="Confirmé"?"#2e7d32":appt.status==="En attente"?"#ef6c00":"#c62828" }}>{appt.status}</span>
              </div>
            )})}
          </div>}
        </div>
        <div style={{ background:"#fff", borderRadius:"14px", padding:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
            <h3 style={{ margin:0, fontSize:"15px", fontWeight:"600", color:"#1a1a2e" }}>Derniers patients</h3>
            <button onClick={function(){setPage("patients")}} style={Object.assign({},btnSecondary,{padding:"6px 14px",fontSize:"12px"})}>Voir tout</button>
          </div>
          {data.patients.length===0 ? <p style={{ color:"#aaa", fontSize:"14px", textAlign:"center", padding:"20px" }}>Aucun patient</p> :
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {data.patients.slice().reverse().slice(0,6).map(function(pat){return(
              <div key={pat.id} onClick={function(){setSelectedPatient(pat);setPage("patientDetail")}}
                style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 12px", borderRadius:"10px", background:"#fafafa", cursor:"pointer", transition:"background 0.15s" }}
                onMouseEnter={function(e){e.currentTarget.style.background="#eef4fb"}} onMouseLeave={function(e){e.currentTarget.style.background="#fafafa"}}>
                <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:"#2563a0", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"600" }}>{pat.prenom[0]}{pat.nom[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"13px", fontWeight:"600", color:"#1a1a2e" }}>{pat.prenom} {pat.nom}</div>
                  <div style={{ fontSize:"12px", color:"#888", display:"flex", alignItems:"center", gap:"4px" }}><Icons.Phone/> {pat.tel}</div>
                </div>
                {pat.zone && <span style={{ fontSize:"11px", padding:"3px 10px", borderRadius:"20px", background:"#eef4fb", color:"#2563a0", fontWeight:"500" }}>{pat.zone}</span>}
              </div>
            )})}
          </div>}
        </div>
      </div>
    </div>
  );
}

// ============ PATIENTS ============
function PatientForm({ patient, onSave, onClose }) {
  var [f, setF] = useState(patient||{ nom:"",prenom:"",tel:"",dateNaissance:"",sexe:"M",adresse:"",email:"",zone:"",mutuelle:"",numMutuelle:"",profession:"",antecedents:"",notes:"" });
  var s=function(k,v){setF(Object.assign({},f,{[k]:v}))};
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <FormField label="Nom *"><input style={inputStyle} value={f.nom} onChange={function(e){s("nom",e.target.value)}}/></FormField>
        <FormField label="Prénom *"><input style={inputStyle} value={f.prenom} onChange={function(e){s("prenom",e.target.value)}}/></FormField>
        <FormField label="Téléphone *"><input style={inputStyle} value={f.tel} onChange={function(e){s("tel",e.target.value)}} placeholder="06XXXXXXXX"/></FormField>
        <FormField label="Date de naissance"><input type="date" style={inputStyle} value={f.dateNaissance} onChange={function(e){s("dateNaissance",e.target.value)}}/></FormField>
        <FormField label="Sexe"><select style={selectStyle} value={f.sexe} onChange={function(e){s("sexe",e.target.value)}}><option value="M">Masculin</option><option value="F">Féminin</option></select></FormField>
        <FormField label="Profession"><input style={inputStyle} value={f.profession} onChange={function(e){s("profession",e.target.value)}}/></FormField>
        <FormField label="Zone corporelle"><select style={selectStyle} value={f.zone} onChange={function(e){s("zone",e.target.value)}}><option value="">— Sélectionner —</option>{BODY_ZONES.map(function(z){return <option key={z} value={z}>{z}</option>})}</select></FormField>
        <FormField label="Email"><input type="email" style={inputStyle} value={f.email} onChange={function(e){s("email",e.target.value)}}/></FormField>
        <FormField label="Mutuelle / Assurance"><input style={inputStyle} value={f.mutuelle} onChange={function(e){s("mutuelle",e.target.value)}} placeholder="CNSS, CNOPS, AMO..."/></FormField>
        <FormField label="N° Mutuelle"><input style={inputStyle} value={f.numMutuelle} onChange={function(e){s("numMutuelle",e.target.value)}}/></FormField>
      </div>
      <FormField label="Adresse"><input style={inputStyle} value={f.adresse} onChange={function(e){s("adresse",e.target.value)}}/></FormField>
      <FormField label="Antécédents médicaux"><textarea style={Object.assign({},inputStyle,{minHeight:"60px",resize:"vertical"})} value={f.antecedents} onChange={function(e){s("antecedents",e.target.value)}} placeholder="Pathologies, chirurgies, allergies..."/></FormField>
      <FormField label="Notes"><textarea style={Object.assign({},inputStyle,{minHeight:"50px",resize:"vertical"})} value={f.notes} onChange={function(e){s("notes",e.target.value)}}/></FormField>
      <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"8px" }}>
        <button style={btnSecondary} onClick={onClose}>Annuler</button>
        <button style={Object.assign({},btnPrimary,{opacity:f.nom&&f.prenom&&f.tel?1:0.5})} disabled={!f.nom||!f.prenom||!f.tel} onClick={function(){onSave(f)}}>{patient?"Modifier":"Ajouter"}</button>
      </div>
    </div>
  );
}

function PatientsPage({ data, setData, setPage, setSelectedPatient }) {
  var [search, setSearch] = useState("");
  var [showForm, setShowForm] = useState(false);
  var [editP, setEditP] = useState(null);
  var filtered = data.patients.filter(function(p){return (p.nom+" "+p.prenom+" "+p.tel+" "+(p.zone||"")).toLowerCase().indexOf(search.toLowerCase())>=0});

  var save = function(form) {
    if(editP) setData(Object.assign({},data,{patients:data.patients.map(function(p){return p.id===editP.id?Object.assign({},editP,form):p})}));
    else setData(Object.assign({},data,{patients:data.patients.concat([Object.assign({},form,{id:generateId(),dateCreation:new Date().toISOString()})])}));
    setShowForm(false);setEditP(null);
  };
  var del = function(id) { if(confirm("Supprimer ce patient et toutes ses données ?")) setData(Object.assign({},data,{patients:data.patients.filter(function(p){return p.id!==id}),appointments:data.appointments.filter(function(a){return a.patientId!==id}),payments:data.payments.filter(function(p){return p.patientId!==id}),treatments:data.treatments.filter(function(t){return t.patientId!==id})})); };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
        <div><h1 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:"0 0 4px" }}>Patients</h1><p style={{ fontSize:"14px", color:"#888", margin:0 }}>{data.patients.length} patient(s)</p></div>
        <button style={btnPrimary} onClick={function(){setEditP(null);setShowForm(true)}}><span style={{ display:"flex", alignItems:"center", gap:"6px" }}><Icons.Plus/> Nouveau patient</span></button>
      </div>
      <div style={{ position:"relative", marginBottom:"20px" }}>
        <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#aaa" }}><Icons.Search/></span>
        <input placeholder="Rechercher (nom, tél, zone)..." value={search} onChange={function(e){setSearch(e.target.value)}} style={Object.assign({},inputStyle,{paddingLeft:"42px",background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"})}/>
      </div>
      {filtered.length===0 ? <div style={{ textAlign:"center", padding:"60px", color:"#aaa" }}><Icons.Patients/><p>Aucun patient</p></div> :
      <div style={{ background:"#fff", borderRadius:"14px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"14px" }}>
          <thead><tr style={{ background:"#fafafa" }}>{["Patient","Téléphone","Zone","Mutuelle","Actions"].map(function(h){return <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:"600", color:"#888", fontSize:"12px", textTransform:"uppercase" }}>{h}</th>})}</tr></thead>
          <tbody>{filtered.map(function(pat){return(
            <tr key={pat.id} style={{ borderTop:"1px solid #f5f5f5" }}>
              <td style={{ padding:"12px 16px" }}><div style={{ display:"flex", alignItems:"center", gap:"10px" }}><div style={{ width:"34px",height:"34px",borderRadius:"50%",background:"#2563a0",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"600" }}>{pat.prenom[0]}{pat.nom[0]}</div><span style={{ fontWeight:"500" }}>{pat.prenom} {pat.nom}</span></div></td>
              <td style={{ padding:"12px 16px", color:"#666" }}>{pat.tel}</td>
              <td style={{ padding:"12px 16px" }}>{pat.zone?<span style={{ fontSize:"12px",padding:"3px 10px",borderRadius:"20px",background:"#eef4fb",color:"#2563a0",fontWeight:"500" }}>{pat.zone}</span>:"—"}</td>
              <td style={{ padding:"12px 16px", color:"#666", fontSize:"13px" }}>{pat.mutuelle||"—"}</td>
              <td style={{ padding:"12px 16px" }}><div style={{ display:"flex", gap:"6px" }}>
                <button onClick={function(){setSelectedPatient(pat);setPage("patientDetail")}} style={{ background:"none",border:"none",cursor:"pointer",color:"#2563a0",padding:"4px" }}><Icons.Eye/></button>
                <button onClick={function(){setEditP(pat);setShowForm(true)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#e67e22",padding:"4px" }}><Icons.Edit/></button>
                <button onClick={function(){del(pat.id)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#e74c3c",padding:"4px" }}><Icons.Trash/></button>
              </div></td>
            </tr>
          )})}</tbody>
        </table>
      </div>}
      {showForm && <Modal title={editP?"Modifier patient":"Nouveau patient"} onClose={function(){setShowForm(false);setEditP(null)}}><PatientForm patient={editP} onSave={save} onClose={function(){setShowForm(false);setEditP(null)}}/></Modal>}
    </div>
  );
}

// ============ PATIENT DETAIL ============
function PatientDetail({ patient, data, setPage }) {
  var [tab, setTab] = useState("info");
  var appts = data.appointments.filter(function(a){return a.patientId===patient.id}).sort(function(a,b){return b.date.localeCompare(a.date)});
  var pays = data.payments.filter(function(p){return p.patientId===patient.id}).sort(function(a,b){return b.date.localeCompare(a.date)});
  var treats = data.treatments.filter(function(t){return t.patientId===patient.id});
  var totalPaid = pays.reduce(function(s,p){return s+Number(p.montant)},0);
  var totalSess = appts.filter(function(a){return a.status==="Terminé"}).length;
  var age = patient.dateNaissance?Math.floor((Date.now()-new Date(patient.dateNaissance))/31557600000):null;
  var tabs=[{key:"info",label:"Infos"},{key:"rdv",label:"RDV ("+appts.length+")"},{key:"finances",label:"Finances ("+pays.length+")"},{key:"traitements",label:"Traitements ("+treats.length+")"}];

  return (
    <div>
      <button onClick={function(){setPage("patients")}} style={Object.assign({},btnSecondary,{marginBottom:"16px",fontSize:"13px"})}>← Retour</button>
      <div style={{ background:"#fff",borderRadius:"14px",padding:"24px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",marginBottom:"20px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"16px" }}>
          <div style={{ width:"56px",height:"56px",borderRadius:"50%",background:"linear-gradient(135deg,#1a3a5c,#2563a0)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",fontWeight:"600" }}>{patient.prenom[0]}{patient.nom[0]}</div>
          <div style={{ flex:1 }}>
            <h2 style={{ margin:"0 0 4px",fontSize:"20px",fontWeight:"700",color:"#1a1a2e" }}>{patient.prenom} {patient.nom}</h2>
            <div style={{ fontSize:"13px",color:"#888",display:"flex",gap:"16px",flexWrap:"wrap" }}>
              {age && <span>{age} ans</span>}<span>{patient.tel}</span>{patient.zone && <span style={{ color:"#2563a0",fontWeight:"500" }}>{patient.zone}</span>}{patient.mutuelle && <span>Mut: {patient.mutuelle}</span>}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"12px",color:"#888" }}>Séances</div><div style={{ fontSize:"22px",fontWeight:"700",color:"#2563a0" }}>{totalSess}</div>
            <div style={{ fontSize:"12px",color:"#888",marginTop:"4px" }}>Payé</div><div style={{ fontSize:"16px",fontWeight:"600",color:"#27ae60" }}>{formatCurrency(totalPaid)}</div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",gap:"4px",marginBottom:"20px",background:"#f5f5f5",borderRadius:"10px",padding:"4px" }}>
        {tabs.map(function(t){return <button key={t.key} onClick={function(){setTab(t.key)}} style={{ flex:1,padding:"10px",border:"none",borderRadius:"8px",background:tab===t.key?"#fff":"transparent",color:tab===t.key?"#2563a0":"#888",fontWeight:tab===t.key?"600":"400",fontSize:"13px",cursor:"pointer",boxShadow:tab===t.key?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>{t.label}</button>})}
      </div>
      <div style={{ background:"#fff",borderRadius:"14px",padding:"20px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
        {tab==="info" && <div style={{ fontSize:"14px",lineHeight:"2.2" }}>
          <div><strong>Adresse:</strong> {patient.adresse||"—"}</div><div><strong>Naissance:</strong> {formatDate(patient.dateNaissance)||"—"}</div>
          <div><strong>Profession:</strong> {patient.profession||"—"}</div><div><strong>Mutuelle:</strong> {patient.mutuelle||"—"} {patient.numMutuelle?("(N° "+patient.numMutuelle+")"):""}</div>
          <div><strong>Zone:</strong> {patient.zone||"—"}</div><div><strong>Antécédents:</strong> {patient.antecedents||"—"}</div>
          <div><strong>Patient depuis:</strong> {formatDate(patient.dateCreation)}</div><div><strong>Notes:</strong> {patient.notes||"—"}</div>
        </div>}
        {tab==="rdv" && (appts.length===0?<p style={{ color:"#aaa",textAlign:"center" }}>Aucun RDV</p>:<div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>{appts.map(function(a){return(
          <div key={a.id} style={{ display:"flex",alignItems:"center",gap:"12px",padding:"10px",borderRadius:"10px",background:"#fafafa" }}>
            <div style={{ fontSize:"13px",fontWeight:"600",color:"#2563a0",minWidth:"80px" }}>{formatDate(a.date)}</div>
            <div style={{ fontSize:"13px",flex:1 }}>{a.heure} — {a.type}{a.seanceNum?(" (S#"+a.seanceNum+")"):""}</div>
            <span style={{ fontSize:"11px",padding:"3px 10px",borderRadius:"20px",fontWeight:"500",background:a.status==="Terminé"?"#e3f2fd":a.status==="Confirmé"?"#e8f5e9":a.status==="Annulé"?"#fce4ec":"#fff3e0",color:a.status==="Terminé"?"#1565c0":a.status==="Confirmé"?"#2e7d32":a.status==="Annulé"?"#c62828":"#ef6c00" }}>{a.status}</span>
          </div>)})}</div>)}
        {tab==="finances" && (pays.length===0?<p style={{ color:"#aaa",textAlign:"center" }}>Aucun paiement</p>:<div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>{pays.map(function(p){return(
          <div key={p.id} style={{ display:"flex",alignItems:"center",gap:"12px",padding:"10px",borderRadius:"10px",background:"#fafafa" }}>
            <div style={{ fontSize:"13px",fontWeight:"600",color:"#2563a0",minWidth:"80px" }}>{formatDate(p.date)}</div>
            <div style={{ fontSize:"13px",flex:1 }}>{p.description||p.methode}</div>
            <div style={{ fontSize:"14px",fontWeight:"600",color:"#27ae60" }}>{formatCurrency(p.montant)}</div>
          </div>)})}</div>)}
        {tab==="traitements" && (treats.length===0?<p style={{ color:"#aaa",textAlign:"center" }}>Aucun traitement</p>:<div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>{treats.map(function(t){return(
          <div key={t.id} style={{ padding:"14px",borderRadius:"12px",border:"1px solid #eee" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"8px" }}><span style={{ fontSize:"14px",fontWeight:"600" }}>{t.type}</span>
              <span style={{ fontSize:"11px",padding:"3px 10px",borderRadius:"20px",fontWeight:"500",background:t.status==="En cours"?"#e8f5e9":t.status==="Terminé"?"#e3f2fd":"#fff3e0",color:t.status==="En cours"?"#2e7d32":t.status==="Terminé"?"#1565c0":"#ef6c00" }}>{t.status}</span></div>
            <div style={{ fontSize:"12px",color:"#888" }}>Début: {formatDate(t.dateDebut)} {t.nbSeances?("· "+(t.seancesEffectuees||0)+"/"+t.nbSeances+" séances"):""}</div>
            {t.ordonnance && <div style={{ fontSize:"12px",color:"#666",marginTop:"4px" }}>Dr: {t.ordonnance}</div>}
            {t.notes && <div style={{ fontSize:"13px",color:"#555",marginTop:"6px" }}>{t.notes}</div>}
          </div>)})}</div>)}
      </div>
    </div>
  );
}

// ============ APPOINTMENT FORM ============
function AppointmentFormInner({ data, appointment, onSave, onClose }) {
  var [f,setF]=useState(appointment||{patientId:"",date:new Date().toISOString().split("T")[0],heure:"09:00",duree:"30",type:APPOINTMENT_TYPES[0],status:"En attente",seanceNum:"",notes:""});
  var s=function(k,v){setF(Object.assign({},f,{[k]:v}))};
  return (
    <div>
      <FormField label="Patient *"><select style={selectStyle} value={f.patientId} onChange={function(e){s("patientId",e.target.value)}}><option value="">Sélectionner</option>{data.patients.map(function(p){return <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>})}</select></FormField>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 16px" }}>
        <FormField label="Date *"><input type="date" style={inputStyle} value={f.date} onChange={function(e){s("date",e.target.value)}}/></FormField>
        <FormField label="Heure *"><input type="time" style={inputStyle} value={f.heure} onChange={function(e){s("heure",e.target.value)}}/></FormField>
        <FormField label="Durée"><select style={selectStyle} value={f.duree} onChange={function(e){s("duree",e.target.value)}}>{[15,20,30,45,60,90].map(function(d){return <option key={d} value={d}>{d} min</option>})}</select></FormField>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 16px" }}>
        <FormField label="Type"><select style={selectStyle} value={f.type} onChange={function(e){s("type",e.target.value)}}>{APPOINTMENT_TYPES.map(function(t){return <option key={t} value={t}>{t}</option>})}</select></FormField>
        <FormField label="N° Séance"><input type="number" style={inputStyle} value={f.seanceNum} onChange={function(e){s("seanceNum",e.target.value)}} placeholder="Ex: 5"/></FormField>
        <FormField label="Statut"><select style={selectStyle} value={f.status} onChange={function(e){s("status",e.target.value)}}>{["En attente","Confirmé","Terminé","Annulé","Absent"].map(function(st){return <option key={st} value={st}>{st}</option>})}</select></FormField>
      </div>
      <FormField label="Notes"><textarea style={Object.assign({},inputStyle,{minHeight:"60px",resize:"vertical"})} value={f.notes} onChange={function(e){s("notes",e.target.value)}} placeholder="Observations, exercices..."/></FormField>
      <div style={{ display:"flex",gap:"10px",justifyContent:"flex-end",marginTop:"8px" }}>
        <button style={btnSecondary} onClick={onClose}>Annuler</button>
        <button style={Object.assign({},btnPrimary,{opacity:f.patientId&&f.date&&f.heure?1:0.5})} disabled={!f.patientId||!f.date||!f.heure} onClick={function(){onSave(f)}}>{appointment?"Modifier":"Ajouter"}</button>
      </div>
    </div>
  );
}

// ============ APPOINTMENTS PAGE ============
function AppointmentsPage({ data, setData }) {
  var [showForm,setShowForm]=useState(false);var [editA,setEditA]=useState(null);var [viewDate,setViewDate]=useState(new Date());var [viewMode,setViewMode]=useState("day");
  var getPat=function(id){return data.patients.find(function(p){return p.id===id})};
  var dateStr=viewDate.toISOString().split("T")[0];
  var getWeek=function(){var d=new Date(viewDate);var day=d.getDay();var diff=d.getDate()-day+(day===0?-6:1);var mon=new Date(d.setDate(diff));return Array.from({length:7},function(_,i){var dt=new Date(mon);dt.setDate(mon.getDate()+i);return dt})};
  var filtered=data.appointments.filter(function(a){if(viewMode==="day")return a.date===dateStr;return getWeek().map(function(d){return d.toISOString().split("T")[0]}).indexOf(a.date)>=0}).sort(function(a,b){return(a.date+a.heure).localeCompare(b.date+b.heure)});
  var nav=function(dir){var d=new Date(viewDate);d.setDate(d.getDate()+(viewMode==="day"?dir:dir*7));setViewDate(d)};
  var save=function(form){if(editA)setData(Object.assign({},data,{appointments:data.appointments.map(function(a){return a.id===editA.id?Object.assign({},editA,form):a})}));else setData(Object.assign({},data,{appointments:data.appointments.concat([Object.assign({},form,{id:generateId()})])}));setShowForm(false);setEditA(null)};
  var del=function(id){if(confirm("Supprimer ?"))setData(Object.assign({},data,{appointments:data.appointments.filter(function(a){return a.id!==id})}))};

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px" }}>
        <h1 style={{ fontSize:"24px",fontWeight:"700",color:"#1a1a2e",margin:0 }}>Rendez-vous</h1>
        <button style={btnPrimary} onClick={function(){setEditA(null);setShowForm(true)}}><span style={{ display:"flex",alignItems:"center",gap:"6px" }}><Icons.Plus/> Nouveau RDV</span></button>
      </div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:"12px",padding:"12px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",marginBottom:"20px" }}>
        <div style={{ display:"flex",gap:"4px" }}>{["day","week"].map(function(m){return <button key={m} onClick={function(){setViewMode(m)}} style={{ padding:"7px 16px",border:"none",borderRadius:"8px",background:viewMode===m?"#2563a0":"#f5f5f5",color:viewMode===m?"#fff":"#666",fontWeight:"500",fontSize:"13px",cursor:"pointer" }}>{m==="day"?"Jour":"Semaine"}</button>})}</div>
        <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
          <button onClick={function(){nav(-1)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#555" }}><Icons.ChevronLeft/></button>
          <span style={{ fontSize:"15px",fontWeight:"600",color:"#1a1a2e",minWidth:"200px",textAlign:"center" }}>
            {viewMode==="day"?viewDate.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):("Semaine du "+getWeek()[0].toLocaleDateString("fr-FR",{day:"numeric",month:"short"})+" au "+getWeek()[6].toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}))}
          </span>
          <button onClick={function(){nav(1)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#555" }}><Icons.ChevronRight/></button>
        </div>
        <button onClick={function(){setViewDate(new Date())}} style={{ padding:"7px 16px",background:"#f5f5f5",border:"none",borderRadius:"8px",fontSize:"13px",cursor:"pointer",color:"#2563a0",fontWeight:"500" }}>Aujourd'hui</button>
      </div>
      {filtered.length===0?<div style={{ textAlign:"center",padding:"60px",color:"#aaa",background:"#fff",borderRadius:"14px" }}><Icons.Calendar/><p>Aucun RDV</p></div>:
      <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
        {filtered.map(function(appt){var pat=getPat(appt.patientId);return(
          <div key={appt.id} style={{ display:"flex",alignItems:"center",gap:"16px",background:"#fff",borderRadius:"12px",padding:"16px 20px",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",borderLeft:"4px solid "+(appt.status==="Confirmé"?"#27ae60":appt.status==="Terminé"?"#3498db":appt.status==="Annulé"?"#e74c3c":appt.status==="Absent"?"#9b59b6":"#f39c12") }}>
            <div style={{ textAlign:"center",minWidth:"50px" }}><div style={{ fontSize:"20px",fontWeight:"700",color:"#2563a0" }}>{appt.heure}</div><div style={{ fontSize:"11px",color:"#aaa" }}>{appt.duree} min</div></div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"14px",fontWeight:"600",color:"#1a1a2e" }}>{pat?(pat.prenom+" "+pat.nom):"Inconnu"}{appt.seanceNum && <span style={{ fontSize:"12px",color:"#888",marginLeft:"8px" }}>S#{appt.seanceNum}</span>}</div>
              <div style={{ fontSize:"13px",color:"#888" }}>{appt.type}{viewMode==="week"?(" · "+formatDate(appt.date)):""}</div>
              {appt.notes && <div style={{ fontSize:"12px",color:"#aaa",marginTop:"2px" }}>{appt.notes}</div>}
            </div>
            <span style={{ fontSize:"11px",padding:"4px 12px",borderRadius:"20px",fontWeight:"500",background:appt.status==="Confirmé"?"#e8f5e9":appt.status==="Terminé"?"#e3f2fd":appt.status==="Annulé"?"#fce4ec":appt.status==="Absent"?"#f3e5f5":"#fff3e0",color:appt.status==="Confirmé"?"#2e7d32":appt.status==="Terminé"?"#1565c0":appt.status==="Annulé"?"#c62828":appt.status==="Absent"?"#7b1fa2":"#ef6c00" }}>{appt.status}</span>
            <div style={{ display:"flex",gap:"6px" }}>
              <button onClick={function(){setEditA(appt);setShowForm(true)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#e67e22",padding:"4px" }}><Icons.Edit/></button>
              <button onClick={function(){del(appt.id)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#e74c3c",padding:"4px" }}><Icons.Trash/></button>
            </div>
          </div>
        )})}
      </div>}
      {showForm && <Modal title={editA?"Modifier RDV":"Nouveau RDV"} onClose={function(){setShowForm(false);setEditA(null)}}>
        <AppointmentFormInner data={data} appointment={editA} onSave={save} onClose={function(){setShowForm(false);setEditA(null)}}/>
      </Modal>}
    </div>
  );
}

// ============ PAYMENT FORM ============
function PaymentFormInner({ data, payment, onSave, onClose }) {
  var [f,setF]=useState(payment||{patientId:"",montant:"",date:new Date().toISOString().split("T")[0],methode:PAYMENT_METHODS[0],description:""});
  var s=function(k,v){setF(Object.assign({},f,{[k]:v}))};
  return (
    <div>
      <FormField label="Patient *"><select style={selectStyle} value={f.patientId} onChange={function(e){s("patientId",e.target.value)}}><option value="">Sélectionner</option>{data.patients.map(function(p){return <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>})}</select></FormField>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
        <FormField label="Montant (MAD) *"><input type="number" style={inputStyle} value={f.montant} onChange={function(e){s("montant",e.target.value)}} placeholder="0.00"/></FormField>
        <FormField label="Date *"><input type="date" style={inputStyle} value={f.date} onChange={function(e){s("date",e.target.value)}}/></FormField>
      </div>
      <FormField label="Méthode"><select style={selectStyle} value={f.methode} onChange={function(e){s("methode",e.target.value)}}>{PAYMENT_METHODS.map(function(m){return <option key={m} value={m}>{m}</option>})}</select></FormField>
      <FormField label="Description"><input style={inputStyle} value={f.description} onChange={function(e){s("description",e.target.value)}} placeholder="Ex: Séance rééducation..."/></FormField>
      <div style={{ display:"flex",gap:"10px",justifyContent:"flex-end",marginTop:"8px" }}>
        <button style={btnSecondary} onClick={onClose}>Annuler</button>
        <button style={Object.assign({},btnPrimary,{opacity:f.patientId&&f.montant?1:0.5})} disabled={!f.patientId||!f.montant} onClick={function(){onSave(f)}}>{payment?"Modifier":"Enregistrer"}</button>
      </div>
    </div>
  );
}

// ============ FINANCES PAGE ============
function FinancesPage({ data, setData }) {
  var [showForm,setShowForm]=useState(false);var [editP,setEditP]=useState(null);var [filterMonth,setFilterMonth]=useState(new Date().toISOString().slice(0,7));
  var getPat=function(id){return data.patients.find(function(p){return p.id===id})};
  var filtered=data.payments.filter(function(p){return p.date.indexOf(filterMonth)===0}).sort(function(a,b){return b.date.localeCompare(a.date)});
  var monthTot=filtered.reduce(function(s,p){return s+Number(p.montant)},0);var allTot=data.payments.reduce(function(s,p){return s+Number(p.montant)},0);
  var uniqueMonths=[];data.payments.forEach(function(p){var m=p.date.slice(0,7);if(uniqueMonths.indexOf(m)<0)uniqueMonths.push(m)});
  var avg=uniqueMonths.length>0?allTot/uniqueMonths.length:0;
  var byM={};filtered.forEach(function(p){byM[p.methode]=(byM[p.methode]||0)+Number(p.montant)});

  var save=function(form){if(editP)setData(Object.assign({},data,{payments:data.payments.map(function(p){return p.id===editP.id?Object.assign({},editP,form):p})}));else setData(Object.assign({},data,{payments:data.payments.concat([Object.assign({},form,{id:generateId()})])}));setShowForm(false);setEditP(null)};
  var del=function(id){if(confirm("Supprimer ?"))setData(Object.assign({},data,{payments:data.payments.filter(function(p){return p.id!==id})}))};

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px" }}>
        <h1 style={{ fontSize:"24px",fontWeight:"700",color:"#1a1a2e",margin:0 }}>Finances</h1>
        <button style={btnPrimary} onClick={function(){setEditP(null);setShowForm(true)}}><span style={{ display:"flex",alignItems:"center",gap:"6px" }}><Icons.Plus/> Nouveau paiement</span></button>
      </div>
      <div style={{ display:"flex",gap:"16px",marginBottom:"24px",flexWrap:"wrap" }}>
        <StatCard label="Ce mois" value={formatCurrency(monthTot)} color="#27ae60" icon={<Icons.Money/>}/>
        <StatCard label="Total" value={formatCurrency(allTot)} color="#2563a0" icon={<Icons.Money/>}/>
        <StatCard label="Moy/mois" value={formatCurrency(avg)} color="#8e44ad" icon={<Icons.Treatment/>}/>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:"16px",background:"#fff",borderRadius:"12px",padding:"14px 20px",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",marginBottom:"20px" }}>
        <span style={{ fontSize:"13px",fontWeight:"500",color:"#888" }}>Mois:</span>
        <input type="month" value={filterMonth} onChange={function(e){setFilterMonth(e.target.value)}} style={Object.assign({},inputStyle,{width:"auto"})}/>
        <div style={{ marginLeft:"auto",display:"flex",gap:"12px" }}>{Object.keys(byM).map(function(m){return <span key={m} style={{ fontSize:"12px",color:"#888" }}>{m}: <strong style={{ color:"#1a1a2e" }}>{formatCurrency(byM[m])}</strong></span>})}</div>
      </div>
      {filtered.length===0?<div style={{ textAlign:"center",padding:"60px",color:"#aaa",background:"#fff",borderRadius:"14px" }}><Icons.Money/><p>Aucun paiement</p></div>:
      <div style={{ background:"#fff",borderRadius:"14px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"14px" }}>
          <thead><tr style={{ background:"#fafafa" }}>{["Date","Patient","Description","Méthode","Montant",""].map(function(h){return <th key={h} style={{ padding:"12px 16px",textAlign:"left",fontWeight:"600",color:"#888",fontSize:"12px",textTransform:"uppercase" }}>{h}</th>})}</tr></thead>
          <tbody>{filtered.map(function(pay){var pat=getPat(pay.patientId);return(
            <tr key={pay.id} style={{ borderTop:"1px solid #f5f5f5" }}>
              <td style={{ padding:"12px 16px",fontWeight:"500" }}>{formatDate(pay.date)}</td>
              <td style={{ padding:"12px 16px" }}>{pat?(pat.prenom+" "+pat.nom):"—"}</td>
              <td style={{ padding:"12px 16px",color:"#666" }}>{pay.description||"—"}</td>
              <td style={{ padding:"12px 16px" }}><span style={{ fontSize:"12px",padding:"3px 10px",borderRadius:"20px",background:"#f0f0f0",fontWeight:"500" }}>{pay.methode}</span></td>
              <td style={{ padding:"12px 16px",fontWeight:"700",color:"#27ae60" }}>{formatCurrency(pay.montant)}</td>
              <td style={{ padding:"12px 16px" }}><div style={{ display:"flex",gap:"6px" }}>
                <button onClick={function(){setEditP(pay);setShowForm(true)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#e67e22",padding:"4px" }}><Icons.Edit/></button>
                <button onClick={function(){del(pay.id)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#e74c3c",padding:"4px" }}><Icons.Trash/></button>
              </div></td>
            </tr>)})}</tbody>
        </table>
      </div>}
      {showForm && <Modal title={editP?"Modifier":"Nouveau paiement"} onClose={function(){setShowForm(false);setEditP(null)}}>
        <PaymentFormInner data={data} payment={editP} onSave={save} onClose={function(){setShowForm(false);setEditP(null)}}/>
      </Modal>}
    </div>
  );
}

// ============ TREATMENT FORM ============
function TreatmentFormInner({ data, treatment, onSave, onClose }) {
  var [f,setF]=useState(treatment||{patientId:"",type:TREATMENT_TYPES[0],dateDebut:new Date().toISOString().split("T")[0],dateFin:"",status:"En cours",nbSeances:"",seancesEffectuees:"0",ordonnance:"",notes:"",cout:""});
  var s=function(k,v){setF(Object.assign({},f,{[k]:v}))};
  return (
    <div>
      <FormField label="Patient *"><select style={selectStyle} value={f.patientId} onChange={function(e){s("patientId",e.target.value)}}><option value="">Sélectionner</option>{data.patients.map(function(p){return <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>})}</select></FormField>
      <FormField label="Type *"><select style={selectStyle} value={f.type} onChange={function(e){s("type",e.target.value)}}>{TREATMENT_TYPES.map(function(t){return <option key={t} value={t}>{t}</option>})}</select></FormField>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 16px" }}>
        <FormField label="Début *"><input type="date" style={inputStyle} value={f.dateDebut} onChange={function(e){s("dateDebut",e.target.value)}}/></FormField>
        <FormField label="Fin prévue"><input type="date" style={inputStyle} value={f.dateFin} onChange={function(e){s("dateFin",e.target.value)}}/></FormField>
        <FormField label="Coût (MAD)"><input type="number" style={inputStyle} value={f.cout} onChange={function(e){s("cout",e.target.value)}}/></FormField>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 16px" }}>
        <FormField label="Séances prescrites"><input type="number" style={inputStyle} value={f.nbSeances} onChange={function(e){s("nbSeances",e.target.value)}} placeholder="10"/></FormField>
        <FormField label="Séances effectuées"><input type="number" style={inputStyle} value={f.seancesEffectuees} onChange={function(e){s("seancesEffectuees",e.target.value)}}/></FormField>
        <FormField label="Statut"><select style={selectStyle} value={f.status} onChange={function(e){s("status",e.target.value)}}>{["En cours","En pause","Terminé","Annulé"].map(function(st){return <option key={st} value={st}>{st}</option>})}</select></FormField>
      </div>
      <FormField label="Ordonnance / Prescripteur"><input style={inputStyle} value={f.ordonnance} onChange={function(e){s("ordonnance",e.target.value)}} placeholder="Dr. ... / N° ordonnance"/></FormField>
      <FormField label="Notes / Programme"><textarea style={Object.assign({},inputStyle,{minHeight:"80px",resize:"vertical"})} value={f.notes} onChange={function(e){s("notes",e.target.value)}} placeholder="Exercices, objectifs..."/></FormField>
      <div style={{ display:"flex",gap:"10px",justifyContent:"flex-end",marginTop:"8px" }}>
        <button style={btnSecondary} onClick={onClose}>Annuler</button>
        <button style={Object.assign({},btnPrimary,{opacity:f.patientId&&f.type?1:0.5})} disabled={!f.patientId||!f.type} onClick={function(){onSave(f)}}>{treatment?"Modifier":"Ajouter"}</button>
      </div>
    </div>
  );
}

// ============ TREATMENTS PAGE ============
function TreatmentsPage({ data, setData }) {
  var [showForm,setShowForm]=useState(false);var [editT,setEditT]=useState(null);var [filter,setFilter]=useState("all");
  var getPat=function(id){return data.patients.find(function(p){return p.id===id})};
  var filtered=data.treatments.filter(function(t){return filter==="all"||t.status===filter}).sort(function(a,b){return b.dateDebut.localeCompare(a.dateDebut)});
  var counts={"En cours":data.treatments.filter(function(t){return t.status==="En cours"}).length,"Terminé":data.treatments.filter(function(t){return t.status==="Terminé"}).length,"En pause":data.treatments.filter(function(t){return t.status==="En pause"}).length};

  var save=function(form){if(editT)setData(Object.assign({},data,{treatments:data.treatments.map(function(t){return t.id===editT.id?Object.assign({},editT,form):t})}));else setData(Object.assign({},data,{treatments:data.treatments.concat([Object.assign({},form,{id:generateId()})])}));setShowForm(false);setEditT(null)};
  var del=function(id){if(confirm("Supprimer ?"))setData(Object.assign({},data,{treatments:data.treatments.filter(function(t){return t.id!==id})}))};

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px" }}>
        <h1 style={{ fontSize:"24px",fontWeight:"700",color:"#1a1a2e",margin:0 }}>Traitements & Rééducation</h1>
        <button style={btnPrimary} onClick={function(){setEditT(null);setShowForm(true)}}><span style={{ display:"flex",alignItems:"center",gap:"6px" }}><Icons.Plus/> Nouveau</span></button>
      </div>
      <div style={{ display:"flex",gap:"16px",marginBottom:"24px",flexWrap:"wrap" }}>
        <StatCard label="En cours" value={counts["En cours"]} color="#27ae60" icon={<Icons.Treatment/>}/>
        <StatCard label="Terminés" value={counts["Terminé"]} color="#3498db" icon={<Icons.Check/>}/>
        <StatCard label="En pause" value={counts["En pause"]} color="#f39c12" icon={<Icons.Clock/>}/>
      </div>
      <div style={{ display:"flex",gap:"8px",marginBottom:"20px" }}>
        {["all","En cours","Terminé","En pause","Annulé"].map(function(f2){return <button key={f2} onClick={function(){setFilter(f2)}} style={{ padding:"8px 16px",border:"none",borderRadius:"8px",background:filter===f2?"#2563a0":"#f5f5f5",color:filter===f2?"#fff":"#666",fontWeight:"500",fontSize:"13px",cursor:"pointer" }}>{f2==="all"?"Tous":f2}</button>})}
      </div>
      {filtered.length===0?<div style={{ textAlign:"center",padding:"60px",color:"#aaa",background:"#fff",borderRadius:"14px" }}><Icons.Treatment/><p>Aucun traitement</p></div>:
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px" }}>
        {filtered.map(function(treat){var pat=getPat(treat.patientId);var sp=treat.nbSeances?Math.min(100,Math.round((Number(treat.seancesEffectuees||0)/Number(treat.nbSeances))*100)):null;var paid=data.payments.filter(function(p){return p.patientId===treat.patientId}).reduce(function(s,p){return s+Number(p.montant)},0);var fp=treat.cout?Math.min(100,Math.round((paid/Number(treat.cout))*100)):null;
        return(
          <div key={treat.id} style={{ background:"#fff",borderRadius:"14px",padding:"20px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",borderTop:"3px solid "+(treat.status==="En cours"?"#27ae60":treat.status==="Terminé"?"#3498db":treat.status==="En pause"?"#f39c12":"#e74c3c") }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px" }}>
              <div><div style={{ fontSize:"15px",fontWeight:"600",color:"#1a1a2e",marginBottom:"4px" }}>{pat?(pat.prenom+" "+pat.nom):"Inconnu"}</div><div style={{ fontSize:"13px",color:"#2563a0",fontWeight:"500" }}>{treat.type}</div></div>
              <span style={{ fontSize:"11px",padding:"4px 12px",borderRadius:"20px",fontWeight:"500",background:treat.status==="En cours"?"#e8f5e9":treat.status==="Terminé"?"#e3f2fd":treat.status==="En pause"?"#fff3e0":"#fce4ec",color:treat.status==="En cours"?"#2e7d32":treat.status==="Terminé"?"#1565c0":treat.status==="En pause"?"#ef6c00":"#c62828" }}>{treat.status}</span>
            </div>
            <div style={{ fontSize:"12px",color:"#888",marginBottom:"10px" }}>Début: {formatDate(treat.dateDebut)} {treat.dateFin?("· Fin: "+formatDate(treat.dateFin)):""}</div>
            {treat.ordonnance && <div style={{ fontSize:"12px",color:"#666",marginBottom:"8px" }}>Dr: {treat.ordonnance}</div>}
            {sp!==null && <div style={{ marginBottom:"8px" }}><div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",marginBottom:"4px" }}><span style={{ color:"#888" }}>Séances: {treat.seancesEffectuees||0}/{treat.nbSeances}</span><span style={{ fontWeight:"600",color:"#2563a0" }}>{sp}%</span></div><div style={{ height:"6px",background:"#f0f0f0",borderRadius:"3px",overflow:"hidden" }}><div style={{ height:"100%",width:sp+"%",background:sp>=100?"#27ae60":"#2563a0",borderRadius:"3px" }}/></div></div>}
            {fp!==null && <div style={{ marginBottom:"10px" }}><div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",marginBottom:"4px" }}><span style={{ color:"#888" }}>Paiement: {formatCurrency(paid)}/{formatCurrency(treat.cout)}</span><span style={{ fontWeight:"600",color:"#27ae60" }}>{fp}%</span></div><div style={{ height:"6px",background:"#f0f0f0",borderRadius:"3px",overflow:"hidden" }}><div style={{ height:"100%",width:fp+"%",background:fp>=100?"#27ae60":"#f39c12",borderRadius:"3px" }}/></div></div>}
            {treat.notes && <div style={{ fontSize:"12px",color:"#666",padding:"8px",background:"#fafafa",borderRadius:"8px",marginBottom:"10px" }}>{treat.notes}</div>}
            <div style={{ display:"flex",gap:"8px",justifyContent:"flex-end" }}>
              <button onClick={function(){setEditT(treat);setShowForm(true)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#e67e22",padding:"4px" }}><Icons.Edit/></button>
              <button onClick={function(){del(treat.id)}} style={{ background:"none",border:"none",cursor:"pointer",color:"#e74c3c",padding:"4px" }}><Icons.Trash/></button>
            </div>
          </div>
        )})}
      </div>}
      {showForm && <Modal title={editT?"Modifier":"Nouveau traitement"} onClose={function(){setShowForm(false);setEditT(null)}}>
        <TreatmentFormInner data={data} treatment={editT} onSave={save} onClose={function(){setShowForm(false);setEditT(null)}}/>
      </Modal>}
    </div>
  );
}

// ============ MAIN APP ============
function App() {
  var [data,setData]=useState(loadData());
  var [page,setPage]=useState("dashboard");
  var [loggedIn,setLoggedIn]=useState(false);
  var [role,setRole]=useState(null);
  var [selectedPatient,setSelectedPatient]=useState(null);
  var [sidebarCollapsed,setSidebarCollapsed]=useState(false);

  // Save data whenever it changes
  useEffect(function(){saveData(data)},[data]);

  if(!loggedIn) return <LoginScreen onLogin={function(r){setRole(r);setLoggedIn(true)}}/>;

  var navItems=[{key:"dashboard",label:"Tableau de bord",icon:<Icons.Dashboard/>},{key:"patients",label:"Patients",icon:<Icons.Patients/>},{key:"appointments",label:"Rendez-vous",icon:<Icons.Calendar/>},{key:"finances",label:"Finances",icon:<Icons.Money/>},{key:"treatments",label:"Traitements",icon:<Icons.Treatment/>}];

  var renderPage=function(){switch(page){
    case"dashboard":return <Dashboard data={data} setPage={setPage} setSelectedPatient={setSelectedPatient}/>;
    case"patients":return <PatientsPage data={data} setData={setData} setPage={setPage} setSelectedPatient={setSelectedPatient}/>;
    case"patientDetail":return selectedPatient?<PatientDetail patient={selectedPatient} data={data} setPage={setPage}/>:null;
    case"appointments":return <AppointmentsPage data={data} setData={setData}/>;
    case"finances":return <FinancesPage data={data} setData={setData}/>;
    case"treatments":return <TreatmentsPage data={data} setData={setData}/>;
    default:return <Dashboard data={data} setPage={setPage} setSelectedPatient={setSelectedPatient}/>;
  }};

  return (
    <div style={{ display:"flex",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#f4f5f7" }}>
      <div style={{ width:sidebarCollapsed?"68px":"240px",background:"linear-gradient(180deg,#1a2e4a 0%,#1a3a5c 100%)",color:"#fff",display:"flex",flexDirection:"column",transition:"width 0.25s ease",overflow:"hidden",flexShrink:0 }}>
        <div style={{ padding:sidebarCollapsed?"20px 12px":"20px 20px",borderBottom:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",gap:"10px",cursor:"pointer" }} onClick={function(){setSidebarCollapsed(!sidebarCollapsed)}}>
          <div style={{ color:"#64b5f6" }}><Icons.Body/></div>
          {!sidebarCollapsed && <div><div style={{ fontSize:"16px",fontWeight:"700",letterSpacing:"0.5px" }}>KinéGest</div><div style={{ fontSize:"10px",opacity:0.6,marginTop:"2px" }}>Cabinet de Kinésithérapie</div></div>}
        </div>
        <nav style={{ flex:1,padding:"12px 8px" }}>
          {navItems.map(function(item){var active=page===item.key||(item.key==="patients"&&page==="patientDetail");return(
            <button key={item.key} onClick={function(){setPage(item.key)}} style={{ display:"flex",alignItems:"center",gap:"12px",width:"100%",padding:sidebarCollapsed?"12px":"11px 16px",justifyContent:sidebarCollapsed?"center":"flex-start",border:"none",borderRadius:"10px",background:active?"rgba(255,255,255,0.15)":"transparent",color:active?"#fff":"rgba(255,255,255,0.65)",fontSize:"13px",fontWeight:active?"600":"400",cursor:"pointer",marginBottom:"4px",transition:"all 0.15s" }}>
              {item.icon}{!sidebarCollapsed && item.label}
            </button>
          )})}
        </nav>
        <div style={{ padding:sidebarCollapsed?"16px 12px":"16px 20px",borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          {!sidebarCollapsed && <div style={{ fontSize:"12px",opacity:0.5,marginBottom:"8px" }}>Connecté: {role==="doctor"?"الطبيب":"الموظف"}</div>}
          <button onClick={function(){localStorage.removeItem(SESSION_KEY);setLoggedIn(false);setRole(null)}} style={{ display:"flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.7)",padding:sidebarCollapsed?"10px":"8px 14px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",width:"100%",justifyContent:sidebarCollapsed?"center":"flex-start" }}>
            <Icons.Logout/>{!sidebarCollapsed && "تسجيل الخروج"}
          </button>
        </div>
      </div>
      <div style={{ flex:1,padding:"28px 32px",overflowY:"auto",maxHeight:"100vh" }}>{renderPage()}</div>
    </div>
  );
}

// ============ RENDER ============
var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
