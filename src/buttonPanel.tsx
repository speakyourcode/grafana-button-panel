import { AppEvents, PanelProps } from '@grafana/data';
import { getBackendSrv, getDataSourceSrv, SystemJS } from '@grafana/runtime';
import { Button, HorizontalGroup, VerticalGroup } from '@grafana/ui';
import React from 'react';
import { ButtonOptions, Options } from 'types';

interface Props extends PanelProps<Options> {}

export const ButtonPanel: React.FC<Props> = ({ options }) => {
  const renderButtons = (buttons: ButtonOptions[]) => {
    return buttons.map((b: ButtonOptions, index: number) => (
      <Button
        key={index}
        variant={b.variant}
        onClick={async () => {
          const payload = JSON.parse(b.query || '');
          const ds = await getDataSourceSrv().get(b.datasource);
          try {
            const resp = await getBackendSrv().datasourceRequest({
              method: 'POST',
              url: 'api/tsdb/query',
              data: {
                queries: [
                  {
                    datasourceId: ds.id,
                    refId: '1',
                    ...payload,
                  },
                ],
              },
            });
            SystemJS.load('app/core/app_events').then((appEvents: any) => {
              appEvents.emit(AppEvents.alertSuccess, [
                b.text + ': ' + resp.status + ' (' + resp.statusText + ')',
              ]);
            });
          } catch (error) {
            SystemJS.load('app/core/app_events').then((appEvents: any) => {
              appEvents.emit(AppEvents.alertError, [
                b.text + ': ' + error.status + ' (' + error.statusText + ')',
                error.data.message,
              ]);
            });
          }
        }}
      >
        {b.text || 'Button'}
      </Button>
    ));
  };

  return (
    (options.orientation === 'vertical' && (
      <VerticalGroup justify="center" align="center">
        {renderButtons(options.buttons)}
      </VerticalGroup>
    )) || (
      <HorizontalGroup justify="center" align="center">
        {renderButtons(options.buttons)}
      </HorizontalGroup>
    )
  );
};
