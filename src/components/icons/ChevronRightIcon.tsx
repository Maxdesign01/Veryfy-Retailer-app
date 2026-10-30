import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChevronRightIconProps {
  width?: number;
  height?: number;
  size?: number;
  color?: string;
}

export const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  width,
  height,
  size,
  color = '#1A1B22',
}) => {
  const finalWidth = size ?? width ?? 5;
  const finalHeight = size ?? height ?? 7;
  return (
    <Svg width={finalWidth} height={finalHeight} viewBox="0 0 5 7" fill="none">
      <Path
        d="M2.68333 3.5L0 0.816667L0.816667 0L4.31667 3.5L0.816667 7L0 6.18333L2.68333 3.5V3.5"
        fill={color}
      />
    </Svg>
  );
};
