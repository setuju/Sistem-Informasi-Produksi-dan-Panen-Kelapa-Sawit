import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-xl flex flex-col shadow-2xl overflow-hidden">
        <div className="bg-[#15803d] text-white p-4 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-base">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-green-700 transition text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6 pb-24 sm:pb-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
