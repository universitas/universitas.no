const Svg = ({ children }) => (
  <svg
    fill="currentColor"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
)

export const SideBySide = () => (
  <Svg>
    <path d="m0 12h50v75h-50z" />
    <path
      d="m60 79h40v8.3h-40zm0-17h40v8.3h-40zm0-17h40v8.3h-40zm0-17h40v8.3h-40zm0-17h40v8.3h-40z"
      opacity="0.5"
    />
  </Svg>
)

export const ImageAboveText = () => (
  <Svg>
    <path d="m0 12h100v42h-100z" />
    <path d="m0 79h83v8.3h-83zm-1.5e-5-17h100v8.3h-100z" opacity="0.5" />
  </Svg>
)

export const TextOnImage = () => (
  <Svg>
    <path d="m0 12.5v75h100v-75h-100zm8.8 43h83v8.3h-83v-8.3zm0 17h75v8.3h-75v-8.3z" />
    <path d="m8.8 72.5v8.3h75v-8.3zm0-17v8.3h83v-8.3z" opacity=".5" />
  </Svg>
)

export const BoldWeight = () => (
  <Svg>
    <path d="m40.9 10-33.4 80h22.3l5.57-13h29.3l5.57 13h22.3l-33.4-80zm9.41 31 5.87 14h-12.1z" />
  </Svg>
)

export const NormalWeight = () => (
  <Svg>
    <path d="m44.1 10-34.1 80h13l8.42-20h37.1l8.42 20h13l-34.1-80zm5.41 17 14 31h-27.1z" />
  </Svg>
)

export const ThinWeight = () => (
  <Svg>
    <path d="m47.1 10-34.6 80h6.33l8.91-20h44.5l8.91 20h6.33l-34.6-80zm2.67 8.3 19.8 46h-39.6z" />
  </Svg>
)

export const LargeText = () => (
  <Svg>
    <path d="m43.6 0-43.6 100h13.9l10.9-24h50.5l10.9 24h13.9l-43.6-100zm5.84 18 19.8 45h-38.6z" />
  </Svg>
)

export const MediumText = () => (
  <Svg>
    <path d="m44.1 10-34.1 80h13l8.42-20h37.1l8.42 20h13l-34.1-80zm5.41 17 14 31h-27.1z" />
  </Svg>
)

export const SmallText = () => (
  <Svg>
    <path d="m44.8 20-24.8 60h11.9l5.74-14h24.8l5.74 14h11.9l-24.8-60zm4.85 16 7.92 19h-15.8z" />
  </Svg>
)
