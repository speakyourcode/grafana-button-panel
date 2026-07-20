import { PanelProps } from '@grafana/data';
import { getAppEvents, getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { of, throwError } from 'rxjs';
import { ButtonPanel } from './buttonPanel';
import { Options } from './types';

jest.mock('@grafana/runtime', () => ({
  getAppEvents: jest.fn(),
  getBackendSrv: jest.fn(),
  getDataSourceSrv: jest.fn(),
}));

const buildProps = (options: Partial<Options>): PanelProps<Options> =>
  ({
    options: { buttons: [], orientation: 'horizontal', ...options },
    replaceVariables: (s: string) => s,
  }) as unknown as PanelProps<Options>;

describe('button panel', () => {
  const publish = jest.fn();
  const fetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getAppEvents as jest.Mock).mockReturnValue({ publish });
    (getBackendSrv as jest.Mock).mockReturnValue({ fetch });
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    (getDataSourceSrv as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ uid: 'test-uid' }),
    });
  });

  test('renders no buttons for empty options', () => {
    render(<ButtonPanel {...buildProps({})} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('renders configured buttons and falls back to default text', () => {
    render(
      <ButtonPanel
        {...buildProps({
          buttons: [{ text: 'Start', variant: 'primary' }, {}],
        })}
      />
    );
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
  });

  test('posts the query and publishes a success alert on click', async () => {
    fetch.mockReturnValue(of({ status: 200, statusText: 'OK' }));
    render(
      <ButtonPanel
        {...buildProps({
          buttons: [{ text: 'Run', datasource: 'ds', query: '{ "scenarioId": "random_walk" }' }],
        })}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Run' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'api/ds/query',
          data: {
            queries: [{ datasource: { uid: 'test-uid' }, refId: '1', scenarioId: 'random_walk' }],
          },
        })
      );
    });
    await waitFor(() => {
      expect(publish).toHaveBeenCalledWith(expect.objectContaining({ payload: ['Run: 200 (OK)'] }));
    });
  });

  test('publishes an error alert when the request fails', async () => {
    fetch.mockReturnValue(
      throwError(() => ({ status: 500, statusText: 'Server Error', data: { message: 'boom' } }))
    );
    render(<ButtonPanel {...buildProps({ buttons: [{ text: 'Run', datasource: 'ds' }] })} />);

    await userEvent.click(screen.getByRole('button', { name: 'Run' }));

    await waitFor(() => {
      expect(publish).toHaveBeenCalledWith(
        expect.objectContaining({ payload: ['Run: 500 (Server Error) boom'] })
      );
    });
  });
});
