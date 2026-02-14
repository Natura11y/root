const TrackPanel = ({ panel }) => {
  return (
    <a className="backdrop" href={panel.linkUrl}>
      <div className="backdrop__media">
        <img className="opacity-50" src={panel.imageUrl} alt={panel.altText} />
      </div>
      <div className="backdrop__cover align-content-end">
        <div className="margin-2">
          <span className="button font-size-sm">{panel.buttonText}</span>
        </div>
      </div>
    </a>
  );
};

export default TrackPanel;
