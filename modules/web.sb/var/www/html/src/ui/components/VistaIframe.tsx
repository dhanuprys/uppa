function VistaIframe({ index, iframeClassName, className }: { className?: string, iframeClassName?: string, index?: number }) {
    return (
        <div className={className || ''}>
            {index && <iframe className={`size-full ${iframeClassName || ''}`} title="WorldView" src={`/3dvista/index.htm?media-index=${index}`} loading="eager"></iframe>}
        </div>
    );
}

export default VistaIframe;