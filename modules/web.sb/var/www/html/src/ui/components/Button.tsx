import { ReactNode } from 'react';

function Button({ icon, label, onClick }: { icon?: ReactNode, label: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="px-4 py-2 bg-black hover:bg-slate-950 text-white transition-all delay-500 hover:px-16 hover:py-4 rounded-full shadow-2xl flex items-center gap-2">
            {icon && <div>{icon}</div>}
            <span>{label}</span>
        </button>
    );
}

export default Button;