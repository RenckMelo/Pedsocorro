import React, { useState } from 'react';
import { Download, Smartphone, Apple, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'header' | 'sidebar' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'header',
  className = ''
}) => {
  const { isInstalled, isIOS, isAndroid } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] ${className}`}>
        <Check size={14} />
        <span className="hidden sm:inline">App Instalação Ativa</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div className={`p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-500/30 text-white shadow-xl flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
              {isIOS ? <Apple size={20} /> : <Smartphone size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-white">Baixar App Pedsocorro</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {isIOS ? 'iPhone/iPad' : isAndroid ? 'Android' : 'Grátis'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight font-medium">Instale no seu celular para acesso rápido sem abrir o navegador</p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Baixar</span>
          </button>
        </div>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-lg shadow-rose-600/20 transition-all font-bold text-xs cursor-pointer ${className}`}
        >
          <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0">
            <Download size={16} />
          </div>
          <div className="text-left flex-1">
            <span className="block leading-tight font-black text-xs">Baixar Aplicativo</span>
            <span className="block text-[10px] text-rose-200 font-medium">
              {isIOS ? 'Atalho no iPhone / iPad' : isAndroid ? 'Instalar no Android' : 'Instalar no Celular / PC'}
            </span>
          </div>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Default 'header' variant - prominent, visible on all mobile & tablet screens
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs transition-all shadow-lg shadow-rose-600/25 hover:scale-105 active:scale-95 cursor-pointer shrink-0 border border-rose-400/30 ${className}`}
        title="Baixar Aplicativo Pedsocorro no Celular ou PC"
      >
        <div className="relative">
          <Download size={15} className="animate-bounce" />
        </div>
        <span className="font-black text-xs tracking-tight">Baixar App</span>
        {isIOS && <Apple size={13} className="text-rose-200" />}
        {isAndroid && <Smartphone size={13} className="text-rose-200" />}
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
