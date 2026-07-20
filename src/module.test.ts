import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

describe('button plugin', () => {
  test('is a panel plugin with options', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
    expect(plugin.panel).toBeDefined();
  });
});
