import { ScaleBand, ScaleLinear, ScaleTime } from 'd3-scale';
import { max, min } from 'd3-array';
import {
  timeDay,
  timeMinute,
  timeMonth,
  timeWeek,
  timeHour,
  timeYear,
  CountableTimeInterval,
} from 'd3-time';

import { formatText } from './utils/format.utils';

import { Tick, Orientation, ScaleSettings, TimePrecision } from './types';

const TICK_ALIGN = 0.5;

export const EDGE_TICK_ALIGN = 4;

export const getKeysDifference = (keys: string[], disabledKeys: string[]) =>
  keys.filter((keyName: string) => !disabledKeys.includes(keyName));

export const normalizeToPercent = (data: object[], keys: string[]) => {
  const maximumValues: number[] = data.map((item: Record<string, number>) =>
    keys.reduce((acc: number, keyName: string) => {
      const value = item[keyName];
      return acc + value;
    }, 0)
  );

  const normalized = data.map((item: Record<string, any>, idx: number) => ({
    ...item,
    ...keys.reduce(
      (acc: Record<string, any>, key: string) => ({
        ...acc,
        [key]: (item[key] / maximumValues[idx]) * 100,
      }),
      {}
    ),
  }));

  return normalized;
};

export const getCenterPosition = (scale: ScaleBand<string>) => {
  const offset = scale.bandwidth() / 2;
  return (value: string) => scale(value) + offset;
};

export const getValues = (data: object[], keys: string[]) =>
  data.reduce(
    (acc: number[], item: any) => [
      ...acc,
      ...keys.map((key: string) => item[key]).filter(v => v !== undefined),
    ],
    []
  ) as number[];

export const calculateStackedRange = (
  data: object[],
  minValue: number | 'auto',
  maxValue: number | 'auto',
  keys: string[]
) => {
  const values: number[] = data.map((item: Record<string, number>) =>
    keys.reduce((acc: number, keyName: string) => {
      const value = item[keyName];
      return acc + value;
    }, 0)
  );

  const minimum = minValue === 'auto' ? 0 : minValue;
  const maximum = maxValue === 'auto' ? max(values) : maxValue;

  return {
    minimum,
    maximum,
  };
};

export const calculateRange = (
  data: object[],
  minValue: number | 'auto',
  maxValue: number | 'auto',
  keys: string[]
) => {
  const values = getValues(data, keys);

  let minimum = minValue === 'auto' ? min(values) : minValue;
  if (minimum > 0) {
    minimum = 0;
  }

  const maximum = maxValue === 'auto' ? max(values) : maxValue;

  return {
    minimum,
    maximum,
  };
};

export const calculateScaleDomain = (
  scale: ScaleLinear<number, number>,
  minimum: number,
  maximum: number
) => {
  const ticks = scale.ticks();
  const ticksLength = ticks.length;
  const tickSize = ticks[1] - ticks[0];

  if (maximum > ticks[ticksLength - 1]) {
    const difference = Math.ceil(maximum / ticksLength);
    const newMaximum =
      difference > tickSize ? ticksLength * difference : ticksLength * tickSize;
    scale.domain([minimum, newMaximum]);
  }
};

const timeModifier: Record<TimePrecision, CountableTimeInterval> = {
  day: timeDay,
  minute: timeMinute,
  hour: timeHour,
  week: timeWeek,
  month: timeMonth,
  year: timeYear,
};

export const getTimeScaleValues = (
  scale: ScaleTime<number, number>,
  { precision }: ScaleSettings
) => {
  const [startDate, endDate] = scale.domain() as Date[];
  const ticks = timeModifier[precision].count(startDate, endDate);
  return scale.ticks(ticks);
};

export const getScaleValues = (
  scale:
    | ScaleBand<string>
    | ScaleLinear<number, number>
    | ScaleTime<number, number>,
  scaleSettings?: ScaleSettings
) => {
  if ('bandwidth' in scale) return scale.domain();
  if (scaleSettings?.type === 'time') {
    return getTimeScaleValues(
      scale as ScaleTime<number, number>,
      scaleSettings
    );
  }

  return scale.ticks();
};

export const generateTicks = ({
  scale,
  tickSize,
  orientation = Orientation.VERTICAL,
  scaleSettings,
  x,
  y,
}: {
  x: number;
  y: number;
  tickSize: number;
  scale:
    | ScaleBand<string>
    | ScaleLinear<number, number>
    | ScaleTime<number, number>;
  orientation?: Orientation;
  scaleSettings?: ScaleSettings;
}): Tick[] => {
  const values = getScaleValues(scale, scaleSettings);

  const ticks: Tick[] = [];
  const position = 'bandwidth' in scale ? getCenterPosition(scale) : scale;

  const getX = (value: string & { valueOf(): number }) =>
    orientation === Orientation.VERTICAL ? position(value) : x + TICK_ALIGN;

  const getY = (value: string & { valueOf(): number }) =>
    orientation === Orientation.VERTICAL ? y - TICK_ALIGN : position(value);

  values.forEach((value: any) => {
    ticks.push({
      size: tickSize,
      text: formatText(value, scaleSettings),
      x: getX(value),
      y: getY(value),
    });
  });

  if ('bandwidth' in scale) {
    const [scaleStart, scaleEnd] = scale.range();

    ticks.push(
      {
        size: tickSize + EDGE_TICK_ALIGN,
        x: orientation === Orientation.VERTICAL ? scaleStart : x + TICK_ALIGN,
        y: orientation === Orientation.VERTICAL ? y - TICK_ALIGN : scaleStart,
      },
      {
        size: tickSize + EDGE_TICK_ALIGN,
        x: orientation === Orientation.VERTICAL ? scaleEnd : x + TICK_ALIGN,
        y: orientation === Orientation.VERTICAL ? y - TICK_ALIGN : scaleEnd,
      }
    );
  }

  return ticks;
};
