import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import axios from 'axios';
import ChartHistogram from '../components/chart/ChartHistogram';
import ChartLine from '../components/chart/ChartLine';
import ChartDistribution from '../components/chart/ChartDistribution';
import { JsonDataAtom, selectColumnAtom } from '../atom/chart';
import '../assets/style/edaPage.scss';

interface RestDataTypes {
  [key: string]: number;
}

const EdaPage = () => {
  const [jsonData, setJsonData] = useRecoilState(JsonDataAtom); // DB요청으로 받아온 데이터
  const [columnList, setColumnList] = useState<string[]>([]); // 컬럼 리스트
  const setSelectColumn = useSetRecoilState(selectColumnAtom); // 선택한 컬럼

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
      const filterArr = arr.map((item: RestDataTypes) => {
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

  return (
    <section className="eda">
      <header>
        <h1>EDA PAGE - Cancer</h1>
        <div className="option_area">
          <span>데이터 컬럼: </span>
          <select onChange={columnChange}>
            {columnList.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>
      </header>

      {jsonData.length > 0 && (
        <div className="layout">
          <ChartHistogram className="area info_chart" />
          <ChartDistribution className="area info_chart" />
          <ChartLine className="area right_bottom" />
          <ChartLine className="area right_bottom" />
        </div>
      )}
    </section>
  );
};

export default EdaPage;
