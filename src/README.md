# Grafana Button Control Panel

[![CI](https://github.com/speakyourcode/grafana-button-panel/actions/workflows/ci.yml/badge.svg)](https://github.com/speakyourcode/grafana-button-panel/actions/workflows/ci.yml)
[![Grafana Compatibility](https://github.com/speakyourcode/grafana-button-panel/actions/workflows/is-compatible.yml/badge.svg)](https://github.com/speakyourcode/grafana-button-panel/actions/workflows/is-compatible.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/3d8db85bc1cc2b95d314/maintainability)](https://codeclimate.com/github/speakyourcode/grafana-button-panel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3d8db85bc1cc2b95d314/test_coverage)](https://codeclimate.com/github/speakyourcode/grafana-button-panel/test_coverage)

This panel allows you to create buttons and define actions for them. It can be
used to add control functionality to your dashboards. Actions are defined as
queries to Datasources.

<img src="https://raw.githubusercontent.com/speakyourcode/grafana-button-panel/master/img/panel_options.png" alt="drawing" width="300"/>

Multiple buttons are allowed within a single panel, they can be arranged either
horizontally or vertically.

![Horizontal](https://raw.githubusercontent.com/speakyourcode/grafana-button-panel/master/img/horizontal_orientation.png)
![Vertical](https://raw.githubusercontent.com/speakyourcode/grafana-button-panel/master/img/vertical_orientation.png)

The query field is a JSON object, that depends on each Datasource type. You can
use Grafana's Query Inspector to find out what Grafana sends to each Datasource,
and copy those into the query field.

## Examples

Query field to delete InfluxDB database:

```json
{
  "query": "drop database \"foo\"",
  "rawQuery": true,
  "resultFormat": "time_series"
}
```

Same example with PostgreSQL:

```json
{
  "rawSql": "DROP DATABASE foo;",
  "format": "table"
}
```

`refId`, `datasourceId` are automatically sent, so you don't have to set them.
