import type { BaseDLD } from '@my-domain/shared';

/**
 * In-memory registry of active DLD instances.
 * In production, a driver would register its DLD instances here.
 */
class DLDManager {
  private instances = new Map<string, BaseDLD>();

  register(id: string, dld: BaseDLD): void {
    this.instances.set(id, dld);
    console.log(`Registered DLD: ${id} (${dld.dldType})`);
  }

  unregister(id: string): void {
    this.instances.delete(id);
  }

  get(id: string): BaseDLD | undefined {
    return this.instances.get(id);
  }

  listAll(): Array<{ id: string; dld_type: string; dld_class: string; summary: Record<string, unknown> }> {
    const result: Array<{ id: string; dld_type: string; dld_class: string; summary: Record<string, unknown> }> = [];
    for (const [id, dld] of this.instances) {
      result.push({
        id,
        dld_type: dld.dldType,
        dld_class: dld.dldClass,
        summary: dld.summary(),
      });
    }
    return result;
  }

  /** Refresh all DLDs and return updated states */
  async refreshAll(): Promise<Map<string, Record<string, unknown>>> {
    const states = new Map<string, Record<string, unknown>>();
    for (const [id, dld] of this.instances) {
      try {
        const state = await dld.refresh();
        states.set(id, state);
      } catch (err) {
        console.error(`Failed to refresh DLD ${id}:`, err);
      }
    }
    return states;
  }
}

export const dldManager = new DLDManager();
