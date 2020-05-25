import { getBackendSrv } from '@grafana/runtime';
import { Button, Collapse, Field } from '@grafana/ui';
import { mount, ReactWrapper, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Editor, EditorProps } from './editor';
jest.mock('@grafana/runtime');

describe('editor', () => {
  test('add button', () => {
    const mockOnChange = jest.fn();
    const props: EditorProps = {
      buttons: [],
      onChange: mockOnChange,
    };
    const wrapper = shallow(<Editor {...props} />);
    expect(wrapper.find(Collapse)).toHaveLength(0);
    const field = wrapper.find(Field);
    expect(field).toHaveLength(1);
    expect(field.children).toHaveLength(1);
    const button = field.find(Button);
    expect(button).toHaveLength(1);
    expect(button.prop('variant')).toBe('secondary');
    expect(button.text()).toBe('Add Button');
    expect(button.prop('icon')).toBe('plus');
    expect(button.prop('size')).toBe('sm');
    button.simulate('click');
    expect(mockOnChange).toHaveBeenCalledWith([
      { text: '', datasource: '', query: '' },
    ]);
  });

  test('button collapse', () => {
    const mockOnChange = jest.fn();
    const props: EditorProps = {
      buttons: [{ text: 'a' }, { text: 'b' }],
      onChange: mockOnChange,
    };

    const mockGet = jest.fn().mockReturnValue([{ name: 'a' }]);
    (getBackendSrv as jest.Mock<any>).mockImplementation(() => ({
      get: mockGet,
    }));

    const wrapper = shallow(<Editor {...props} />);
    expect(wrapper.children()).toHaveLength(3);
    const collapse = wrapper.find(Collapse);
    expect(collapse).toHaveLength(2);

    collapse.forEach((c, i) => {
      expect(c.key()).toBe(i.toString());
      expect(c.prop('label')).toBe('Button ' + (i + 1).toString());
      expect(c.prop('collapsible')).toBeTruthy();
      expect(c.prop('isOpen')).toBeFalsy();
    });

    collapse.first().simulate('toggle');
    wrapper.update();
    const open = wrapper.find(Collapse).first();
    expect(open.prop('isOpen')).toBeTruthy();
  });

  test('button mount', async () => {
    const mockOnChange = jest.fn();
    const props: EditorProps = {
      buttons: [{ text: 'a' }],
      onChange: mockOnChange,
    };

    let wrapper: any = {};
    await act(async () => {
      wrapper = mount(<Editor {...props} />);
    });
    let collapse: ReactWrapper = wrapper.find(Collapse);
    expect(collapse).toHaveLength(1);
    wrapper.unmount();
  });
});
