import { Backdrop, Breadcrumb } from '@lib/components';
import { placeholderImage } from '../data';

export const PageBreadcrumb = () => (
  <div className="border-bottom display-none display-block--lg">
    <div className="container wide padding-y-2">
      <Breadcrumb
        items={[
          { id: 'grandparent', label: 'Grandparent', href: '#1' },
          { id: 'parent', label: 'Parent', href: '#1' },
          { id: 'child-page', label: 'Child Page' },
        ]}
      />
    </div>
  </div>
);

const PageBanner = ({ label, aspectRatioClass = 'aspect-ratio-3x1--lg' }) => (
  <Backdrop
    tag="header"
    imageSrc={placeholderImage({ width: 1500, height: 500, text: label })}
    imageUtilities="opacity-30 gradient-mask-left"
    utilities={`${aspectRatioClass} theme-dark`}
  >
    <PageBreadcrumb />

    <div className="margin-y-auto">
      <div className="container wide">
        <h1 className="banner-headline">Page Title</h1>
      </div>
    </div>
  </Backdrop>
);

export default PageBanner;
