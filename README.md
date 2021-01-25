# ApexCharts Card by [@RomRider](https://github.com/RomRider) <!-- omit in toc -->

![Header](https://github.com/RomRider/apexcharts-card/raw/master/docs/Header.png)

This is higly customizable graph card for [Home-Assistant](https://www.home-assistant.io)'s Lovelace UI.<br/>

It is based on [ApexCharts.js](https://apexcharts.com) and offers most of the features of the library.

It is also inspired by the great [`mini-graph-card`](https://github.com/kalkih/mini-graph-card) by [@kalkih](https://github.com/kalkih)


However, some things might be broken :grin:

## Table of Content <!-- omit in toc -->

- [Installation](#installation)
  - [HACS (recommended)](#hacs-recommended)
  - [Manual install](#manual-install)
  - [CLI install](#cli-install)
  - [Add resource reference](#add-resource-reference)
- [Using the card](#using-the-card)
  - [Main Options](#main-options)
  - [`series` Options](#series-options)
  - [`show` Options](#show-options)
  - [`header` Options](#header-options)
  - [`group_by` Options](#group_by-options)
  - [`func` Options](#func-options)
  - [Apex Charts Options Example](#apex-charts-options-example)
  - [Layouts](#layouts)
- [Known issues](#known-issues)
- [Roadmap](#roadmap)
- [Examples](#examples)

## Installation

### HACS (recommended)

This card is available in [HACS](https://hacs.xyz/) (Home Assistant Community Store).
<small>_HACS is a third party community store and is not included in Home Assistant out of the box._</small>

### Manual install

1. Download and copy `apexcharts-card.js` from the [latest release](https://github.com/RomRider/apexcharts-card/releases/latest) into your `config/www` directory.

2. Add the resource reference as decribed below.

### CLI install

1. Move into your `config/www` directory.

2. Grab `apexcharts-card.js`:

```
$ wget https://github.com/RomRider/apexcharts-card/releases/download/v1.0.2/apexcharts-card.js
```

3. Add the resource reference as decribed below.

### Add resource reference

If you configure Lovelace via YAML, add a reference to `apexcharts-card.js` inside your `configuration.yaml`:

```yaml
resources:
  - url: /local/apexcharts-card.js?v=1.0.2
    type: module
```

Else, if you prefer the graphical editor, use the menu to add the resource:

1. Make sure, advanced mode is enabled in your user profile (click on your user name to get there)
2. Navigate to Configuration -> Lovelace Dashboards -> Resources Tab. Hit orange (+) icon
3. Enter URL `/local/apexcharts-card.js` and select type "JavaScript Module".
4. Restart Home Assistant.

## Using the card

### Main Options

:warning: Since this card is in its debuts, you should expect breaking changes moving forward. :warning:

The card stricly validates all the options available (but not for the `apex_config` object). If there is an error in your configuration, it will tell you where and display a red error card.


:white_check_mark: **means required**.

| Name | Type | Default | Since | Description |
| ---- | :--: | :-----: | :---: | ----------- |
| :white_check_mark: `type` | string | | v1.0.0 | `custom:apexcharts-card` |
| :white_check_mark: `series` | object | | v1.0.0 | See [series](#series-options) |
| `hours_to_show` | number | `24` | v1.0.0 | The span of the graph in hours (Use `0.25` for 15min for eg.) |
| `show` | object | | v1.0.0 | See [show](#show-options) |
| `cache` | boolean | `true` | v1.0.0 | Use in-browser data caching to reduce the load on Home Assistant's server |
| `stacked` | boolean | `false` | v1.0.0 | Enable if you want the data to be stacked on the graph |
| `layout` | string | | v1.0.0 | See [layouts](#layouts) |
| `header` | string | | v1.0.0 | See [header](#header-options) |
| `apex_config`| object | | v1.0.0 | Apexcharts API 1:1 mapping. You call see all the options [here](https://apexcharts.com/docs/installation/) --> `Options (Reference)` in the Menu. See [Apex Charts](#apex-charts-options-example) |



### `series` Options

| Name | Type | Default | Since | Description |
| ---- | :--: | :-----: | :---: | ----------- |
| :white_check_mark: `entity` | string | | v1.0.0 | The `entity_id` of the sensor to display |
| `name` | string | | v1.0.0 | Override the name of the entity |
| `type` | string | `line` | v1.0.0 | `line`, `area` or `column` are supported for now |
| `curve` | string | `smooth` | v1.0.0 | `smooth` (nice curve),  `straight` (direct line between points) or `stepline` (flat line until next point then straight up or down) |
| `extend_to_end` | boolean | `true` | v1.0.0 | If the last data is older than the end time displayed on the graph, setting to true will extend the value until the end of the timeline. Only works for `line` and `area` types. |
| `unit` | string | | v1.0.0 | Override the unit of the sensor |
| `group_by` | object | | v1.0.0 | See [group_by](#group_by-options) |


### `show` Options

| Name | Type | Default | Since | Description |
| ---- | :--: | :-----: | :---: | ----------- |
| `loading` | boolean | `true` | v1.0.0 | Displays a spinning icon while the data is loading/updating |

### `header` Options

| Name | Type | Default | Since | Description |
| ---- | :--: | :-----: | :---: | ----------- |
| `show` | boolean | `true` | v1.0.0 | Show or hide the header |
| `floating` | boolean | `false` | v1.0.0 | Makes the header float above the graph. Positionning will be supported later |

### `group_by` Options

| Name | Type | Default | Since | Description |
| ---- | :--: | :-----: | :---: | ----------- |
| `func` | string | `raw` | v1.0.0 | See [func](#func-options) |
| `duration` | string | `1h` | v1.0.0 | If `func` is **not** `raw` only. It builds buckets of states over `duration` period of time. Doesn't work for months. Eg of valid values: `2h`, `1d`, `10s`, `25min`, `1h30`, ... |
| `fill` | string | `last` | v1.0.0 | If `func` is **not** `raw` only. If there is any missing value in the states history, `last` will replace it the last non-empty state, `zero` will fill missing values with `0`, `'null'` will fill missing values with `null`

### `func` Options

| Name | Since | Description |
| ---- | :---: | ----------- |
| `raw` | v1.0.0 | Displays all the state history as known by Home Assistant |
| `avg` | v1.0.0 | Will return the average of all the states in each bucket |
| `min` | v1.0.0 | Will return the smallest state of each bucket |
| `max` | v1.0.0 | Will return the biggest state of each bucket |
| `last` | v1.0.0 | Will return the last state of each bucket |
| `first` | v1.0.0 | Will return the first state of each bucket |
| `sum` | v1.0.0 | Will return the sum of all the states in each bucket |
| `median` | v1.0.0 | Will return the median of all the states in each bucket |
| `delta` | v1.0.0 | Will return the delta between the biggest and smallest state in each bucket |

### Apex Charts Options Example

This is how you could change some options from ApexCharts as described on the [`Options (Reference)` menu entry](https://apexcharts.com/docs/installation/).

Some options might now work in the context of this card.

```yaml
type: custom:apexcharts-card
entities:
  - ...
apex_config:
  dataLabels:
    enabled: true
    dropShadow:
      enabled: true
```

### Layouts

For now, only `minimal` is supported: It will remove the grid, the axis and display the legend at the top. But you can use the `apex_config` to do whatever you want.

For code junkies, you'll find the default options I use in [`src/apex-layouts.ts`](src/apex-layouts.ts)

## Known issues

* Sometimes, if `smoothing` is used alongside `area` and there is missing data in the chart, the background will be glitchy. See [apexcharts.js/#2180](https://github.com/apexcharts/apexcharts.js/issues/2180)
* `binary_sensor` is not yet supported.
* Bars will span left and right of the data point. Not so great if you use `func` to aggregate your data. See [apexcharts.js/#1688](https://github.com/apexcharts/apexcharts.js/issues/1688)

## Roadmap

Not ordered by priority:

* [ ] Support more types of charts (pie, radial, polar area at least)
* [ ] Support for `binary_sensors`
* [ ] Support for aggregating data with exact boundaries (ex: aggregating data with `1h` could aggregate from `2:00:00am` to `2:59:59am` then `3:00:00am` to `3:59:59` exactly, etc...)
* [ ] Display the graph from start of day, week, month, ... with support for "up to now" or until the "end of the period"
* [ ] Support for any number of Y-axis
* [ ] Support for logarithmic
* [ ] Support for state mapping for non-numerical state sensors
* [ ] Support for simple color threshold (easier to understand/write than the ones provided natively by ApexCharts)
* [ ] Support for graph configuration templates à la [`button-card`](https://github.com/custom-cards/button-card/blob/master/README.md#configuration-templates)

## Examples

TBD.