import '../assets/style/edaPage.scss';
import IframeGetChart from '../components/chart/IframeGetChart';
import ChartHistogram from '../components/chart/ChartHistogram';
import ChartLine from '../components/chart/ChartLine';
import TestChart from '../components/chart/TestChart';

const EdaPage = () => {
  return (
    <div className="eda">
      <h1>EDA PAGE</h1>
      <div className="layout">
        {/* <IframeGetChart url="http://localhost:3001" className="area left_top" /> */}
        {/* <IframeGetChart url="http://192.168.0.157:8050/" className="chart right_top" /> */}
        <ChartHistogram className="area left_bottom" />
        <ChartLine className="area right_bottom" />
        <ChartLine className="area right_bottom" />
        <ChartLine className="area right_bottom" />
      </div>
    </div>
  );
};

export default EdaPage;
