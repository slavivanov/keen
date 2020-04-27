import { calculateIntervalValue } from './interval.utils';

describe('@keen.io/ui-core - interval utils', () => {
  describe('calculateIntervalValue()', () => {
    const interval = {
      minimum: 0,
      maximum: 100,
      step: 1,
    };

    it('should return "0" for initial position', () => {
      const result = calculateIntervalValue({
        controlPosition: 0,
        currentIndex: 0,
        stepDimension: 100,
        interval,
      });

      expect(result).toEqual(0);
    });

    it('should return "50" for middle position', () => {
      const result = calculateIntervalValue({
        controlPosition: 50,
        currentIndex: 0,
        stepDimension: 100,
        interval,
      });

      expect(result).toEqual(50);
    });

    it('should calculate value for custom interval', () => {
      const interval = {
        minimum: 100,
        maximum: 1000,
        step: 100,
      };

      const result = calculateIntervalValue({
        controlPosition: 150,
        currentIndex: 1,
        stepDimension: 100,
        interval,
      });

      expect(result).toEqual(600);
    });
  });
});