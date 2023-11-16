import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { JsonDataAtom, selectColumnAtom } from '../../atom/chart';
import {
  arrMinMax,
  meanAndStdDev,
  normalDistribution,
} from '../../utils/distribution';
import { ChartAreaProps, ChartType } from './type/ChartType';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory';
import { cuttingDigits } from '../../utils/utils';

const ChartDistribution = ({ className }: ChartAreaProps) => {
  const jsonData = useRecoilValue(JsonDataAtom);
  const selectColumn = useRecoilValue(selectColumnAtom);
  const [lineData, setLineData] = useState<ChartType[]>([]); // 표준 정규 분포 그리기용 데이터
  const [avgAndVar, setAvgAndVar] = useState({ mean: 0, std_dev: 0 });

  useEffect(() => {
    if (jsonData && jsonData.length > 0 && selectColumn) {
      const selectArr = jsonData.map((x) => ({
        [selectColumn]: x[selectColumn],
      }));
      const { min, max } = arrMinMax(selectArr, selectColumn);
      const pureData = jsonData.map((x) => x[selectColumn]);
      const { mean, std_dev } = meanAndStdDev(pureData);
      setAvgAndVar({ mean, std_dev });

      const arrRange = Math.floor(max - min) < 4 ? 4 : Math.floor(max - min);
      const lineArr = Array(arrRange)
        .fill(Math.floor(min) - 1)
        .map((n, i: number) => ({
          x: n + i,
          y: normalDistribution(n + i, mean, std_dev),
        }));

      setLineData(lineArr); // line용
    }
  }, [jsonData, selectColumn]);

  return (
    <div className={className}>
      <ul className="option_area">
        <li className="bold">Normal Distribution</li>
        <li>
          <span>평균값: {cuttingDigits(avgAndVar.mean, 3)}</span>
        </li>
        <li>
          <span>분산값(σ): {cuttingDigits(avgAndVar.std_dev, 3)}</span>
        </li>
      </ul>
      <div className="chart">
        {lineData && (
          // <VictoryChart domainPadding={{ x: 100 }}>
          <VictoryChart>
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 8 }, // X축 눈금 레이블 폰트 크기
              }}
            />

            {/* Y축 설정 */}
            <VictoryAxis
              dependentAxis
              style={{
                tickLabels: { fontSize: 8 }, // Y축 눈금 레이블 폰트 크기
              }}
            />

            <VictoryLine
              data={lineData}
              interpolation="natural"
              style={{
                data: { strokeWidth: 1 },
                labels: { fontSize: 8 },
              }}
              animate={{
                duration: 600,
                onLoad: { duration: 600 },
              }}
            />
          </VictoryChart>
        )}
      </div>
    </div>
  );
};

export default ChartDistribution;
