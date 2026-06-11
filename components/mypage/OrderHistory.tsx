export default function OrderHistory() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-surface-container h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-headline-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">shopping_bag</span>
          주문 내역
        </h2>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[40px] text-tertiary-container">construction</span>
        </div>
        <p className="text-headline-sm text-on-surface mb-2">준비 중입니다</p>
        <p className="text-body-md text-secondary max-w-xs">
          현재 주문 내역 시스템을 고도화하고 있습니다.
          <br />
          곧 더 편리한 내역 확인 기능을 제공해 드릴게요.
        </p>
      </div>
    </div>
  );
}
