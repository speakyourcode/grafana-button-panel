import {
  AppEvents,
  DefaultTimeRange,
  DefaultTimeZone,
  LoadingState,
  PanelProps,
} from '@grafana/data';
import { getBackendSrv, getDataSourceSrv, SystemJS } from '@grafana/runtime';
import { Button, HorizontalGroup, VerticalGroup } from '@grafana/ui';
import { shallow } from 'enzyme';
import React from 'react';
import { ButtonOptions, Options } from 'types';
import { ButtonPanel } from './buttonPanel';
jest.mock('@grafana/runtime');

describe('button panel', () => {
  const status = 200;
  const statusError = 500;
  const statusText = 'OKI';
  let defaultProps: PanelProps<Options>;

  beforeEach(() => {
    defaultProps = {
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
      replaceVariables: () => '{}',
      timeRange: DefaultTimeRange,
      timeZone: DefaultTimeZone,
      options: {
        buttons: [],
        orientation: 'horizontal',
      } as Options,
    };
  });

  test('orientation', () => {
    let wrapper = shallow(<ButtonPanel {...defaultProps} />);
    expect(wrapper.find(HorizontalGroup)).toHaveLength(1);
    expect(wrapper.find(VerticalGroup)).toHaveLength(0);
    wrapper.setProps({ options: { buttons: [], orientation: 'vertical' } });
    expect(wrapper.find(HorizontalGroup)).toHaveLength(0);
    expect(wrapper.find(VerticalGroup)).toHaveLength(1);
  });

  test('buttons', () => {
    const wrapper = shallow(<ButtonPanel {...defaultProps} />);
    expect(wrapper.find(Button)).toHaveLength(0);

    const buttons: ButtonOptions[] = [
      { text: 'a', variant: 'destructive', datasource: 'a' },
      { text: 'b', variant: 'primary', datasource: 'b' },
    ];
    wrapper.setProps({ options: { buttons: buttons } });
    const mockGet = jest.fn().mockReturnValue({ id: 1 });
    (getDataSourceSrv as jest.Mock<any>).mockImplementation(() => ({
      get: mockGet,
    }));
    const mockDataSourceRequest = jest.fn().mockReturnValue({
      status: status,
      statusText: statusText,
    });
    (getBackendSrv as jest.Mock<any>).mockImplementation(() => ({
      datasourceRequest: mockDataSourceRequest,
    }));
    const mockEmit = jest.fn();
    SystemJS.load.mockImplementation(async () => ({
      emit: mockEmit,
    }));

    const buttonWidgets = wrapper.find(Button);
    expect(buttonWidgets).toHaveLength(buttons.length);
    buttonWidgets.forEach((b: any, i: number) => {
      expect(b.key()).toBe(i.toString());
      expect(b.prop('variant')).toBe(buttons[i].variant);
      expect(b.text()).toBe(buttons[i].text);
      b.simulate('click');
      setImmediate(() => {
        expect(mockGet).toHaveBeenCalledWith(buttons[i].datasource);
        expect(mockDataSourceRequest).toHaveBeenCalled();
        expect(mockEmit).toHaveBeenCalledWith(AppEvents.alertSuccess, [
          buttons[i].text + ': ' + status + ' (' + statusText + ')',
        ]);
      });
    });
  });

  test('button error', () => {
    const wrapper = shallow(<ButtonPanel {...defaultProps} />);
    const buttons: ButtonOptions[] = [
      { variant: 'destructive', datasource: 'a' },
    ];
    wrapper.setProps({ options: { buttons: buttons } });

    const mockGet = jest.fn().mockReturnValue({ id: 1 });
    (getDataSourceSrv as jest.Mock<any>).mockImplementation(() => ({
      get: mockGet,
    }));
    const msg = 'msg';
    const mockDataSourceRequest = jest.fn().mockRejectedValue({
      status: statusError,
      statusText: statusText,
      data: { message: msg },
    });
    (getBackendSrv as jest.Mock<any>).mockImplementation(() => ({
      datasourceRequest: mockDataSourceRequest,
    }));
    const mockEmit = jest.fn();
    SystemJS.load.mockImplementation(async () => ({
      emit: mockEmit,
    }));

    const widget = wrapper.find(Button);
    expect(widget.text()).toBe('Button');
    widget.simulate('click');
    setImmediate(() => {
      expect(mockEmit).toHaveBeenCalledWith(AppEvents.alertError, [
        widget.text() + ': ' + statusError + ' (' + statusText + ')',
        msg,
      ]);
    });
  });
});
