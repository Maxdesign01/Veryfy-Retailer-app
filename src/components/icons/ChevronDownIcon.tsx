import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChevronDownIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  width = 9,
  height = 6,
  color = '#5D5E66',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 9 6" fill="none">
      <Path
        d="M4.5 5.55L0 1.05L1.05 0L4.5 3.45L7.95 0L9 1.05L4.5 5.55V5.55"
        fill={color}
      />
    </Svg>
  );
};
