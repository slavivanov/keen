import { getIndex, convertPositionToValue } from './slider.utils';

describe('@keen.io/ui-core - interval utils', () => {
  describe('getIndex()', () => {
    const stepDimension = 100;

    it('should return 0 index', () => {
      const x = 0;
      expect(getIndex(x, stepDimension)).toEqual(0);
    });

    it('should return 0 index for x equals stepDimension', () => {
      const x = 100;
      expect(getIndex(x, stepDimension)).toEqual(0);
    });

    it('should return 1 index', () => {
      const x = 120;
      expect(getIndex(x, stepDimension)).toEqual(1);
    });
  });

  describe('convertPositionToValue()', () => {
    const intervals = [
      {
        minimum: 0,
        maximum: 100,
        step: 10,
      },
      {
        minimum: 100,
        maximum: 1000,
        step: 100,
      },
    ];
    const sliderDimension = 100;

    it('should return value for position 0', () => {
      const position = '0%';
      const value = convertPositionToValue(
        position,
        intervals,
        sliderDimension
      );
      expect(value).toEqual(0);
    });

    it('should return value for position 100', () => {
      const position = '100%';
      const value = convertPositionToValue(
        position,
        intervals,
        sliderDimension
      );
      expect(value).toEqual(1000);
    });

    it('should return value for position 25', () => {
      const position = '25%';
      const value = convertPositionToValue(
        position,
        intervals,
        sliderDimension
      );
      expect(value).toEqual(50);
    });

    it('should return value for position 50', () => {
      const position = '50%';
      const value = convertPositionToValue(
        position,
        intervals,
        sliderDimension
      );
      expect(value).toEqual(100);
    });

    it('should return value for position 75', () => {
      const position = '75%';
      const value = convertPositionToValue(
        position,
        intervals,
        sliderDimension
      );
      expect(value).toEqual(600);
    });
  });
});
