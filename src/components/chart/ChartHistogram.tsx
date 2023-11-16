import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine } from 'victory';
import { JsonDataAtom, selectColumnAtom } from '../../atom/chart';
import {
  arrMinMax,
  meanAndStdDev,
  getBinWidthArray,
  normalDistribution,
} from '../../utils/distribution';
import { cuttingDigits } from '../../utils/utils';
import { ChartAreaProps, ChartType, binType } from './type/ChartType';

const ChartHistogram = ({ className }: ChartAreaProps) => {
  const jsonData = useRecoilValue(JsonDataAtom);
  const selectColumn = useRecoilValue(selectColumnAtom);
  const [binList, setBinList] = useState<number[]>([]); // 빈리스트
  const [bin, setBin] = useState<binType>({ value: 0, index: 0 }); // 선택한 빈값
  const [minMax, setMinMax] = useState({ min: 0, max: 0 });
  const [avgAndVar, setAvgAndVar] = useState({ mean: 0, std_dev: 0 });
  const [barData, setBarData] = useState<ChartType[]>([]); // histogram 그리기용 데이터
  const [lineData, setLineData] = useState<ChartType[]>([]); // 표준 정규 분포 그리기용 데이터

  const binChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, selectedIndex } = e.target;
    setBin({ value: +value, index: selectedIndex });
  };

  useEffect(() => {
    if (jsonData && jsonData.length > 0 && selectColumn) {
      const selectArr = jsonData.map((x) => ({
        [selectColumn]: x[selectColumn],
      }));
      const { min, max } = arrMinMax(selectArr, selectColumn);
      setMinMax({ min, max });
      const binWidthList = getBinWidthArray(min, max);
      // binList 처리
      setBinList(binWidthList);
      setBin({ value: binWidthList[0], index: 0 });
    }
  }, [jsonData, selectColumn]);

  // 실질적으로 그리는 effect => 선택한 bin값에 맞춰 쪼갠다.
  useEffect(() => {
    const { min, max } = minMax;
    const range = max - min;
    const binWidthIdx = bin.index ?? 0;
    const splitSize = Math.pow(2, binWidthIdx + 1);
    const columnList = Array(splitSize)
      .fill(selectColumn)
      .map((x, i) => x + i);

    const sepValue = Math.abs(range / splitSize);
    const selectArr = jsonData.map((x) => x[selectColumn]);
    const drawHistogramData = [] as ChartType[];
    let start = min;
    let maxCnt = 0;
    let minCnt = 0;

    columnList.forEach(() => {
      const cnt = selectArr.filter(
        (x) => start <= x && x <= start + sepValue,
      ).length;
      maxCnt = cnt > maxCnt ? cnt : maxCnt;
      minCnt = minCnt === 0 ? cnt : minCnt > cnt ? cnt : minCnt;
      // const x = `${Math.floor(start)}-${Math.floor(start + sepValue)}`;
      const x = Math.floor(start);

      drawHistogramData.push({ x: x, y: cnt });
      start += sepValue;
    });
    setBarData(drawHistogramData); // histogram용

    // 여기서부터 표준 정규 분포 그리기 시작
    const { mean, std_dev } = meanAndStdDev(selectArr);
    setAvgAndVar({ mean, std_dev });

    const arrRange = Math.floor(max - min) < 4 ? 4 : Math.floor(max - min);
    const lineArr = Array(arrRange)
      .fill(Math.floor(min) - 1)
      .map((n, i: number) => ({
        x: n + i,
        y: normalDistribution(n + i, mean, std_dev),
      }));

    // 정규 분포 배열 값중에 가장 큰값을 찾는다.
    const lineMax = Math.max(...lineArr.map((x) => x.y));
    const scaleRate = maxCnt / lineMax; // 히스토그램의 최대 카운팅값과의 비율을 찾는다

    // 비율로 전체값을 다시 재처리 후 라인을 그려준다
    const resultArr = lineArr.map((x) => ({
      ...x,
      y: x.y * scaleRate,
    }));
    setLineData(resultArr); // line용
  }, [bin]);

  return (
    <div className={className}>
      <ul className="option_area">
        <li className="bold">Histogram</li>
        <li>
          <span>Bin: </span>
          <select onChange={binChange} value={bin.value}>
            {binList.map((bin) => (
              <option key={bin} value={bin}>
                {bin}
              </option>
            ))}
          </select>
        </li>
        <li>
          <span>평균값: {cuttingDigits(avgAndVar.mean, 3)}</span>
        </li>
        <li>
          <span>분산값(σ): {cuttingDigits(avgAndVar.std_dev, 3)}</span>
        </li>
      </ul>
      <div className="chart">
        {barData && lineData && (
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

            <VictoryBar
              style={{
                data: { fill: '#67b7dc', strokeWidth: 0, fontSize: 8 },
              }}
              data={barData}
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

export default ChartHistogram;
