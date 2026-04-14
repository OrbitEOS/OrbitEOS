import { BaseDLD } from './base.js';
import type { Sensor, Actuator, DLDActionResult } from '../types.js';

interface ExampleSensorState {
  temperature_c: number;
  humidity_pct: number;
  is_healthy: boolean;
  report_interval_s: number;
}

/**
 * Example DLD implementation for a temperature/humidity sensor.
 * Replace this with your actual device logic.
 */
export class ExampleSensorDLD extends BaseDLD<ExampleSensorState> {
  readonly dldType = 'ExampleSensorDLD';
  readonly dldClass = 'sensor';

  constructor() {
    super();
    this.currentState = {
      temperature_c: 0,
      humidity_pct: 0,
      is_healthy: true,
      report_interval_s: 60,
    };
  }

  sensors(): Sensor[] {
    return [
      {
        key: 'temperature_c',
        name: 'Temperature',
        type: 'number',
        units: 'C',
        min: -40,
        max: 85,
        decimals: 1,
      },
      {
        key: 'humidity_pct',
        name: 'Humidity',
        type: 'number',
        units: '%',
        min: 0,
        max: 100,
        decimals: 0,
      },
    ];
  }

  actuators(): Actuator[] {
    return [
      {
        key: 'set_interval',
        name: 'Set Report Interval',
        type: 'number',
        units: 's',
        min: 1,
        max: 3600,
      },
    ];
  }

  async refresh(): Promise<ExampleSensorState> {
    // In a real driver, this would read from the physical device
    // via modbus, mqtt, http, etc.
    this.currentState = {
      temperature_c: 22.5 + (Math.random() - 0.5) * 2,
      humidity_pct: Math.round(55 + (Math.random() - 0.5) * 10),
      is_healthy: true,
      report_interval_s: this.currentState.report_interval_s,
    };
    return this.getState();
  }

  async executeAction(
    action: string,
    params: Record<string, unknown>,
  ): Promise<DLDActionResult> {
    switch (action) {
      case 'calibrate':
        // Simulate calibration
        return { success: true, message: 'Sensor calibrated' };

      case 'reset':
        this.currentState = {
          temperature_c: 0,
          humidity_pct: 0,
          is_healthy: true,
          report_interval_s: 60,
        };
        return { success: true, message: 'Reset to factory defaults' };

      case 'set_set_interval': {
        const interval = Number(params.value);
        if (isNaN(interval) || interval < 1 || interval > 3600) {
          return {
            success: false,
            message: 'Interval must be between 1 and 3600 seconds',
          };
        }
        this.currentState.report_interval_s = interval;
        return {
          success: true,
          message: `Report interval set to ${interval}s`,
        };
      }

      default:
        return { success: false, message: `Unknown action: ${action}` };
    }
  }

  summary(): Record<string, unknown> {
    return {
      temperature: `${this.currentState.temperature_c.toFixed(1)} C`,
      humidity: `${this.currentState.humidity_pct}%`,
      healthy: this.currentState.is_healthy,
      interval: `${this.currentState.report_interval_s}s`,
    };
  }
}
