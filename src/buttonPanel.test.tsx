import {
  DefaultTimeRange,
  DefaultTimeZone,
  LoadingState,
  PanelProps,
} from '@grafana/data';
import { mount } from 'enzyme';
import React from 'react';
import { Options } from 'types';
import { ButtonPanel } from './buttonPanel';

describe('button panel', () => {
  test('panel', () => {
    let props: PanelProps<Options> = {
      id: 1,
      data: {
        timeRange: DefaultTimeRange,
        state: LoadingState.Done,
        series: [],
      },
      fieldConfig: { defaults: {}, overrides: [] },
      height: 1,
      transparent: false,
      width: 2,
      onChangeTimeRange: () => {},
      onFieldConfigChange: () => {},
      onOptionsChange: () => {},
      renderCounter: 1,
      replaceVariables: () => '',
      timeRange: DefaultTimeRange,
      timeZone: DefaultTimeZone,
      options: {
        buttons: [],
        orientation: 'horizontal',
      } as Options,
    };

    mount(<ButtonPanel {...props} />);
  });
});
