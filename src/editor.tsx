import { PanelOptionsEditorBuilder, SelectableValue } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Select } from '@grafana/ui';
import React from 'react';
import { SimpleOptions } from 'types';

const MyEditor: React.FC = () => {
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
  return <Select onChange={() => {}} options={elems} />;
};

export function addEditor(builder: PanelOptionsEditorBuilder<SimpleOptions>) {
  builder.addCustomEditor({
    id: 'datasource',
    path: 'datasource',
    name: 'Datasource',
    description: 'Select Datasource for input query',
    editor: () => <MyEditor />,
  });
}
