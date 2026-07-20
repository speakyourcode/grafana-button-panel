# Changelog

## 0.4.0

- Modernize the toolchain to `@grafana/create-plugin` 7.9 (webpack 5, ESLint 9 flat config, TypeScript 5.9, npm)
- Compile against Grafana 13.1 packages; minimum supported Grafana is now 11.0
- Replace the removed `getBackendSrv().datasourceRequest()` with `getBackendSrv().fetch()`; queries now reference datasources by `uid` instead of the deprecated `datasourceId`
- Replace the deprecated `HorizontalGroup`/`VerticalGroup` layout components with `Stack`
- Use the built-in `DataSourcePicker` in the panel editor instead of a manual datasource list fetched from the admin-only `/api/datasources` endpoint
- Replace the removed `link` button variant with `success`
- Rewrite unit tests with Testing Library; replace Cypress e2e with Playwright (`@grafana/plugin-e2e`)

## 0.3.0

- Update to Grafana 9
