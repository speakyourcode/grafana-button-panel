import { PanelOptionsEditorBuilder, SelectableValue } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Button, Field, Input, Select } from '@grafana/ui';
import React from 'react';
import { ButtonOptions, Options } from 'types';

interface EditorProps {
  buttons: ButtonOptions[];
  onChange: (buttons: ButtonOptions[]) => void;
}

const Editor: React.FC<EditorProps> = ({ buttons, onChange }) => {
  const [elems, setElems] = React.useState<SelectableValue<string>[]>();
  React.useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const ds = await getBackendSrv().get('/api/datasources');
      if (isSubscribed)
        setElems(
          ds.map((i: any) => ({
            label: i.name,
            value: i.name,
            name: i.name,
          }))
        );
    };
    fetchData();
    return (): void => {
      isSubscribed = false;
    };
  }, []);
  return (
    <React.Fragment>
      {buttons.map((b: ButtonOptions, index: number) => (
        <div>
          <Field label="Text" description="Text to be displayed on button">
            <Input
              id={'t-' + index.toString()}
              value={b.text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let button = { ...buttons[index] };
                onChange([
                  ...buttons.slice(0, index),
                  { text: e.target.value, datasource: button.datasource, query: button.query },
                  ...buttons.slice(index + 1),
                ]);
              }}
            />
          </Field>
          <Field label="Datasource" description="Select Datasource for the query">
            <Select
              onChange={(e: SelectableValue<string>) => {
                let button = { ...buttons[index] };
                onChange([
                  ...buttons.slice(0, index),
                  { text: button.text, datasource: e.value || '', query: button.query },
                  ...buttons.slice(index + 1),
                ]);
              }}
              options={elems}
            />
          </Field>
          <Field label="Query" description="Query to be triggered on Button Click">
            <Input
              id={'q-' + index.toString()}
              value={b.query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let button = { ...buttons[index] };
                onChange([
                  ...buttons.slice(0, index),
                  { text: button.text, datasource: button.datasource, query: e.target.value },
                  ...buttons.slice(index + 1),
                ]);
              }}
            />
          </Field>
          <Button variant="secondary" icon="plus" size="sm">
            Add Button
          </Button>
        </div>
      ))}
    </React.Fragment>
  );
};

export function addEditor(builder: PanelOptionsEditorBuilder<Options>) {
  builder.addCustomEditor({
    id: 'buttons',
    path: 'buttons',
    name: 'Buttons',
    defaultValue: [{ text: 'click', datasource: '', query: '' }],
    editor: props => <Editor buttons={props.value} onChange={props.onChange} />,
  });
}
