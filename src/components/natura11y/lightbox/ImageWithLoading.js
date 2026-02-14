import { useState } from 'react';

const ImageWithLoading = ({ src, alt }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className='lightbox__media__loader'
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'hsla(0, 0%, 0%, 0.5)',
      }}
    >
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoading(false)}
        style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}
      />
      {loading && 
        <div 
          className='icon icon-loading icon--rotate' 
          aria-hidden='true'
          style={{
            position: 'absolute',
          }}
        />
      }
    </div>
  );
};

export default ImageWithLoading;