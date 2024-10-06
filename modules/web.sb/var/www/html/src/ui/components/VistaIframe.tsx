function VistaIframe({ className, index }: { className?: string, index: number }) {
    return (
        <div className={className ?? ''}>
            <iframe className="w-full h-screen" title="WorldView" src={`/3dvista/index.htm?media-index=${index}`} loading="eager"></iframe>
        </div>
    );
}

export default VistaIframe;