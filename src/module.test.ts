import { standardEditorsRegistry } from '@grafana/data';
import { plugin } from './module';

describe('button plugin', () => {
  test('editor options', () => {
    standardEditorsRegistry.setInit(() => {
      return [{ id: 'radio' }] as any;
    });
    expect(plugin.optionEditors).toBeDefined();
    expect(plugin.optionEditors?.list()).toHaveLength(2);
  });
});
