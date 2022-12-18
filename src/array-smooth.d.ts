declare module 'array-smooth';

/**
 *
 * @param arr An array containing the values that we want to smooth, it can be an array of numbers or an array of objects defining a specific getter and / or setter
 * @param windowSize The smooth window option its a number that specifies the width of the moving average. It represents how many values to the right and left of the current index the algorithm will take in account when getting the sample to generate the smoothed value
 * @param getter This function will receive the array value as an argument, it should return the attribute to smooth the array with. Is equivalent to calling array.map(getter)
 * @param setter This function receives value and smoothedValue as arguments. The response will be the item that will populate the result array
 */
export default function smooth<TArrayType extends {}>(
  arr: TArrayType[],
  windowSize: number,
  getter?: (value: any) => any,
  setter?: (value: any) => any
): TArrayType[];
