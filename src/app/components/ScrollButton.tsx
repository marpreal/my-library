export default function ScrollButton({ targetId, onClick }: { targetId: string; onClick: (id: string) => void }) {
    return (
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-7xl cursor-pointer hover:scale-110 transition animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" onClick={() => onClick(targetId)}>
        ↓
      </div>
    );
  }
  