const array = [10, 13, 7, 11, 12, 9, 6, 5];

const smooth = (values: number[], alpha: number) => {
  const weighted = average(values) * alpha;
  const smoothed: number[] = [];

  values.forEach((value, i) => {
    const prev = smoothed[i - 1] || values[values.length - 1];
    const next = value || values[0];
    const improved = average([weighted, prev, value, next]);
    smoothed.push(improved);
  })
  return smoothed;
}

const average = (data: number[]) => {
  const sum = data.reduce((sum, value) => {
    return sum + value;
  }, 0);
  const avg = sum / data.length;
  return avg;
}

// smooth(array, 0.85);

export default smooth
