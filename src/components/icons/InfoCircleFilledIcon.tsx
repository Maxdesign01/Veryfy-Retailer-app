import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface InfoCircleFilledIconProps {
  size?: number;
  color?: string;
  iconColor?: string;
}

export const InfoCircleFilledIcon: React.FC<InfoCircleFilledIconProps> = ({
  size = 20,
  color = '#2563EB',
  iconColor = '#FFFFFF',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Circle cx="12" cy="8" r="1.1" fill={iconColor} />
      <Path
        d="M12 11.5V16.5M10.8 11.5H12"
        stroke={iconColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
