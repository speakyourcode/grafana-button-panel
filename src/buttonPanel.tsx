import { css } from '@emotion/css';
import { AppEvents, InterpolateFunction, PanelProps } from '@grafana/data';
import { getAppEvents, getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { Button, Stack } from '@grafana/ui';
import React from 'react';
import { lastValueFrom } from 'rxjs';
import { ButtonOptions, Options } from 'types';

interface Props extends PanelProps<Options> {}

const containerStyle = css({
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

async function postQuery(button: ButtonOptions, text: string, replaceVariables: InterpolateFunction) {
  const payload = JSON.parse(replaceVariables(button.query || '{}'));
  // The suggested replacement (@grafana/runtime/unstable getDataSourceInstance) does not exist on Grafana <13 hosts
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const ds = await getDataSourceSrv().get(button.datasource);
  const appEvents = getAppEvents();
  try {
    const resp = await lastValueFrom(
      getBackendSrv().fetch({
        method: 'POST',
        url: 'api/ds/query',
        data: {
          queries: [
            {
              datasource: { uid: ds.uid },
              refId: '1',
              ...payload,
            },
          ],
        },
      })
    );
    appEvents.publish({
      type: AppEvents.alertSuccess.name,
      payload: [text + ': ' + resp.status + ' (' + resp.statusText + ')'],
    });
  } catch (error: any) {
    appEvents.publish({
      type: AppEvents.alertError.name,
      payload: [text + ': ' + error?.status + ' (' + error?.statusText + ') ' + (error?.data?.message ?? '')],
    });
  }
}

export const ButtonPanel: React.FC<Props> = ({ options, replaceVariables }) => {
  return (
    <div className={containerStyle}>
      <Stack
        direction={options.orientation === 'vertical' ? 'column' : 'row'}
        justifyContent="center"
        alignItems="center"
        wrap="wrap"
      >
        {options.buttons.map((b: ButtonOptions, index: number) => {
          const text = b.text || 'Button';
          return (
            <Button key={index} variant={b.variant} onClick={async () => postQuery(b, text, replaceVariables)}>
              {text}
            </Button>
          );
        })}
      </Stack>
    </div>
  );
};
