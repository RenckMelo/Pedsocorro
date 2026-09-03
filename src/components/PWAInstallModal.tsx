import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Download, 
  Smartphone, 
  Apple, 
  CheckCircle2, 
  X, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'ios' | 'android'>('auto');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-br from-rose-600 via-rose-700 to-slate-900 p-8 text-white">
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md animate-pulse" />
                <img 
                  src="/pwa-192x192.png" 
                  alt="Pedsocorro Icon" 
                  className="relative w-20 h-20 rounded-2xl shadow-2xl border-2 border-white/20 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 border border-white/20 text-[10px] font-black uppercase tracking-widest text-rose-200">
                  <ShieldCheck size={12} /> App PWA Oficial
                </div>
                <h2 className="font-serif font-black italic text-2xl tracking-tight text-white">Pedsocorro</h2>
                <p className="text-xs text-rose-100 font-medium">Instale no Android, iPhone, iPad ou PC</p>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="p-6 space-y-6">
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('auto')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'auto' 
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-md' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Download size={15} />
                <span>Instalação Direta</span>
              </button>

              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'ios' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Apple size={15} />
                <span>iOS (iPhone/iPad)</span>
              </button>

              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'android' 
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone size={15} />
                <span>Android / Chrome</span>
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'auto' && (
              <div className="space-y-5">
                {isInstalled || installSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check size={24} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">Aplicativo Instalação Concluída!</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      O Pedsocorro já está instalado no seu dispositivo. Procure o ícone na sua tela inicial para abrir rapidamente.
                    </p>
                  </div>
                ) : isInstallable ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Seu navegador suporta instalação direta de um clique. Clique no botão abaixo para adicionar o atalho do <strong>Pedsocorro</strong> à sua tela de início.
                    </p>
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-rose-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Download size={18} />
                      <span>Instalar Pedsocorro Agora</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                      <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Smartphone size={16} className="text-rose-500" />
                        Instalação Manual do Atalho PWA
                      </p>
                      <p>
                        Para transformar o Pedsocorro em um aplicativo nativo na sua tela inicial, selecione sua plataforma nas abas acima (iOS ou Android) para ver o passo a passo simplificado.
                      </p>
                    </div>
                  </div>
                )}

                {/* Features list */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                      <Zap size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white">Abertura Rápida</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Sem barra do navegador</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
                      <WifiOff size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white">Acesso Offline</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Cache de protocolos</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  <Apple size={16} className="text-slate-900 dark:text-white" />
                  <span>Passo a Passo para iPhone e iPad (Safari)</span>
                </div>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center shrink-0 text-sm">
                      1
                    </div>
                    <div>
                      Abra este site no navegador <strong>Safari</strong> do iOS e toque no botão <strong>Compartilhar</strong> na barra do Safari.
                    </div>
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
                      <Share size={18} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center shrink-0 text-sm">
                      2
                    </div>
                    <div>
                      Role as opções para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.
                    </div>
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
                      <PlusSquare size={18} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center shrink-0 text-sm">
                      3
                    </div>
                    <div>
                      Confirme tocando em <strong>"Adicionar"</strong> no canto superior direito.
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'android' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  <Smartphone size={16} className="text-emerald-500" />
                  <span>Passo a Passo para Android (Google Chrome / Edge)</span>
                </div>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm">
                      1
                    </div>
                    <div>
                      Toque no menu de <strong>Três Pontos</strong> no canto superior direito do navegador.
                    </div>
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
                      <MoreVertical size={18} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm">
                      2
                    </div>
                    <div>
                      Selecione a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à Tela Inicial"</strong>.
                    </div>
                    <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
                      <Download size={18} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm">
                      3
                    </div>
                    <div>
                      Confirme em <strong>"Instalar"</strong> na janela pop-up do Android.
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Close / Action footer */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
