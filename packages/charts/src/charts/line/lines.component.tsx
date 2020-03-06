import React, { useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Marks from './marks.component';
import Step from './step.component';
import { groupMarksByPosition, findMarksInCluster } from './line-chart.utils';

import { HoverBar, hoverBarMotion } from '../../components';

import { DataSelector, GroupMode, StackMode } from '../../types';

import { Mark, Line, CurveType, StepType } from './types';

const HOVER_BAR_HIDE_TIME = 300;

const createLineMotion = (color: string) => ({
  hidden: {
    pathLength: 0,
    stroke: 'rgba(0, 0, 0, 0)',
  },
  visible: {
    pathLength: 1,
    stroke: color,
  },
});

const lineTransition = { delay: 0.5, duration: 0.8 };

type Props = {
  lines: Line[];
  marks: Mark[];
  steps: StepType[];
  curve: CurveType;
  groupMode?: GroupMode;
  stackMode?: StackMode;
  stepMode: boolean;
  onMarkMouseEnter: (
    e: React.MouseEvent,
    selectors: { selector: DataSelector; color: string }[]
  ) => void;
  onMarkMouseLeave: (e: React.MouseEvent) => void;
};

const Lines = ({
  lines,
  marks,
  steps,
  curve,
  stackMode,
  groupMode,
  stepMode,
  onMarkMouseEnter,
  onMarkMouseLeave,
}: Props) => {
  const hideHoverBar = useRef(null);
  const [hoverBar, setHoverBar] = useState<{
    visible: boolean;
    x: number;
  }>({
    visible: false,
    x: 0,
  });

  const groupedMarks = useMemo(() => groupMarksByPosition(marks), [marks]);

  return (
    <>
      {lines.map(({ key, d, color, strokeWidth }: Line) => (
        <g key={key}>
          <motion.path
            key={`${key}-${curve}-${stackMode}-${groupMode}`}
            d={d}
            variants={createLineMotion(color)}
            transition={lineTransition}
            initial="hidden"
            animate="visible"
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        </g>
      ))}
      <AnimatePresence>
        {hoverBar.visible && (
          <motion.g {...hoverBarMotion}>
            <HoverBar
              onMouseEnter={() =>
                hideHoverBar.current && clearTimeout(hideHoverBar.current)
              }
              onMouseLeave={() => {
                hideHoverBar.current = setTimeout(() => {
                  setHoverBar({
                    visible: false,
                    x: 0,
                  });
                }, HOVER_BAR_HIDE_TIME);
              }}
              x={hoverBar.x}
            />
          </motion.g>
        )}
      </AnimatePresence>
      {stepMode ? (
        <Step
          steps={steps}
          marks={groupedMarks}
          onMouseEnter={(e, mark) => {
            if (hideHoverBar.current) clearTimeout(hideHoverBar.current);
            onMarkMouseEnter(
              e,
              findMarksInCluster(mark, groupedMarks, mark.height)
            );
            setHoverBar({ x: mark.middle + mark.width / 2, visible: true });
          }}
          onMouseMove={(e, mark) => {
            if (hideHoverBar.current) clearTimeout(hideHoverBar.current);
            onMarkMouseEnter(
              e,
              findMarksInCluster(mark, groupedMarks, mark.height)
            );
            setHoverBar({ x: mark.middle + mark.width / 2, visible: true });
          }}
          onMouseLeave={e => {
            onMarkMouseLeave(e);
            hideHoverBar.current = setTimeout(() => {
              setHoverBar({
                visible: false,
                x: 0,
              });
            }, HOVER_BAR_HIDE_TIME);
          }}
        />
      ) : (
        <Marks
          marks={marks}
          onMouseEnter={(e, mark) => {
            if (hideHoverBar.current) clearTimeout(hideHoverBar.current);
            onMarkMouseEnter(
              e,
              findMarksInCluster(mark, groupedMarks).map(
                ({ selector, color }) => ({
                  selector,
                  color,
                })
              )
            );
            setHoverBar({ x: mark.x, visible: true });
          }}
          onMouseLeave={e => {
            onMarkMouseLeave(e);
            hideHoverBar.current = setTimeout(() => {
              setHoverBar({
                visible: false,
                x: 0,
              });
            }, HOVER_BAR_HIDE_TIME);
          }}
        />
      )}
    </>
  );
};

export default Lines;
