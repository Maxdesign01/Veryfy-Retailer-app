import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

interface VeryfyLogoMarkProps {
  width?: number;
  height?: number;
  color?: string;
}

export const VeryfyLogoMark: React.FC<VeryfyLogoMarkProps> = ({
  width = 54,
  height = 59,
  color = '#3D52D5',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 54 59" fill="none">
      <Defs>
        <ClipPath id="clip_logomark">
          <Rect width="54" height="59" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip_logomark)">
        {/* Left tick vector */}
        <Path
          d="M20.6729 26.5592L17.8453 34.328L16.71 37.4483L15.0177 42.0982L12.1887 49.8683L7.6688 37.4483L0 16.377H16.9671L20.6729 26.5592Z"
          fill={color}
        />
        {/* Main checkmark diagonal vector */}
        <Path
          d="M53.5465 0L51.8355 4.69696L47.5855 16.3758L39.9167 37.4472L37.9317 42.901L35.9466 37.4472L34.8113 34.3268L41.3448 16.3758L45.5962 4.69696H39.941L35.6896 16.3758L31.9837 26.5581L29.1561 34.3282V34.3297L28.0208 37.4472L26.3285 42.097V42.0984L23.4995 49.8671L22.06 53.823H30.5956L29.1561 49.8671V49.8657L31.9837 42.0984L35.1041 50.67V50.671L33.9559 53.823L32.2764 58.4385V58.44L32.2465 58.52H14.6953L15.0167 57.639V57.6375L16.4048 53.823L17.8443 49.8671L20.6719 42.097L22.3641 37.4472L23.4995 34.3268L26.3271 26.5581L29.1561 18.7892L30.0329 16.3758L34.2843 4.69696L35.9937 0H53.5465Z"
          fill={color}
        />
      </G>
    </Svg>
  );
};
