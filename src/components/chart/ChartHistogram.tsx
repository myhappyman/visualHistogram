import { useEffect, useState } from 'react';
import axios from 'axios';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine } from 'victory';
import {
  arrMinMax,
  getAvgAndVariance,
  getBinWidthArray,
  normalDistribution,
} from '../../utils/distribution';

interface VictoryHistogramType {
  className: string;
}

interface ChartType {
  x: number | string;
  y: number;
}

interface binType {
  value: number;
  index: number;
}

const ChartHistogram = ({ className }: VictoryHistogramType) => {
  const [binList, setBinList] = useState<number[]>([]); // 빈리스트
  const [bin, setBin] = useState<binType>({ value: 0, index: 0 }); // 선택한 빈값
  const [columnList, setColumnList] = useState<string[]>([]);
  const [minMax, setMinMax] = useState({ min: 0, max: 0 });
  const [avgAndVar, setAvgAndVar] = useState({ mean: 0, variance: 0 });
  const [selectColumn, setSelectColumn] = useState(''); // 선택한 컬럼
  const [jsonData, setJsonData] = useState([]); // DB요청으로 받아온 데이터
  const [barData, setBarData] = useState<ChartType[]>([]); // histogram 그리기용 데이터
  const [lineData, setLineData] = useState<ChartType[]>([]); // 표준 정규 분포 그리기용 데이터

  const binChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, selectedIndex } = e.target;
    setBin({ value: +value, index: selectedIndex });
  };

  const columnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectColumn(value);
  };

  useEffect(() => {
    const id = '6549d993b3d5a954733431af'; // iris
    const url = `http://192.168.0.36:8080/files/${id}`;
    axios.post(url).then((res) => {
      const arr = JSON.parse(res?.data?.dataframe);
      // Unnamed값 지우기
      const filterArr = arr.map((item: any) => {
        return Object.fromEntries(
          Object.entries(item).filter(([key]) => !['Unnamed: 0'].includes(key)),
        );
      });

      if (filterArr && filterArr.length > 0) {
        setJsonData(filterArr);
        setColumnList(Object.keys(filterArr[0]));
        setSelectColumn(Object.keys(filterArr[0])[0]);
      } else {
        alert('데이터를 불러오지 못했습니다.');
      }
    });
  }, []);

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

    columnList.forEach((_) => {
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

    const drawAvg =
      drawHistogramData.reduce((a, c) => a + c.y, 0) / drawHistogramData.length;
    console.log(max, min);
    console.log(maxCnt, minCnt);

    // 여기서부터 표준 정규 분포 그리기 시작
    const { mean, variance } = getAvgAndVariance(selectArr);
    setAvgAndVar({ mean, variance });

    const arrRange = Math.floor(max - min) < 4 ? 4 : Math.floor(max - min);
    const lineArr = Array(arrRange)
      .fill(Math.floor(min) - 1)
      // .fill(0)
      .map((n, i: number) => ({
        x: n + i,
        y: normalDistribution(n + i, mean, variance),
      }));
    const lineMax = Math.max(...lineArr.map((x) => x.y));
    const scaleRate = maxCnt / lineMax;
    const resultArr = lineArr.map((x) => ({
      ...x,
      y: x.y * scaleRate,
    }));
    setLineData(resultArr); // line용
  }, [bin]);

  return (
    <div className={className}>
      <div className="option">
        <select onChange={columnChange}>
          {columnList.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
        <select onChange={binChange} value={bin.value}>
          {binList.map((bin) => (
            <option key={bin} value={bin}>
              {bin}
            </option>
          ))}
        </select>
        <span>평균값: {avgAndVar.mean}</span>
        <span>분산값(σ): {avgAndVar.variance}</span>
      </div>
      <div className="chart">
        {barData && lineData && (
          // <VictoryChart domainPadding={{ x: 100 }}>
          <VictoryChart>
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 6 }, // X축 눈금 레이블 폰트 크기
              }}
            />

            {/* Y축 설정 */}
            <VictoryAxis
              dependentAxis
              style={{
                tickLabels: { fontSize: 6 }, // Y축 눈금 레이블 폰트 크기
              }}
            />

            <VictoryBar
              width={200}
              style={{
                data: { fill: '#67b7dc', strokeWidth: 1, fontSize: 8 },
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
