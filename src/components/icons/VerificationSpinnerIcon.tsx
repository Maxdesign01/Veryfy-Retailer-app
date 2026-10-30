import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface VerificationSpinnerIconProps {
  size?: number;
  trackColor?: string;
  indicatorColor?: string;
}

export const VerificationSpinnerIcon: React.FC<VerificationSpinnerIconProps> = ({
  size = 20,
  trackColor = '#BFC7FD',
  indicatorColor = '#3D52D5',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10Z"
        fill={trackColor}
      />
      <Path
        d="M10 0C11.9778 -8.6453e-08 13.9112 0.58649 15.5557 1.6853C17.2002 2.78412 18.4819 4.3459 19.2388 6.17317C19.9957 8.00043 20.1937 10.0111 19.8079 11.9509C19.422 13.8907 18.4696 15.6725 17.0711 17.0711L15.3033 15.3033C16.3522 14.2544 17.0665 12.918 17.3559 11.4632C17.6453 10.0083 17.4968 8.50032 16.9291 7.12987C16.3614 5.75943 15.4001 4.58809 14.1668 3.76398C12.9334 2.93987 11.4834 2.5 10 2.5V0Z"
        fill={indicatorColor}
      />
    </Svg>
  );
};
