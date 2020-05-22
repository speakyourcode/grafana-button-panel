import { PanelProps } from '@grafana/data';
import { Button, HorizontalGroup } from '@grafana/ui';
import React from 'react';
import { ButtonOptions, Options } from 'types';

interface Props extends PanelProps<Options> {}

export const ButtonPanel: React.FC<Props> = ({ options }) => {
  return (
    <HorizontalGroup justify="center">
      {options.buttons.map((b: ButtonOptions, index: number) => (
        <Button key={index} variant="primary">
          {b.text || 'Button'}
        </Button>
      ))}
    </HorizontalGroup>
  );
};
