# Grafana Button Control Panel

[![CircleCI](https://circleci.com/gh/speakyourcode/grafana-button-panel.svg?style=shield)](https://circleci.com/gh/speakyourcode/grafana-button-panel)
[![David Dependency Status](https://david-dm.org/speakyourcode/grafana-button-panel.svg)](https://david-dm.org/speakyourcode/grafana-button-panel)
[![David Dev Dependency Status](https://david-dm.org/speakyourcode/grafana-button-panel/dev-status.svg)](https://david-dm.org/speakyourcode/grafana-button-panel/?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/speakyourcode/grafana-button-panel/badge.svg)](https://snyk.io/test/github/speakyourcode/grafana-button-panel)
[![Maintainability](https://api.codeclimate.com/v1/badges/3d8db85bc1cc2b95d314/maintainability)](https://codeclimate.com/github/speakyourcode/grafana-button-panel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3d8db85bc1cc2b95d314/test_coverage)](https://codeclimate.com/github/speakyourcode/grafana-button-panel/test_coverage)

This panel allows you to create buttons and define actions for them. It can be
used to add control functionality to your dashboards. Actions are defined as
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
