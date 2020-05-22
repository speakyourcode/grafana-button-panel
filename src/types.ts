import { ButtonVariant } from '@grafana/ui';

export interface ButtonOptions {
  text?: string;
  query?: string;
  datasource?: string;
  variant?: ButtonVariant;
}

export interface Options {
  buttons: ButtonOptions[];
  orientation: string;
}
