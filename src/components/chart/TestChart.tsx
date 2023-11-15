import { VictoryAxis, VictoryBar, VictoryChart } from 'victory';

const TestChart = () => {
  const data = [
    { x: 1, y: 100 },
    // Add more data points as needed
  ];

  return (
    <div className="area">
      <VictoryChart>
        <VictoryAxis
          // X축 설정
          tickValues={[1]} // X축에 하나의 눈금 표시
          tickFormat={() => '0-20'} // 표시할 레이블
        />

        <VictoryAxis
          // Y축 설정
          dependentAxis
          tickValues={[0, 20, 40, 60, 80, 100]} // Y축에 표시할 눈금 값
          domain={[0, 100]} // Y축의 범위 설정
        />

        <VictoryBar
          // 바 차트 데이터 설정
          data={data}
        />
      </VictoryChart>
    </div>
  );
};

export default TestChart;
