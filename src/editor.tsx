import { PanelOptionsEditorBuilder, SelectableValue } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import {
  Button,
  Collapse,
  Field,
  Input,
  RadioButtonGroup,
  Select,
  TextArea,
} from '@grafana/ui';
import React from 'react';
import { ButtonOptions, Options } from 'types';

export interface EditorProps {
  buttons: ButtonOptions[];
  onChange: (buttons: ButtonOptions[]) => void;
}

export const Editor: React.FC<EditorProps> = ({ buttons, onChange }) => {
  const [elems, setElems] = React.useState<Array<SelectableValue<string>>>();
  const [isOpen, setOpen] = React.useState<boolean[]>(buttons.map(e => false));
  React.useEffect(() => {
    let cancel = false;
    const fetchData = async () => {
      const ds = await getBackendSrv().get('/api/datasources');
      if (!cancel) {
        setElems(
          ds.map((i: any) => ({ label: i.name, value: i.name, name: i.name }))
        );
      }
    };
    fetchData();
    return (): void => {
      cancel = true;
    };
  }, []);

  const updateButtons = (index: number, newButton: ButtonOptions) => {
    let currentButton = { ...buttons[index] };
    onChange([
      ...buttons.slice(0, index),
      {
        text: newButton.text || currentButton.text,
        datasource: newButton.datasource || currentButton.datasource,
        query: newButton.query || currentButton.query,
        variant: newButton.variant || currentButton.variant,
      },
      ...buttons.slice(index + 1),
    ]);
  };

  return (
    <React.Fragment>
      {buttons.map((b: ButtonOptions, i: number) => (
        <Collapse
          key={i}
          label={'Button ' + (i + 1).toString()}
          isOpen={isOpen[i]}
          collapsible
          onToggle={() => {
            setOpen([
              ...isOpen.slice(0, i),
              !isOpen[i],
              ...isOpen.slice(i + 1),
            ]);
          }}
        >
          <Field label="Text" description="Text to be displayed on the button">
            <Input
              id={'t-' + i.toString()}
              value={b.text}
              placeholder="Button"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateButtons(i, { text: e.target.value })
              }
            />
          </Field>
          <Field
            label="Datasource"
            description="Choose the Datasource for the query"
          >
            <Select
              onChange={(e: SelectableValue<string>) =>
                updateButtons(i, { datasource: e.value })
              }
              value={b.datasource}
              options={elems}
            />
          </Field>
          <Field
            label="Query"
            description="JSON query to be triggered on Button Click"
          >
            <TextArea
              id={'q-' + i.toString()}
              value={b.query}
              placeholder="{ query: 'your query' }"
              rows={5}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateButtons(i, { query: e.target.value })
              }
            />
          </Field>
          <Field label="Color" description="Color of the button">
            <RadioButtonGroup
              options={[
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Destructive', value: 'destructive' },
                { label: 'Link', value: 'link' },
              ]}
              value={b.variant || 'primary'}
              fullWidth
              onChange={(e: any) => updateButtons(i, { variant: e })}
            ></RadioButtonGroup>
          </Field>
          <Field>
            <Button
              icon="trash-alt"
              variant="destructive"
              onClick={() =>
                onChange([...buttons.slice(0, i), ...buttons.slice(i + 1)])
              }
            >
              Delete
            </Button>
          </Field>
        </Collapse>
      ))}
      <Field>
        <Button
          variant="secondary"
          icon="plus"
          size="sm"
          onClick={() => {
            onChange([...buttons, { text: '', datasource: '', query: '' }]);
          }}
        >
          Add Button
        </Button>
      </Field>
    </React.Fragment>
  );
};

export function addEditor(builder: PanelOptionsEditorBuilder<Options>) {
  builder
    .addRadio({
      path: 'orientation',
      name: 'Orientation',
      description: 'Stacking direction in case of multiple buttons',
      defaultValue: 'horizontal',
      settings: {
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
      },
    })
    .addCustomEditor({
      id: 'buttons',
      path: 'buttons',
      name: 'Button Configuration',
      defaultValue: [{ text: '', datasource: '', query: '' }],
      editor: props => (
        <Editor buttons={props.value} onChange={props.onChange} />
      ),
    });
}
