# Grafana Button Control Panel

This panel allows you to create buttons and define actions for them. It can be
used to add controlling functionality to your dashboards. Actions are defined as
queries to Datasources.

Multiple buttons are allowed within a single panel, they can be arranged either
horizontally or vertically.

The query field is a JSON object, that depends on each Datasource type. You can
use Grafana's Query Inspector to find out what Grafana sends to each Datasource,
and copy those into the query field.

## Examples

Query field to delete InfluxDB database:

```json
{
  "query": "drop databse 'foo'",
  "rawQuery": true,
  "resultFormat": "time_series"
}
```

`refId`, `datasourceId` are automatically sent, so you don't have to set them.
