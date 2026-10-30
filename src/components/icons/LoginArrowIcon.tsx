import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LoginArrowIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const LoginArrowIcon: React.FC<LoginArrowIconProps> = ({
  width = 12,
  height = 12,
  color = '#FFFFFF',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
      <Path
        d="M9.13125 6.75H0V5.25H9.13125L4.93125 1.05L6 0L12 6L6 12L4.93125 10.95L9.13125 6.75V6.75"
        fill={color}
      />
    </Svg>
  );
};
