import BackdropVideo from '@lib/components/natura11y/backdrop';

// ─────────────────────────────────────────────────────────────
// BackdropVideoExamples — shown on the /backdrop-video detail page
// ─────────────────────────────────────────────────────────────

const BackdropVideoExamples = () => {
    return (
        <BackdropVideo
            videoSrc='images/BackdropVideo.mp4'
            fixedHeight='80vh'
        >
            <div className='container medium margin-y-4'>
                <h1 className='banner-headline'>
                    Backdrop Video
                </h1>
            </div>
        </BackdropVideo>
    );
};

export default BackdropVideoExamples;
