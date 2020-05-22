import { PanelProps } from '@grafana/data';
import { Button, HorizontalGroup, VerticalGroup } from '@grafana/ui';
import React from 'react';
import { ButtonOptions, Options } from 'types';

interface Props extends PanelProps<Options> {}

const Buttons: React.FC<Options> = ({ buttons }) => {
  return (
    <React.Fragment>
      {buttons.map((b: ButtonOptions, index: number) => (
        <Button key={index} variant={b.variant}>
          {b.text || 'Button'}
        </Button>
      ))}
    </React.Fragment>
  );
};

export const ButtonPanel: React.FC<Props> = ({ options }) => {
  return (
    (options.orientation === 'vertical' && (
      <VerticalGroup justify="center" align="center">
        <Buttons {...options} />
      </VerticalGroup>
    )) || (
      <HorizontalGroup justify="center" align="center">
        <Buttons {...options} />
      </HorizontalGroup>
    )
  );
};
