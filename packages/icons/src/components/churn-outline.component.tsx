import React from 'react';

import { IconProps } from '../types';

const ChurnOutline = ({ width, height, opacity, fill }: IconProps) => (
  <svg width={width} height={height} opacity={opacity} viewBox="0 0 100 100">
    <g fill={fill} fillRule="nonzero">
      <path d="M4.85 37.23l21.352 21.176 10.374-9.229 2.057.059 24.343 24.279 10.12-8.822 2.065.089 20.78 21.49-2.157 2.085-19.79-20.467-10.102 8.807-2.045-.07-24.333-24.27-10.37 9.227-2.053-.056L2.737 39.361l2.112-2.13zm59.941-7.063c4.304.816 8.04 4.126 11.209 9.932L70.256 54H57.392L54 36.661c2.89-5.144 6.487-7.31 10.791-6.494zm-8.519 6.581l-.165.269L59.038 52h9.88l4.862-11.767-.231-.392c-2.654-4.425-5.61-6.929-8.844-7.65l-.286-.059c-3.13-.593-5.777.827-8.147 4.616zM64 14a7 7 0 110 14 7 7 0 010-14zm0 2a5 5 0 100 10 5 5 0 000-10z" />
      <path d="M94.557 73.857l1.792 13.257-1.756 1.676-13.428-2.457.54-2.951 11.394 2.084-1.515-11.207z" />
    </g>
  </svg>
);

export default ChurnOutline;
