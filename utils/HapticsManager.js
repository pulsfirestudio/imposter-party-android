import { Vibration } from 'react-native';

export function lightHaptic() { Vibration.vibrate(40); }
export function mediumHaptic() { Vibration.vibrate(80); }
export function heavyHaptic() { Vibration.vibrate([0, 100, 60, 100]); }
export function errorHaptic() { Vibration.vibrate([0, 200, 100, 200, 100, 400]); }