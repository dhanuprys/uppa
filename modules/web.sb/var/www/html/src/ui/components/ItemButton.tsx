import { ReactNode } from 'react';

function ItemButton({ children, onClick, active }: { children: ReactNode, onClick: () => void, active?: boolean }) {
    return (
        <button onClick={onClick} className={`w-full min-h-[70px] px-6 text-sm py-4 text-left font-semibold rounded-2xl transition-all flex items-center gap-2 ${active ? 'bg-blue-700 text-white' : 'text-slate-500 hover:bg-blue-200'}`}>
            {children}
        </button>
    );
}

export default ItemButton;