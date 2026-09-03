import React, { useState } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'secondary' | 'sidebar' | 'compact' | 'header';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'primary',
  className = ''
}) => {
  const { isInstalled } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs ${className}`}>
        <Check size={14} />
        <span>App Instalação Ativa</span>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`w-full flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-lg shadow-rose-600/20 transition-all font-bold text-sm cursor-pointer ${className}`}
        >
          <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0">
            <Download size={18} />
          </div>
          <div className="text-left flex-1">
            <span className="block leading-tight font-black">Baixar Aplicativo</span>
            <span className="block text-[10px] text-rose-200 font-medium">Instalar no Celular/PC</span>
          </div>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md shadow-rose-600/20 hover:scale-[1.03] active:scale-95 cursor-pointer ${className}`}
        >
          <Smartphone size={15} />
          <span className="hidden sm:inline">Baixar App</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all cursor-pointer ${className}`}
          title="Baixar aplicativo Pedsocorro"
        >
          <Download size={18} />
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/20 hover:scale-[1.02] active:scale-95 cursor-pointer ${className}`}
      >
        <Download size={16} />
        <span>Baixar App Pedsocorro</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
