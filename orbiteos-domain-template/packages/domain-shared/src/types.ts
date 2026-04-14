export interface Sensor {
  key: string;
  name: string;
  type: 'number' | 'boolean' | 'string' | 'enum';
  units?: string;
  min?: number;
  max?: number;
  decimals?: number;
  description?: string;
}

export interface Actuator {
  key: string;
  name: string;
  type: 'number' | 'boolean' | 'string' | 'enum';
  units?: string;
  min?: number;
  max?: number;
  options?: string[];
  description?: string;
}

export interface DLDState {
  [key: string]: unknown;
}

export interface DLDActionResult {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

export interface DriverConfig {
  protocol: string;
  host?: string;
  port?: number;
  path?: string;
  auth?: Record<string, string>;
  options?: Record<string, unknown>;
}
