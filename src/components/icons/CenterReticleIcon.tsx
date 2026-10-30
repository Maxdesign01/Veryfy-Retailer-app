import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CenterReticleIconProps {
  size?: number;
  color?: string;
}

export const CenterReticleIcon: React.FC<CenterReticleIconProps> = ({
  size = 34,
  color = '#FFFFFF',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <Path
        d="M5.66602 11.3334V5.66675H11.3327M22.6661 5.66675H28.3328V11.3334M28.3328 22.6668V28.3335H22.6661M11.3327 28.3335H5.66602V22.6668"
        stroke={color}
        strokeWidth={2.55}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.91748 17H24.0842"
        stroke={color}
        strokeWidth={2.55}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
