import { useState, useEffect, FormEvent } from 'react';
import { User as UserIcon, Lock, KeyRound, UserPlus, CheckCircle, Stethoscope, LogOut, ArrowRight, X, ShieldCheck, Sparkles, ChevronRight, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { saveUserToCloud, fetchUsersFromCloud } from '../lib/firebase';

const DEFAULT_USERS: User[] = [
  {
    id: 'user_dr_silva',
    username: 'dr.silva',
    name: 'Dr. Gabriel Silva',
    crm: 'CRM/SP 123.456',
    specialty: 'Clínica Médica & Pediatria',
    avatarColor: 'bg-rose-600',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_dra_maria',
    username: 'dra.maria',
    name: 'Dra. Maria Fernandes',
    crm: 'CRM/RJ 654.321',
    specialty: 'Cardiologia',
    avatarColor: 'bg-teal-600',
    createdAt: new Date().toISOString()
  }
];

const PASSWORDS_MAP: Record<string, string> = {
  'dr.silva': '123456',
  'dra.maria': '123456'
};

export function getRegisteredUsers(): User[] {
  try {
    const stored = localStorage.getItem('medical_app_registered_users');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse registered users:', e);
  }
  localStorage.setItem('medical_app_registered_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem('medical_app_current_user');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse current user:', e);
  }
  // Default to dr.silva for seamless first impression
  const users = getRegisteredUsers();
  const defaultUser = users[0] || DEFAULT_USERS[0];
  localStorage.setItem('medical_app_current_user', JSON.stringify(defaultUser));
  return defaultUser;
}

interface AuthScreenProps {
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
}

export default function AuthScreen({ currentUser, onLoginSuccess, onLogout }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [usersList, setUsersList] = useState<User[]>(() => getRegisteredUsers());

  // Load cloud users on mount
  useEffect(() => {
    async function syncCloudUsers() {
      const cloudUsers = await fetchUsersFromCloud();
      if (cloudUsers && cloudUsers.length > 0) {
        setUsersList(cloudUsers);
        localStorage.setItem('medical_app_registered_users', JSON.stringify(cloudUsers));
      }
    }
    syncCloudUsers();
  }, []);
  
  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regCRM, setRegCRM] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('Clínica Geral');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const usernameClean = loginUsername.trim().toLowerCase();
    if (!usernameClean || !loginPassword) {
      setLoginError('Preencha o usuário e a senha.');
      return;
    }

    const foundUser = usersList.find(u => u.username.toLowerCase() === usernameClean);

    if (!foundUser) {
      setLoginError('Usuário não encontrado. Crie uma conta no botão abaixo.');
      return;
    }

    // Check password
    let storedPasswords: Record<string, string> = PASSWORDS_MAP;
    try {
      const passData = localStorage.getItem('medical_app_user_passwords');
      if (passData) {
        storedPasswords = { ...PASSWORDS_MAP, ...JSON.parse(passData) };
      }
    } catch (err) {}

    const correctPass = storedPasswords[foundUser.username.toLowerCase()];
    if (correctPass && correctPass !== loginPassword) {
      setLoginError('Senha incorreta.');
      return;
    }

    // Save active user
    localStorage.setItem('medical_app_current_user', JSON.stringify(foundUser));
    saveUserToCloud(foundUser);
    onLoginSuccess(foundUser);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim()) {
      setRegError('Informe seu Nome Completo.');
      return;
    }
    const usernameClean = regUsername.trim().toLowerCase().replace(/\s+/g, '.');
    if (!usernameClean || usernameClean.length < 3) {
      setRegError('O nome de usuário deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setRegError('A senha deve ter no mínimo 4 caracteres.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('As senhas não coincidem.');
      return;
    }

    if (usersList.some(u => u.username.toLowerCase() === usernameClean)) {
      setRegError('Este nome de usuário já está em uso.');
      return;
    }

    const colors = ['bg-rose-600', 'bg-teal-600', 'bg-indigo-600', 'bg-amber-600', 'bg-purple-600', 'bg-blue-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: usernameClean,
      name: regName.trim().startsWith('Dr') ? regName.trim() : `Dr(a). ${regName.trim()}`,
      crm: regCRM.trim() ? `CRM ${regCRM.trim()}` : 'CRM Não cadastrado',
      specialty: regSpecialty.trim() || 'Clínica Geral',
      avatarColor: randomColor,
      createdAt: new Date().toISOString()
    };

    // Update users list
    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);
    localStorage.setItem('medical_app_registered_users', JSON.stringify(updatedUsers));

    // Save user to cloud database
    await saveUserToCloud(newUser);

    // Save password
    try {
      const passData = localStorage.getItem('medical_app_user_passwords');
      const passObj = passData ? JSON.parse(passData) : {};
      passObj[usernameClean] = regPassword;
      localStorage.setItem('medical_app_user_passwords', JSON.stringify(passObj));
    } catch (err) {}

    setRegSuccess('Conta criada e salva no banco de dados! Redirecionando...');
    setTimeout(() => {
      localStorage.setItem('medical_app_current_user', JSON.stringify(newUser));
      onLoginSuccess(newUser);
    }, 1000);
  };

  const handleQuickSwitch = (user: User) => {
    localStorage.setItem('medical_app_current_user', JSON.stringify(user));
    saveUserToCloud(user);
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#090D1A] text-slate-900 dark:text-slate-300 flex flex-col justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md shadow-rose-600/30">
              <ShieldCheck size={22} />
            </div>
            <div className="text-left">
              <h1 className="font-serif font-black italic text-xl text-slate-900 dark:text-white leading-none">Pedsocorro</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mt-0.5 flex items-center gap-1">
                <Cloud size={10} /> Banco de Dados Conectado
              </p>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6"
        >
          {/* Mode Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => { setMode('login'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setRegError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Criar Nova Conta
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Usuário
                </label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Ex: dr.silva"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Senha
                </label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900/50">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Acessar Meu Painel</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: Gabriel Silva"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    CRM (Opcional)
                  </label>
                  <input
                    type="text"
                    value={regCRM}
                    onChange={(e) => setRegCRM(e.target.value)}
                    placeholder="123456/SP"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Especialidade
                  </label>
                  <input
                    type="text"
                    value={regSpecialty}
                    onChange={(e) => setRegSpecialty(e.target.value)}
                    placeholder="Clínica Geral"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Nome de Usuário (Login)
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Ex: dr.gabriel"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>
              </div>

              {regError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900/50">
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>{regSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus size={16} />
                <span>Cadastrar e Entrar</span>
              </button>
            </form>
          )}
        </motion.div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          © 2026 Pedsocorro • Firebase Cloud Database Conectado
        </p>
      </div>
    </div>
  );
}
