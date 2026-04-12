import { useWindowDimensions } from 'react-native';

// Formato solicitado (equivalente a media queries CSS):
// Mobile: @media (max-width: 575.98px)
// Tablet: @media (min-width: 768px) and (max-width: 991.98px)
// Desktop: @media (min-width: 992px) and (max-width: 1199.98px)
// Extra Large: @media (min-width: 1200px)
export const breakpoints = {
  desktopMax: 1199.98,
  desktopMin: 992,
  mobileMax: 575.98,
  tabletMax: 991.98,
  tabletMin: 768,
  xlMin: 1200,
} as const;

export type DeviceClass = 'desktop' | 'mobile' | 'tablet' | 'xl';

export function getDeviceClass(width: number): DeviceClass {
  if (width <= breakpoints.mobileMax) {
    return 'mobile';
  }
  if (width >= breakpoints.tabletMin && width <= breakpoints.tabletMax) {
    return 'tablet';
  }
  if (width >= breakpoints.desktopMin && width <= breakpoints.desktopMax) {
    return 'desktop';
  }
  if (width >= breakpoints.xlMin) {
    return 'xl';
  }

  // Rango 576-767: se trata como movil ancho para evitar layouts rotos.
  return 'mobile';
}

export function useDeviceClass() {
  const { width } = useWindowDimensions();
  return getDeviceClass(width);
}

