import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface AlertCircleFilledIconProps {
  size?: number;
  color?: string;
  iconColor?: string;
}

export const AlertCircleFilledIcon: React.FC<AlertCircleFilledIconProps> = ({
  size = 20,
  color = '#DC2626',
  iconColor = '#FFFFFF',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Path
        d="M12 7V13"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="16.5" r="1" fill={iconColor} />
    </Svg>
  );
};
