import Iframe from 'react-iframe';

interface IframeGetChartType {
  className: string;
  url: string;
}

const IframeGetChart = ({ className, url }: IframeGetChartType) => {
  return (
    <div className={className}>
      <Iframe className="iframe" url={url} />
    </div>
  );
};

export default IframeGetChart;
