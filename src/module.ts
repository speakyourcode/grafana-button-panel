import { PanelPlugin } from '@grafana/data';
import { addEditor } from './editor';
import { SimplePanel } from './SimplePanel';
import { SimpleOptions } from './types';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel);

plugin.setPanelOptions(builder => addEditor(builder));
