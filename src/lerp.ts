// This is our Linear Interpolation method. It takes 3 parameters:
// a: The starting value
// b: The destination value
// n: The normal value (between 0 and 1) to control the Linear Interpolation
//
// If your normal value is equal to 1 the circle will instantly switch from A to B.
// If your normal value is equal to 0 the circle will not move.
// The closer your normal is to 0 the smoother will be the interpolation.
// The closer your normal is to 1 the sharper will be the interpolation.
export const lerp = (a: number, b: number, n: number) => {
  return (1 - n) * a + n * b;
}
