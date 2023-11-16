/**
 * 정규분포를 따르는 데이터 생성
 * @param x
 * @param mean 평균
 * @param std_dev 표준편차
 * @returns
 */
export function normalDistribution(x: number, mean: number, std_dev: number) {
  return (
    (1 / (std_dev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mean) / std_dev) ** 2)
  );
}

export function meanAndStdDev(arr: number[]) {
  const mean = calculateMean(arr);
  const std_dev = Math.sqrt(calculateVariance(arr, mean));
  return { mean, std_dev };
}

const calculateMean = (arr: number[]) => {
  const sum = arr.reduce((acc, num) => acc + num, 0);
  return sum / arr.length;
};

const calculateVariance = (arr: number[], mean: number) => {
  const squaredDifferences = arr.map((num) => Math.pow(num - mean, 2));
  const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
  return sumSquaredDiff / arr.length;
};

export function getBinWidthArray(min: number, max: number): number[] {
  const size = Math.ceil(max - min);
  const result = [] as number[];
  while (result.length < 7) {
    // 분포종류를 6개까지 채운다
    if (result.length === 0) {
      result.push(getNumberFloor(size / 2));
    } else {
      // 분포의 값이 너무 작아지면 개수를 못채워도 빠져나온다
      // if(result[result.length - 1] / 2 < 0.2){
      //     break;
      // }
      const value = result[result.length - 1] / 2;
      result.push(getNumberFloor(value));
    }
  }
  return result;
}

// 분포값 이쁘게 떨어지도록 강제 변환시키는 함수
function getNumberFloor(num: number): number {
  if (num < 1) {
    return parseFloat(num.toFixed(2));
  }

  if (num < 10) {
    return Math.round(num);
  }

  // 10이상부터는
  return Math.floor(num / 5) * 5;
}

interface ArrayType {
  [key: string]: number;
}
export function arrMinMax(array: ArrayType[], key: string) {
  const keyArr = array.map((x) => x[key]);
  const min = Math.min(...keyArr);
  const max = Math.max(...keyArr);
  return { min, max };
}
