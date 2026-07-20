import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Editor, EditorProps } from './editor';

jest.mock('@grafana/runtime', () => ({
  DataSourcePicker: () => <div data-testid="datasource-picker" />,
}));

describe('editor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('add button', async () => {
    const onChange = jest.fn();
    const props: EditorProps = { buttons: [], onChange };
    render(<Editor {...props} />);

    const addButton = screen.getByRole('button', { name: /Add Button/ });
    await userEvent.click(addButton);
    expect(onChange).toHaveBeenCalledWith([{ text: '', datasource: '', query: '' }]);
  });

  test('renders one collapsible section per button', () => {
    const props: EditorProps = { buttons: [{ text: 'a' }, { text: 'b' }], onChange: jest.fn() };
    render(<Editor {...props} />);

    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
  });

  test('editing text and applying propagates the change', async () => {
    const onChange = jest.fn();
    const props: EditorProps = { buttons: [{ text: 'a' }], onChange };
    render(<Editor {...props} />);

    await userEvent.click(screen.getByText('Button 1'));
    const input = screen.getByPlaceholderText('Button');
    await userEvent.clear(input);
    await userEvent.type(input, 'Restart');
    await userEvent.click(screen.getByRole('button', { name: /Apply/ }));

    expect(onChange).toHaveBeenCalledWith([expect.objectContaining({ text: 'Restart' })]);
  });

  test('delete removes the button', async () => {
    const onChange = jest.fn();
    const props: EditorProps = { buttons: [{ text: 'a' }, { text: 'b' }], onChange };
    render(<Editor {...props} />);

    await userEvent.click(screen.getByText('Button 1'));
    await userEvent.click(screen.getAllByRole('button', { name: /Delete/ })[0]);
    expect(onChange).toHaveBeenCalledWith([{ text: 'b' }]);
  });
});
