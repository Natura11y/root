type FullPagePreviewProps = {
  path: string;
  title: string;
};

const resolvePagePath = (path: string) => {
  const previewFile = '/iframe.html';
  const { pathname } = window.location;
  const storybookBase = pathname.endsWith(previewFile)
    ? pathname.slice(0, -previewFile.length)
    : '';

  return `${storybookBase}/${path}`.replace(/\/+/g, '/');
};

export const FullPagePreview = ({ path, title }: FullPagePreviewProps) => (
  <iframe
    className='full-page-preview'
    data-page-preview
    loading='eager'
    src={resolvePagePath(path)}
    title={`${title} page preview`}
  />
);
