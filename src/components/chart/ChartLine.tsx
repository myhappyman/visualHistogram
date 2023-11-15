import { VictoryLine } from 'victory';

interface ChartLineProps {
  className: string;
}

const ChartLine = ({ className }: ChartLineProps) => {
  const data = [1, 2, 22, 2, 2, 2, 2, 3, 4, 5, 6, 67, 7, 7, 76, 5, 67, 5];

  return (
    <div className={className}>
      <div className="chart">
        <VictoryLine interpolation="natural" data={data} />
      </div>
    </div>
  );
};

export default ChartLine;
