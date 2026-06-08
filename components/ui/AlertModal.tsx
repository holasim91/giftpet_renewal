'use client';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={[
          'fixed inset-0 bg-black/40 z-[9990]',
          'transition-opacity duration-200',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[9991] flex items-center justify-center px-6 pointer-events-none"
      >
        <div
          className={[
            'w-full max-w-sm bg-surface-container-lowest rounded-2xl p-8',
            'shadow-[0px_10px_30px_rgba(0,0,0,0.12)]',
            'transition-all duration-200',
            isOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none',
          ].join(' ')}
        >
          <p className="text-body-md text-on-surface mb-8">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-primary text-on-primary rounded-lg text-label-md hover:opacity-90 transition-opacity"
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
}
