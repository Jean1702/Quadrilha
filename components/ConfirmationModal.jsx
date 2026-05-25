"use client";

import { AlertCircle, CheckCircle, Trash2, Plus } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  actionType = 'confirm',
  onConfirm, 
  onCancel,
  isLoading = false 
}) {
  if (!isOpen) return null;

  const getActionConfig = () => {
    const configs = {
      add: { 
        icon: Plus, 
        color: '#026A4C',
        buttonText: 'Adicionar',
        iconBg: 'rgba(2, 106, 76, 0.15)'
      },
      delete: { 
        icon: Trash2, 
        color: '#D95032',
        buttonText: 'Remover',
        iconBg: 'rgba(217, 80, 50, 0.15)'
      },
      cancel: { 
        icon: AlertCircle, 
        color: '#D95032',
        buttonText: 'Cancelar Pedido',
        iconBg: 'rgba(217, 80, 50, 0.15)'
      },
      confirm: { 
        icon: CheckCircle, 
        color: '#026A4C',
        buttonText: 'Confirmar',
        iconBg: 'rgba(2, 106, 76, 0.15)'
      }
    };
    return configs[actionType] || configs.confirm;
  };

  const config = getActionConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div
        className="shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-300 overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '28px',
          border: '3px solid black'
        }}
      >
        
        {/* Ícone + Título lado a lado */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: config.iconBg }}
          >
            <IconComponent size={24} color={config.color} />
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        {/* Mensagem */}
        <p className="text-base mb-6 opacity-70">{message}</p>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--bg)',
              border: '2px solid rgba(128,128,128,0.3)'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{ backgroundColor: config.color }}
            className="flex-1 px-4 py-3 rounded-full text-white font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </>
            ) : (
              config.buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}