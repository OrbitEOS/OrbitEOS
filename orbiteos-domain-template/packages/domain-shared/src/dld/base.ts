import type { Sensor, Actuator, DLDState, DLDActionResult } from '../types.js';

/**
 * Abstract base class for Domain Logical Devices (DLDs).
 *
 * Each domain defines DLD subclasses that abstract over physical hardware.
 * A DLD exposes sensors (read-only), actuators (writable), and named actions.
 *
 * Example:
 *   class BatteryDLD extends BaseDLD<BatteryState> {
 *     readonly dldType = 'BatteryDLD';
 *     readonly dldClass = 'battery';
 *     sensors() { return [{ key: 'soc_pct', ... }]; }
 *     ...
 *   }
 */
export abstract class BaseDLD<TState extends DLDState = DLDState> {
  /** Unique DLD type identifier (e.g. "BatteryDLD", "SolarInverterDLD") */
  abstract readonly dldType: string;

  /** Broad classification (e.g. "battery", "inverter", "sensor") */
  abstract readonly dldClass: string;

  protected currentState: TState = {} as TState;

  /** Return sensor definitions for this DLD type */
  abstract sensors(): Sensor[];

  /** Return actuator definitions for this DLD type */
  abstract actuators(): Actuator[];

  /** Refresh state from physical device(s) and return updated state */
  abstract refresh(): Promise<TState>;

  /** Validate and execute an action */
  abstract executeAction(
    action: string,
    params: Record<string, unknown>,
  ): Promise<DLDActionResult>;

  /** Return a summary of current state for display */
  abstract summary(): Record<string, unknown>;

  /** Get current cached state */
  getState(): TState {
    return { ...this.currentState };
  }

  /** Get a single sensor value */
  getSensorValue(key: string): unknown {
    return this.currentState[key] ?? null;
  }

  /** Set an actuator value (override in subclass for validation) */
  async setActuatorValue(
    key: string,
    value: unknown,
  ): Promise<DLDActionResult> {
    const actuator = this.actuators().find((a) => a.key === key);
    if (!actuator) {
      return { success: false, message: `Unknown actuator: ${key}` };
    }
    return this.executeAction(`set_${key}`, { value });
  }

  /** Validate that an action is in the valid_actions list */
  protected isValidAction(action: string): boolean {
    return this.getValidActions().includes(action);
  }

  /** Get list of valid action names */
  getValidActions(): string[] {
    const sensorActions = this.sensors().map((s) => `read_${s.key}`);
    const actuatorActions = this.actuators().map((a) => `set_${a.key}`);
    return [...sensorActions, ...actuatorActions];
  }
}
