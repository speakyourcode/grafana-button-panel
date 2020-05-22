import { PanelPlugin } from '@grafana/data';
import { ButtonPanel } from './buttonPanel';
import { addEditor } from './editor';
import { Options } from './types';

export const plugin = new PanelPlugin<Options>(ButtonPanel);

plugin.setPanelOptions(builder => addEditor(builder));
