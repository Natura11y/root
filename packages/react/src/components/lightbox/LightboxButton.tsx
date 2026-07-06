import { useContext, type ReactNode } from 'react';
import { LightboxContext } from '../../context/LightboxContext';

interface LightboxButtonProps {
  lbType?: string;
  lbSrc?: string;
  lbCaption?: string;
  lbIndex?: number;
  utilities?: string | null;
  children?: ReactNode;
}

const LightboxButton = ({
  lbType = 'image',
  lbSrc = '',
  lbCaption = 'A caption for the image',
  lbIndex = 0,
  utilities = null,
  children = 'Lightbox Button',
}: LightboxButtonProps) => {
  const ctx = useContext(LightboxContext);
  if (!ctx) return null;

  const { handleLightboxOpen } = ctx;

  return (
    <button
      className={utilities ?? undefined}
      data-lightbox={lbType}
      onClick={() => handleLightboxOpen(lbType, lbSrc, lbCaption, lbIndex)}
    >
      {children}
    </button>
  );
};

export default LightboxButton;
