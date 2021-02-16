### [1.7.1-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.7.1-dev.1...v1.7.1-dev.2) (2021-02-16)


### Bug Fixes

* Disable support for colors with alpha channel ([#91](https://github.com/RomRider/apexcharts-card/issues/91)) ([522363a](https://github.com/RomRider/apexcharts-card/commit/522363aaa681777f53d744330355f46d9fa5042a)), closes [#90](https://github.com/RomRider/apexcharts-card/issues/90)

### [1.7.1-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.7.0...v1.7.1-dev.1) (2021-02-16)


### Bug Fixes

* **color_threshold:** Sometimes it would break the card ([65b5419](https://github.com/RomRider/apexcharts-card/commit/65b54191a2bd7ce03aaae97835043c4901e72fc7))

## [1.7.0](https://github.com/RomRider/apexcharts-card/compare/v1.6.0...v1.7.0) (2021-02-16)


### Features

* **datalabels:** Option to display total when chart is stacked ([#75](https://github.com/RomRider/apexcharts-card/issues/75)) ([e1c5b01](https://github.com/RomRider/apexcharts-card/commit/e1c5b015bd753c2d2b5a33dd564f0b150d66f2d8)), closes [#73](https://github.com/RomRider/apexcharts-card/issues/73)
* **experimental:** Header color can now follow `color_threshold` ([#88](https://github.com/RomRider/apexcharts-card/issues/88)) ([074bfc3](https://github.com/RomRider/apexcharts-card/commit/074bfc30f1dc1ac88ba08edb4f749e0744d9a722)), closes [#78](https://github.com/RomRider/apexcharts-card/issues/78)
* **locale:** Inherit locale from Home-Assistant, deprecate `hours_12` ([#70](https://github.com/RomRider/apexcharts-card/issues/70)) ([af2d201](https://github.com/RomRider/apexcharts-card/commit/af2d2013f57540dc35471dad90b09b93f4b9dc4f)), closes [#68](https://github.com/RomRider/apexcharts-card/issues/68)
* **series.show:** Display your serie's extremas on the chart ([#85](https://github.com/RomRider/apexcharts-card/issues/85)) ([f64169a](https://github.com/RomRider/apexcharts-card/commit/f64169ad0583aa754370d09d3567e2ba4d0ec9c8))
* **series.show:** Option to show the raw data in the header ([#76](https://github.com/RomRider/apexcharts-card/issues/76)) ([87b56f5](https://github.com/RomRider/apexcharts-card/commit/87b56f576389964fcf08ec0968589d6dd89407b1)), closes [#69](https://github.com/RomRider/apexcharts-card/issues/69)
* **transform:** Provide the full state as `entity` to the function ([#77](https://github.com/RomRider/apexcharts-card/issues/77)) ([9919c10](https://github.com/RomRider/apexcharts-card/commit/9919c10543b70220f5c7e6dab972324e807c095c)), closes [#71](https://github.com/RomRider/apexcharts-card/issues/71)


### Bug Fixes

* **config_templates:** Was supposed to support a string ([f36d9b1](https://github.com/RomRider/apexcharts-card/commit/f36d9b17eb5e768e1850a5d20e12374739f0fa4e)), closes [#87](https://github.com/RomRider/apexcharts-card/issues/87)
* color with alpha would render area opaque ([100b6d4](https://github.com/RomRider/apexcharts-card/commit/100b6d4e72272127783c65b1132dbefb0b349f95))
* Support for `rgba` colors ([7ecfafd](https://github.com/RomRider/apexcharts-card/commit/7ecfafdbeca0813d8983c061a03d375c5378142b))
* truncate floats in total datalabels ([917a20a](https://github.com/RomRider/apexcharts-card/commit/917a20a47e1b25cf4367770e31399a177334d345)), closes [#73](https://github.com/RomRider/apexcharts-card/issues/73)
* Wrong labels in tooltip in some cases ([8f0aca1](https://github.com/RomRider/apexcharts-card/commit/8f0aca1832f98d034990d75f8f09b195869b788c))


### Documentation

* Better info about month and year as offset units ([c194f87](https://github.com/RomRider/apexcharts-card/commit/c194f87cf419371b779602a9cda7f1927bf55757)), closes [#65](https://github.com/RomRider/apexcharts-card/issues/65)
* **config_templates:** Fix wrong config example ([ea1fef4](https://github.com/RomRider/apexcharts-card/commit/ea1fef45736b11fa79a78ca1ac59e7c80c42b39a))
* Card is now available in HACS by default ([1200abd](https://github.com/RomRider/apexcharts-card/commit/1200abd7909fb6d522d69cf9eb8cdfdab25a0a59))

## [1.7.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v1.7.0-dev.3...v1.7.0-dev.4) (2021-02-15)


### Features

* **experimental:** Header color can now follow `color_threshold` ([#88](https://github.com/RomRider/apexcharts-card/issues/88)) ([074bfc3](https://github.com/RomRider/apexcharts-card/commit/074bfc30f1dc1ac88ba08edb4f749e0744d9a722)), closes [#78](https://github.com/RomRider/apexcharts-card/issues/78)


### Bug Fixes

* **config_templates:** Was supposed to support a string ([f36d9b1](https://github.com/RomRider/apexcharts-card/commit/f36d9b17eb5e768e1850a5d20e12374739f0fa4e)), closes [#87](https://github.com/RomRider/apexcharts-card/issues/87)


### Documentation

* Better info about month and year as offset units ([c194f87](https://github.com/RomRider/apexcharts-card/commit/c194f87cf419371b779602a9cda7f1927bf55757)), closes [#65](https://github.com/RomRider/apexcharts-card/issues/65)

## [1.7.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.7.0-dev.2...v1.7.0-dev.3) (2021-02-15)


### Features

* **series.show:** Display your serie's extremas on the chart ([#85](https://github.com/RomRider/apexcharts-card/issues/85)) ([f64169a](https://github.com/RomRider/apexcharts-card/commit/f64169ad0583aa754370d09d3567e2ba4d0ec9c8))


### Bug Fixes

* color with alpha would render area opaque ([100b6d4](https://github.com/RomRider/apexcharts-card/commit/100b6d4e72272127783c65b1132dbefb0b349f95))
* Support for `rgba` colors ([7ecfafd](https://github.com/RomRider/apexcharts-card/commit/7ecfafdbeca0813d8983c061a03d375c5378142b))
* truncate floats in total datalabels ([917a20a](https://github.com/RomRider/apexcharts-card/commit/917a20a47e1b25cf4367770e31399a177334d345)), closes [#73](https://github.com/RomRider/apexcharts-card/issues/73)

## [1.7.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.7.0-dev.1...v1.7.0-dev.2) (2021-02-10)


### Features

* **series.show:** Option to show the raw data in the header ([#76](https://github.com/RomRider/apexcharts-card/issues/76)) ([87b56f5](https://github.com/RomRider/apexcharts-card/commit/87b56f576389964fcf08ec0968589d6dd89407b1)), closes [#69](https://github.com/RomRider/apexcharts-card/issues/69)
* **transform:** Provide the full state as `entity` to the function ([#77](https://github.com/RomRider/apexcharts-card/issues/77)) ([9919c10](https://github.com/RomRider/apexcharts-card/commit/9919c10543b70220f5c7e6dab972324e807c095c)), closes [#71](https://github.com/RomRider/apexcharts-card/issues/71)


### Bug Fixes

* Wrong labels in tooltip in some cases ([8f0aca1](https://github.com/RomRider/apexcharts-card/commit/8f0aca1832f98d034990d75f8f09b195869b788c))

## [1.7.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.6.0...v1.7.0-dev.1) (2021-02-10)


### Features

* **datalabels:** Option to display total when chart is stacked ([#75](https://github.com/RomRider/apexcharts-card/issues/75)) ([e1c5b01](https://github.com/RomRider/apexcharts-card/commit/e1c5b015bd753c2d2b5a33dd564f0b150d66f2d8)), closes [#73](https://github.com/RomRider/apexcharts-card/issues/73)
* **locale:** Inherit locale from Home-Assistant, deprecate `hours_12` ([#70](https://github.com/RomRider/apexcharts-card/issues/70)) ([af2d201](https://github.com/RomRider/apexcharts-card/commit/af2d2013f57540dc35471dad90b09b93f4b9dc4f)), closes [#68](https://github.com/RomRider/apexcharts-card/issues/68)


### Documentation

* **config_templates:** Fix wrong config example ([ea1fef4](https://github.com/RomRider/apexcharts-card/commit/ea1fef45736b11fa79a78ca1ac59e7c80c42b39a))
* Card is now available in HACS by default ([1200abd](https://github.com/RomRider/apexcharts-card/commit/1200abd7909fb6d522d69cf9eb8cdfdab25a0a59))

## [1.6.0](https://github.com/RomRider/apexcharts-card/compare/v1.5.0...v1.6.0) (2021-02-08)


### Features

* **config_tpl:** Create a config template and use it everywhere with `config_templates`, apply the same config to every series with `all_series_config` and add `color_list` to define your color list in one shot ([#64](https://github.com/RomRider/apexcharts-card/issues/64)) ([17004a3](https://github.com/RomRider/apexcharts-card/commit/17004a30b77733e5b09ebe7b4bbb4b7d3b265688))
* **experimental:** `hidden_by_default` to toggle series on load ([#62](https://github.com/RomRider/apexcharts-card/issues/62)) ([63717b7](https://github.com/RomRider/apexcharts-card/commit/63717b7ae9648debdb1d11a17ddf61f95f7225d4)), closes [#60](https://github.com/RomRider/apexcharts-card/issues/60)
* **series:** Define the `opacity` of the line or area ([8dfb3fd](https://github.com/RomRider/apexcharts-card/commit/8dfb3fd8839d7f93438b2273701bacd916d405c0)), closes [#57](https://github.com/RomRider/apexcharts-card/issues/57)
* add stroke_width and experimental color_threshold/disable_config_validation ([fcdfa88](https://github.com/RomRider/apexcharts-card/commit/fcdfa88fc357b64d7d958cfbc67695f58b53c69c)), closes [#58](https://github.com/RomRider/apexcharts-card/issues/58)


### Bug Fixes

* **color_threshold:** opacity for color_threshold ([5a325f4](https://github.com/RomRider/apexcharts-card/commit/5a325f4507b165564f41fb2d86095ca6175b37dc))
* **func:** median was sometimes wrong ([c36dda7](https://github.com/RomRider/apexcharts-card/commit/c36dda7b6121df9bcd924f5e5b5c9e543930e896))

## [1.6.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.6.0-dev.1...v1.6.0-dev.2) (2021-02-08)


### Features

* **config_tpl:** Create a config template and use it everywhere with `config_templates`, apply the same config to every series with `all_series_config` and add `color_list` to define your color list in one shot ([#64](https://github.com/RomRider/apexcharts-card/issues/64)) ([17004a3](https://github.com/RomRider/apexcharts-card/commit/17004a30b77733e5b09ebe7b4bbb4b7d3b265688))
* **experimental:** `hidden_by_default` to toggle series on load ([#62](https://github.com/RomRider/apexcharts-card/issues/62)) ([63717b7](https://github.com/RomRider/apexcharts-card/commit/63717b7ae9648debdb1d11a17ddf61f95f7225d4)), closes [#60](https://github.com/RomRider/apexcharts-card/issues/60)

## [1.6.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.5.0...v1.6.0-dev.1) (2021-02-07)


### Features

* **series:** Define the `opacity` of the line or area ([8dfb3fd](https://github.com/RomRider/apexcharts-card/commit/8dfb3fd8839d7f93438b2273701bacd916d405c0)), closes [#57](https://github.com/RomRider/apexcharts-card/issues/57)
* add stroke_width and experimental color_threshold/disable_config_validation ([fcdfa88](https://github.com/RomRider/apexcharts-card/commit/fcdfa88fc357b64d7d958cfbc67695f58b53c69c)), closes [#58](https://github.com/RomRider/apexcharts-card/issues/58)


### Bug Fixes

* **color_threshold:** opacity for color_threshold ([5a325f4](https://github.com/RomRider/apexcharts-card/commit/5a325f4507b165564f41fb2d86095ca6175b37dc))
* **func:** median was sometimes wrong ([c36dda7](https://github.com/RomRider/apexcharts-card/commit/c36dda7b6121df9bcd924f5e5b5c9e543930e896))

## [1.5.0](https://github.com/RomRider/apexcharts-card/compare/v1.4.0...v1.5.0) (2021-02-04)


### Features

* **series.show:** Show/hide dataLabels per serie ([9e28db3](https://github.com/RomRider/apexcharts-card/commit/9e28db349bff165722ba245e336e0ec8d0a718ab))
* Support for 12-hour format ([#55](https://github.com/RomRider/apexcharts-card/issues/55)) ([f38a18e](https://github.com/RomRider/apexcharts-card/commit/f38a18eb1e0a3aedb04c78577e6207c1eb9fb0f6)), closes [#48](https://github.com/RomRider/apexcharts-card/issues/48) [#53](https://github.com/RomRider/apexcharts-card/issues/53)
* **now:** Add a marker at the current time on the chart ([9b6b83d](https://github.com/RomRider/apexcharts-card/commit/9b6b83db64e8ec80ceaf3f929f3716b3fe5943b1)), closes [#44](https://github.com/RomRider/apexcharts-card/issues/44)
* **series:** `transform` the data the way you want ([#45](https://github.com/RomRider/apexcharts-card/issues/45)) ([1cb6bb5](https://github.com/RomRider/apexcharts-card/commit/1cb6bb5d0c5abbe73a4e5f0ded426cc123af515b))
* **series:** New `fill_raw` option to fill missing data in raw history ([e2433b6](https://github.com/RomRider/apexcharts-card/commit/e2433b679aad6efdb38137970d6acbfa2d3bc75f))


### Bug Fixes

* dataLabels would not follow `float_precision` ([cf9b63a](https://github.com/RomRider/apexcharts-card/commit/cf9b63a2a27aca63d7188f8eaf371f4c6b343191)), closes [#54](https://github.com/RomRider/apexcharts-card/issues/54)
* Float were not displayed in non-timeline charts ([e67d2d7](https://github.com/RomRider/apexcharts-card/commit/e67d2d7cdf2041c41e7c26965074c4037cfe46aa)), closes [#42](https://github.com/RomRider/apexcharts-card/issues/42)


### Documentation

* Fix HACS doc (not yet available by default) ([53fece2](https://github.com/RomRider/apexcharts-card/commit/53fece2d2e45ba80e90ed3f181021de5d1b05550))
* Fix typo in doc ([89ed3c5](https://github.com/RomRider/apexcharts-card/commit/89ed3c530ed296765dcbe65f856df16a57cc9db5))
* Missing link to the `now` section ([9747257](https://github.com/RomRider/apexcharts-card/commit/9747257018cb60359afc28eeb2c33f3f544f341f))

## [1.5.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v1.5.0-dev.3...v1.5.0-dev.4) (2021-02-04)


### Features

* Support for 12-hour format ([#55](https://github.com/RomRider/apexcharts-card/issues/55)) ([f38a18e](https://github.com/RomRider/apexcharts-card/commit/f38a18eb1e0a3aedb04c78577e6207c1eb9fb0f6)), closes [#48](https://github.com/RomRider/apexcharts-card/issues/48) [#53](https://github.com/RomRider/apexcharts-card/issues/53)


### Bug Fixes

* dataLabels would not follow `float_precision` ([cf9b63a](https://github.com/RomRider/apexcharts-card/commit/cf9b63a2a27aca63d7188f8eaf371f4c6b343191)), closes [#54](https://github.com/RomRider/apexcharts-card/issues/54)


### Documentation

* Missing link to the `now` section ([9747257](https://github.com/RomRider/apexcharts-card/commit/9747257018cb60359afc28eeb2c33f3f544f341f))

## [1.5.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.5.0-dev.2...v1.5.0-dev.3) (2021-02-03)


### Features

* **now:** Add a marker at the current time on the chart ([9b6b83d](https://github.com/RomRider/apexcharts-card/commit/9b6b83db64e8ec80ceaf3f929f3716b3fe5943b1)), closes [#44](https://github.com/RomRider/apexcharts-card/issues/44)
* **series:** `transform` the data the way you want ([#45](https://github.com/RomRider/apexcharts-card/issues/45)) ([1cb6bb5](https://github.com/RomRider/apexcharts-card/commit/1cb6bb5d0c5abbe73a4e5f0ded426cc123af515b))


### Documentation

* Fix typo in doc ([89ed3c5](https://github.com/RomRider/apexcharts-card/commit/89ed3c530ed296765dcbe65f856df16a57cc9db5))

## [1.5.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.5.0-dev.1...v1.5.0-dev.2) (2021-02-03)


### Bug Fixes

* Float were not displayed in non-timeline charts ([e67d2d7](https://github.com/RomRider/apexcharts-card/commit/e67d2d7cdf2041c41e7c26965074c4037cfe46aa)), closes [#42](https://github.com/RomRider/apexcharts-card/issues/42)

## [1.5.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.4.0...v1.5.0-dev.1) (2021-02-03)


### Features

* **series:** New `fill_raw` option to fill missing data in raw history ([e2433b6](https://github.com/RomRider/apexcharts-card/commit/e2433b679aad6efdb38137970d6acbfa2d3bc75f))

## [1.4.0](https://github.com/RomRider/apexcharts-card/compare/v1.3.0...v1.4.0) (2021-02-02)


### Features

* **series:** Show/Hide a specific serie from the header or the graph ([#36](https://github.com/RomRider/apexcharts-card/issues/36)) ([95c0433](https://github.com/RomRider/apexcharts-card/commit/95c0433833c197d32914ed11260b4dd08885d9f4))
* Support for auto-entities ([060e4c0](https://github.com/RomRider/apexcharts-card/commit/060e4c0f7cdfebb72055d83dada4129a0f699f3c))
* **editor:** Preview in the GUI card selector ([d4cd7a3](https://github.com/RomRider/apexcharts-card/commit/d4cd7a3a28ab9d29300772dbe22331857a3a1efc))
* **graph:** New chart types `scatter`, `donut`, `pie` and `radialBar` ([#24](https://github.com/RomRider/apexcharts-card/issues/24)) ([a0e4f85](https://github.com/RomRider/apexcharts-card/commit/a0e4f8536593dc6f67f7439d77be367af74de736))
* **group_by:** Add new `diff` function ([57fd6a6](https://github.com/RomRider/apexcharts-card/commit/57fd6a640aaee223adaa174ad5d1fb82f496a878))
* **series:** Retrieve an attribute of your entity instead of the state ([#32](https://github.com/RomRider/apexcharts-card/issues/32)) ([b76bf16](https://github.com/RomRider/apexcharts-card/commit/b76bf16e9f3d4dc8c28767d552139de3aa033fa7)), closes [#29](https://github.com/RomRider/apexcharts-card/issues/29)


### Bug Fixes

* `group_by` was extending values into the future ([2cb79d2](https://github.com/RomRider/apexcharts-card/commit/2cb79d2bc9f341fff1f03a61c334fd9212e2e4c7))
* Graph stopped updating following ddf6ca9 ([bc54729](https://github.com/RomRider/apexcharts-card/commit/bc547290301e1a5b09725589eaf95a640bdb5752))
* Sometimes card would stay in warning mode ([ddf6ca9](https://github.com/RomRider/apexcharts-card/commit/ddf6ca9105062a8591ba1e9ab702abb01e689592))
* Tooltip should not be in a fixed position ([1762049](https://github.com/RomRider/apexcharts-card/commit/176204901d501bbcee8b328a003770df8d752587))
* **func:** Filter `null` values in `diff` ([cfe736c](https://github.com/RomRider/apexcharts-card/commit/cfe736ccf6ef071b7dfe4ae90804a919c12cb984))
* **header:** Hide unit when `as_duration` is used ([5686931](https://github.com/RomRider/apexcharts-card/commit/56869316476d7d64abb6045e1d40e854300c0836))
* **header:** State was sometimes multi-line ([4187104](https://github.com/RomRider/apexcharts-card/commit/4187104a04bfb2acbf600abfb84bf9bd264d7ccb))


### Documentation

* Add an example to change the line thickness ([fd4a495](https://github.com/RomRider/apexcharts-card/commit/fd4a49542ea2fc7ebee10969c73bcbe26c73b68a))
* Add more example ([ffaa5df](https://github.com/RomRider/apexcharts-card/commit/ffaa5df44fb009b881ba6af8d4d73ec9e7562c26))
* Fix error `data_generator` example ([6d1c7a0](https://github.com/RomRider/apexcharts-card/commit/6d1c7a0d53a74a081b4900f1aa5c7c26b8159945)), closes [#34](https://github.com/RomRider/apexcharts-card/issues/34)
* Fix some typos ([3df6aed](https://github.com/RomRider/apexcharts-card/commit/3df6aed4769b8b0b927f961083f7aa16521ddf58))
* Missing `title` documentation in the header section ([ff7f35b](https://github.com/RomRider/apexcharts-card/commit/ff7f35b0b341305600bd0ac9baa86cfec737d20f))

## [1.4.0-dev.6](https://github.com/RomRider/apexcharts-card/compare/v1.4.0-dev.5...v1.4.0-dev.6) (2021-02-02)


### Bug Fixes

* `group_by` was extending values into the future ([2cb79d2](https://github.com/RomRider/apexcharts-card/commit/2cb79d2bc9f341fff1f03a61c334fd9212e2e4c7))
* Tooltip should not be in a fixed position ([1762049](https://github.com/RomRider/apexcharts-card/commit/176204901d501bbcee8b328a003770df8d752587))

## [1.4.0-dev.5](https://github.com/RomRider/apexcharts-card/compare/v1.4.0-dev.4...v1.4.0-dev.5) (2021-02-01)


### Features

* **series:** Show/Hide a specific serie from the header or the graph ([#36](https://github.com/RomRider/apexcharts-card/issues/36)) ([95c0433](https://github.com/RomRider/apexcharts-card/commit/95c0433833c197d32914ed11260b4dd08885d9f4))


### Bug Fixes

* Graph stopped updating following ddf6ca9 ([bc54729](https://github.com/RomRider/apexcharts-card/commit/bc547290301e1a5b09725589eaf95a640bdb5752))
* Sometimes card would stay in warning mode ([ddf6ca9](https://github.com/RomRider/apexcharts-card/commit/ddf6ca9105062a8591ba1e9ab702abb01e689592))


### Documentation

* Fix error `data_generator` example ([6d1c7a0](https://github.com/RomRider/apexcharts-card/commit/6d1c7a0d53a74a081b4900f1aa5c7c26b8159945)), closes [#34](https://github.com/RomRider/apexcharts-card/issues/34)

## [1.4.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v1.4.0-dev.3...v1.4.0-dev.4) (2021-02-01)


### Features

* Support for auto-entities ([060e4c0](https://github.com/RomRider/apexcharts-card/commit/060e4c0f7cdfebb72055d83dada4129a0f699f3c))
* **series:** Retrieve an attribute of your entity instead of the state ([#32](https://github.com/RomRider/apexcharts-card/issues/32)) ([b76bf16](https://github.com/RomRider/apexcharts-card/commit/b76bf16e9f3d4dc8c28767d552139de3aa033fa7)), closes [#29](https://github.com/RomRider/apexcharts-card/issues/29)


### Documentation

* Add more example ([ffaa5df](https://github.com/RomRider/apexcharts-card/commit/ffaa5df44fb009b881ba6af8d4d73ec9e7562c26))
* Fix some typos ([3df6aed](https://github.com/RomRider/apexcharts-card/commit/3df6aed4769b8b0b927f961083f7aa16521ddf58))

## [1.4.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.4.0-dev.2...v1.4.0-dev.3) (2021-01-31)


### Bug Fixes

* **func:** Filter `null` values in `diff` ([cfe736c](https://github.com/RomRider/apexcharts-card/commit/cfe736ccf6ef071b7dfe4ae90804a919c12cb984))

## [1.4.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.4.0-dev.1...v1.4.0-dev.2) (2021-01-31)


### Features

* **editor:** Preview in the GUI card selector ([d4cd7a3](https://github.com/RomRider/apexcharts-card/commit/d4cd7a3a28ab9d29300772dbe22331857a3a1efc))
* **group_by:** Add new `diff` function ([57fd6a6](https://github.com/RomRider/apexcharts-card/commit/57fd6a640aaee223adaa174ad5d1fb82f496a878))

## [1.4.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.3.1-dev.1...v1.4.0-dev.1) (2021-01-30)


### Features

* **graph:** New chart types `scatter`, `donut`, `pie` and `radialBar` ([#24](https://github.com/RomRider/apexcharts-card/issues/24)) ([a0e4f85](https://github.com/RomRider/apexcharts-card/commit/a0e4f8536593dc6f67f7439d77be367af74de736))


### Documentation

* Add an example to change the line thickness ([fd4a495](https://github.com/RomRider/apexcharts-card/commit/fd4a49542ea2fc7ebee10969c73bcbe26c73b68a))
* Missing `title` documentation in the header section ([ff7f35b](https://github.com/RomRider/apexcharts-card/commit/ff7f35b0b341305600bd0ac9baa86cfec737d20f))

### [1.3.1-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.3.0...v1.3.1-dev.1) (2021-01-30)


### Bug Fixes

* **header:** Hide unit when `as_duration` is used ([5686931](https://github.com/RomRider/apexcharts-card/commit/56869316476d7d64abb6045e1d40e854300c0836))
* **header:** State was sometimes multi-line ([4187104](https://github.com/RomRider/apexcharts-card/commit/4187104a04bfb2acbf600abfb84bf9bd264d7ccb))

## [1.3.0](https://github.com/RomRider/apexcharts-card/compare/v1.2.0...v1.3.0) (2021-01-30)


### Features

* **series:** Display values as a duration ([#21](https://github.com/RomRider/apexcharts-card/issues/21)) ([227f0ea](https://github.com/RomRider/apexcharts-card/commit/227f0ea0a4457b0aa7a26fd032b6cb9e28cb1c2b))
* **series:** Hide the value of a serie in the legend ([#22](https://github.com/RomRider/apexcharts-card/issues/22)) ([1e8f748](https://github.com/RomRider/apexcharts-card/commit/1e8f748594f36ed3bbacd4305f9a5233aecbb029)), closes [#20](https://github.com/RomRider/apexcharts-card/issues/20)
* **series.offset:** Compare data from another timeframe with the current timeframe ([#19](https://github.com/RomRider/apexcharts-card/issues/19)) ([af8ba81](https://github.com/RomRider/apexcharts-card/commit/af8ba8156452054c38b4b65bb843bb16fbfdf6bd)), closes [#18](https://github.com/RomRider/apexcharts-card/issues/18)


### Bug Fixes

* **config:** `style` was not a valid config option (card-mod/picture-element) ([0a38778](https://github.com/RomRider/apexcharts-card/commit/0a3877858c9187e7356ca4cdd2543c6f0865db99)), closes [#15](https://github.com/RomRider/apexcharts-card/issues/15)
* **header:** Unit would sometimes be on a new line ([92fad1b](https://github.com/RomRider/apexcharts-card/commit/92fad1b1a39dda89f264e690fc15c7ce394d6105))
* **series.offset:** Fix bug introduced by [#19](https://github.com/RomRider/apexcharts-card/issues/19) ([f5c0d57](https://github.com/RomRider/apexcharts-card/commit/f5c0d57f17c2e799d2890b78b12b9a7dd685703f)), closes [#18](https://github.com/RomRider/apexcharts-card/issues/18)
* **style:** Better default styling of toolbar ([4d0ef1c](https://github.com/RomRider/apexcharts-card/commit/4d0ef1c6b1c22f6c9a0e84244062dd4361ea7cca)), closes [#16](https://github.com/RomRider/apexcharts-card/issues/16)

## [1.3.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.3.0-dev.2...v1.3.0-dev.3) (2021-01-30)


### Features

* **series:** Display values as a duration ([#21](https://github.com/RomRider/apexcharts-card/issues/21)) ([227f0ea](https://github.com/RomRider/apexcharts-card/commit/227f0ea0a4457b0aa7a26fd032b6cb9e28cb1c2b))
* **series:** Hide the value of a serie in the legend ([#22](https://github.com/RomRider/apexcharts-card/issues/22)) ([1e8f748](https://github.com/RomRider/apexcharts-card/commit/1e8f748594f36ed3bbacd4305f9a5233aecbb029)), closes [#20](https://github.com/RomRider/apexcharts-card/issues/20)


### Bug Fixes

* **header:** Unit would sometimes be on a new line ([92fad1b](https://github.com/RomRider/apexcharts-card/commit/92fad1b1a39dda89f264e690fc15c7ce394d6105))

## [1.3.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.3.0-dev.1...v1.3.0-dev.2) (2021-01-29)


### Bug Fixes

* **series.offset:** Fix bug introduced by [#19](https://github.com/RomRider/apexcharts-card/issues/19) ([f5c0d57](https://github.com/RomRider/apexcharts-card/commit/f5c0d57f17c2e799d2890b78b12b9a7dd685703f)), closes [#18](https://github.com/RomRider/apexcharts-card/issues/18)

## [1.3.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.2.1-dev.1...v1.3.0-dev.1) (2021-01-29)


### Features

* **series.offset:** Compare data from another timeframe with the current timeframe ([#19](https://github.com/RomRider/apexcharts-card/issues/19)) ([af8ba81](https://github.com/RomRider/apexcharts-card/commit/af8ba8156452054c38b4b65bb843bb16fbfdf6bd)), closes [#18](https://github.com/RomRider/apexcharts-card/issues/18)

### [1.2.1-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.2.0...v1.2.1-dev.1) (2021-01-29)


### Bug Fixes

* **config:** `style` was not a valid config option (card-mod/picture-element) ([0a38778](https://github.com/RomRider/apexcharts-card/commit/0a3877858c9187e7356ca4cdd2543c6f0865db99)), closes [#15](https://github.com/RomRider/apexcharts-card/issues/15)
* **style:** Better default styling of toolbar ([4d0ef1c](https://github.com/RomRider/apexcharts-card/commit/4d0ef1c6b1c22f6c9a0e84244062dd4361ea7cca)), closes [#16](https://github.com/RomRider/apexcharts-card/issues/16)

## [1.2.0](https://github.com/RomRider/apexcharts-card/compare/v1.1.0...v1.2.0) (2021-01-28)


### Features

* Define your own float precision for legend, tooltip and Y axis ([7b0f30f](https://github.com/RomRider/apexcharts-card/commit/7b0f30f7456ecf6ac7d2dab6b80e8533029bc316))
* **cache:** Invalidate cache on every new card version ([#12](https://github.com/RomRider/apexcharts-card/issues/12)) ([b1799d9](https://github.com/RomRider/apexcharts-card/commit/b1799d96af2f7d1e5efb6fed6c0a2d8686164386))
* **data_generator:** Build your own data based on the last state and attributes of your entity ([#14](https://github.com/RomRider/apexcharts-card/issues/14)) ([18284b5](https://github.com/RomRider/apexcharts-card/commit/18284b5d6d6b8ec4598f02926ed6b3cae6fcd2f4)), closes [#6](https://github.com/RomRider/apexcharts-card/issues/6)
* **invert:** Negates/Inverts the data for a serie ([#13](https://github.com/RomRider/apexcharts-card/issues/13)) ([ab793c5](https://github.com/RomRider/apexcharts-card/commit/ab793c5073902f7a88b6aa18c133d43a0afdcf4e))
* **span:** Add `end` as an option to end the graph at the end of the day, minute, etc... ([#11](https://github.com/RomRider/apexcharts-card/issues/11)) ([1d0aca8](https://github.com/RomRider/apexcharts-card/commit/1d0aca8c11eb602385c6a855ddc52b2f2c2b8367))
* **span:** Display the graph from the start of the hour, day, month,… with an offset or not ([#10](https://github.com/RomRider/apexcharts-card/issues/10)) ([bb6e88c](https://github.com/RomRider/apexcharts-card/commit/bb6e88c6766262b96d7b66414db26d6f9f83b1c8))


### Bug Fixes

* **xasis:** Better handling of graph end time if everything is `column` and `group_by` is enabled ([b5b85a6](https://github.com/RomRider/apexcharts-card/commit/b5b85a63140ddef6810abbdb3060b8f9f2f26980))
* **yaxis:** apex_config.yaxis was not taken into account properly ([ce04230](https://github.com/RomRider/apexcharts-card/commit/ce04230acb84dc10cdfe754dde0e642e8911c577))
* Sometimes the graph was empty when changing tabs ([9232044](https://github.com/RomRider/apexcharts-card/commit/923204499466045f5245b90e5c189309ba403533))
* **legend:** undefined was displayed for a hidden serie ([352c016](https://github.com/RomRider/apexcharts-card/commit/352c016d2606dd9c75ec1b2bc3c1a265b1f24fef))
* Get rid of the initial load delay ([69f151b](https://github.com/RomRider/apexcharts-card/commit/69f151b7e603ba47574dc7af33c3030f38e9b59c))
* **colorize_states:** Parameter was not applied ([28bb2e2](https://github.com/RomRider/apexcharts-card/commit/28bb2e268c6b3eacde6e3f397bc57724fc13c174))
* **datalabels:** Truncate floats to 1 digit after the decimal point ([f5f744f](https://github.com/RomRider/apexcharts-card/commit/f5f744f88e8c7a7b67971b884ef6f805070da21b))

## [1.2.0-dev.6](https://github.com/RomRider/apexcharts-card/compare/v1.2.0-dev.5...v1.2.0-dev.6) (2021-01-28)


### Features

* Define your own float precision for legend, tooltip and Y axis ([7b0f30f](https://github.com/RomRider/apexcharts-card/commit/7b0f30f7456ecf6ac7d2dab6b80e8533029bc316))


### Bug Fixes

* **xasis:** Better handling of graph end time if everything is `column` and `group_by` is enabled ([b5b85a6](https://github.com/RomRider/apexcharts-card/commit/b5b85a63140ddef6810abbdb3060b8f9f2f26980))

## [1.2.0-dev.5](https://github.com/RomRider/apexcharts-card/compare/v1.2.0-dev.4...v1.2.0-dev.5) (2021-01-27)


### Bug Fixes

* **yaxis:** apex_config.yaxis was not taken into account properly ([ce04230](https://github.com/RomRider/apexcharts-card/commit/ce04230acb84dc10cdfe754dde0e642e8911c577))
* Sometimes the graph was empty when changing tabs ([9232044](https://github.com/RomRider/apexcharts-card/commit/923204499466045f5245b90e5c189309ba403533))

## [1.2.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v1.2.0-dev.3...v1.2.0-dev.4) (2021-01-27)


### Features

* **data_generator:** Build your own data based on the last state and attributes of your entity ([#14](https://github.com/RomRider/apexcharts-card/issues/14)) ([18284b5](https://github.com/RomRider/apexcharts-card/commit/18284b5d6d6b8ec4598f02926ed6b3cae6fcd2f4)), closes [#6](https://github.com/RomRider/apexcharts-card/issues/6)


### Bug Fixes

* **legend:** undefined was displayed for a hidden serie ([352c016](https://github.com/RomRider/apexcharts-card/commit/352c016d2606dd9c75ec1b2bc3c1a265b1f24fef))
* Get rid of the initial load delay ([69f151b](https://github.com/RomRider/apexcharts-card/commit/69f151b7e603ba47574dc7af33c3030f38e9b59c))

## [1.2.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.2.0-dev.2...v1.2.0-dev.3) (2021-01-27)


### Features

* **invert:** Negates/Inverts the data for a serie ([#13](https://github.com/RomRider/apexcharts-card/issues/13)) ([ab793c5](https://github.com/RomRider/apexcharts-card/commit/ab793c5073902f7a88b6aa18c133d43a0afdcf4e))

## [1.2.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.2.0-dev.1...v1.2.0-dev.2) (2021-01-27)


### Features

* **cache:** Invalidate cache on every new card version ([#12](https://github.com/RomRider/apexcharts-card/issues/12)) ([b1799d9](https://github.com/RomRider/apexcharts-card/commit/b1799d96af2f7d1e5efb6fed6c0a2d8686164386))
* **span:** Add `end` as an option to end the graph at the end of the day, minute, etc... ([#11](https://github.com/RomRider/apexcharts-card/issues/11)) ([1d0aca8](https://github.com/RomRider/apexcharts-card/commit/1d0aca8c11eb602385c6a855ddc52b2f2c2b8367))


### Bug Fixes

* **colorize_states:** Parameter was not applied ([28bb2e2](https://github.com/RomRider/apexcharts-card/commit/28bb2e268c6b3eacde6e3f397bc57724fc13c174))
* **datalabels:** Truncate floats to 1 digit after the decimal point ([f5f744f](https://github.com/RomRider/apexcharts-card/commit/f5f744f88e8c7a7b67971b884ef6f805070da21b))

## [1.2.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.1.0...v1.2.0-dev.1) (2021-01-27)


### Features

* **span:** Display the graph from the start of the hour, day, month,… with an offset or not ([#10](https://github.com/RomRider/apexcharts-card/issues/10)) ([bb6e88c](https://github.com/RomRider/apexcharts-card/commit/bb6e88c6766262b96d7b66414db26d6f9f83b1c8))

## [1.1.0](https://github.com/RomRider/apexcharts-card/compare/v1.0.2...v1.1.0) (2021-01-26)


### ⚠ BREAKING CHANGES

* Replace `hours_to_show` with `graph_span`. Takes a time string instead of a number of hours.

### Features

* Replace `hours_to_show` with `graph_span`. Takes a time string instead of a number of hours. ([e7ed408](https://github.com/RomRider/apexcharts-card/commit/e7ed40892e8e041ffdb62a6efc9fc2050b715b73))
* **color:** Define your own `color` option for each `serie` ([#7](https://github.com/RomRider/apexcharts-card/issues/7)) ([3a15db2](https://github.com/RomRider/apexcharts-card/commit/3a15db2b79eb0377b244387e8895eb871e2e35d2)), closes [#4](https://github.com/RomRider/apexcharts-card/issues/4)
* **header:** More header options and title support ([#8](https://github.com/RomRider/apexcharts-card/issues/8)) ([2cbd769](https://github.com/RomRider/apexcharts-card/commit/2cbd769f9229b5c49d32a1aa42b0cc5ccaff914d)), closes [#5](https://github.com/RomRider/apexcharts-card/issues/5)
* Add `update_interval` config option ([357db9a](https://github.com/RomRider/apexcharts-card/commit/357db9a60cf7e1e41fca742f481222f293490ae4)), closes [#2](https://github.com/RomRider/apexcharts-card/issues/2)


### Bug Fixes

* **tooltip:** Values where following the selected point ([0145ca2](https://github.com/RomRider/apexcharts-card/commit/0145ca2c455cf263bf6ab7a983300c8fb4ea6fb9))
* Error was not displayed if duration couldn't be parsed ([2e2212f](https://github.com/RomRider/apexcharts-card/commit/2e2212f54d57cda08fc91c7c767d4e032e680db5))
* Name and units displayed ([fe5526b](https://github.com/RomRider/apexcharts-card/commit/fe5526b976e394d50c066588faaebd423b8ec966))


### Documentation

* Add examples and fix documentation ([c71b76a](https://github.com/RomRider/apexcharts-card/commit/c71b76ae5e9352cbab8b247a3908dbfded1ba7e6))
* Fix typos and broken links ([7789b8f](https://github.com/RomRider/apexcharts-card/commit/7789b8fd76b9c4f0139577090dfd8b4a0e88ce47))


### Chores

* **changelog:** Add doc and chores sections ([58d7f5f](https://github.com/RomRider/apexcharts-card/commit/58d7f5f37842525a7b61d017feef2cadafdf56bd))
* **release:** 1.1.0-dev.1 [skip ci] ([e15f7b9](https://github.com/RomRider/apexcharts-card/commit/e15f7b94a6ca366354ee516a95123d9e8ef3db62)), closes [#2](https://github.com/RomRider/apexcharts-card/issues/2)
* **release:** 1.1.0-dev.2 [skip ci] ([f01afd7](https://github.com/RomRider/apexcharts-card/commit/f01afd77a0e1dde79869f23225c44b49027a8a37)), closes [#4](https://github.com/RomRider/apexcharts-card/issues/4) [#5](https://github.com/RomRider/apexcharts-card/issues/5)

## [1.1.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.1.0-dev.1...v1.1.0-dev.2) (2021-01-26)


### ⚠ BREAKING CHANGES

* Replace `hours_to_show` with `graph_span`. Takes a time string instead of a number of hours.

### Features

* Replace `hours_to_show` with `graph_span`. Takes a time string instead of a number of hours. ([e7ed408](https://github.com/RomRider/apexcharts-card/commit/e7ed40892e8e041ffdb62a6efc9fc2050b715b73))
* **color:** Define your own `color` option for each `serie` ([#7](https://github.com/RomRider/apexcharts-card/issues/7)) ([3a15db2](https://github.com/RomRider/apexcharts-card/commit/3a15db2b79eb0377b244387e8895eb871e2e35d2)), closes [#4](https://github.com/RomRider/apexcharts-card/issues/4)
* **header:** More header options and title support ([#8](https://github.com/RomRider/apexcharts-card/issues/8)) ([2cbd769](https://github.com/RomRider/apexcharts-card/commit/2cbd769f9229b5c49d32a1aa42b0cc5ccaff914d)), closes [#5](https://github.com/RomRider/apexcharts-card/issues/5)


### Bug Fixes

* **tooltip:** Values where following the selected point ([0145ca2](https://github.com/RomRider/apexcharts-card/commit/0145ca2c455cf263bf6ab7a983300c8fb4ea6fb9))

## [1.1.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.0.2...v1.1.0-dev.1) (2021-01-25)


### Features

* Add `update_interval` config option ([357db9a](https://github.com/RomRider/apexcharts-card/commit/357db9a60cf7e1e41fca742f481222f293490ae4)), closes [#2](https://github.com/RomRider/apexcharts-card/issues/2)


### Bug Fixes

* Error was not displayed if duration couldn't be parsed ([2e2212f](https://github.com/RomRider/apexcharts-card/commit/2e2212f54d57cda08fc91c7c767d4e032e680db5))
* Name and units displayed ([fe5526b](https://github.com/RomRider/apexcharts-card/commit/fe5526b976e394d50c066588faaebd423b8ec966))


### Documentation

* Add examples and fix documentation ([c71b76a](https://github.com/RomRider/apexcharts-card/commit/c71b76ae5e9352cbab8b247a3908dbfded1ba7e6))
* Fix typos and broken links ([7789b8f](https://github.com/RomRider/apexcharts-card/commit/7789b8fd76b9c4f0139577090dfd8b4a0e88ce47))


### Chores

* **changelog:** Add doc and chores sections ([58d7f5f](https://github.com/RomRider/apexcharts-card/commit/58d7f5f37842525a7b61d017feef2cadafdf56bd))

## [1.0.2](https://github.com/RomRider/apexcharts-card/compare/v1.0.1...v1.0.2) (2021-01-25)


### Bug Fixes

* `bar` should be `column` ([ff188ee](https://github.com/RomRider/apexcharts-card/commit/ff188ee54ba4a3652dc2a6efaccd5d4d950251ba))

## [1.0.1](https://github.com/RomRider/apexcharts-card/compare/v1.0.0...v1.0.1) (2021-01-25)


### Bug Fixes

* Not releasing file ([e1dc473](https://github.com/RomRider/apexcharts-card/commit/e1dc47312f53468990586af2643f7afeeca32275))

# 1.0.0 (2021-01-25)


### Bug Fixes

* 1st color was not using transparency ([77a9c8d](https://github.com/RomRider/apexcharts-card/commit/77a9c8d0ac37039816d516bd2305b7c942a3fcc1))
* **legend:** Change ` - ` to `: ` between name and state ([4e3cdc6](https://github.com/RomRider/apexcharts-card/commit/4e3cdc6776349f171fc1d0b043f6e48371773569))
* Last computed history data shouldn't be null ([ec875d5](https://github.com/RomRider/apexcharts-card/commit/ec875d52ea7e07eddfa37d243e983d6dc1b2513c))
* **axis:** X and Y Axis Tooltip color matches theme ([fb717ef](https://github.com/RomRider/apexcharts-card/commit/fb717ef012c18fe50703eae4c4f6ee1350fbaddb))
* **build:** Missing dependancy ([7d7d637](https://github.com/RomRider/apexcharts-card/commit/7d7d637325e20f578de44da69f83b30d703e62ca))
* **build:** Remove comments from build ([268ef77](https://github.com/RomRider/apexcharts-card/commit/268ef77467295d0263373235a9d59c3704edc059))
* **graph:** Loading message didn't appear ([ce3c45c](https://github.com/RomRider/apexcharts-card/commit/ce3c45cc58f50ae2b2a8365842e492db56155173))
* **graph:** Not displaying the latest state in graph ([280e328](https://github.com/RomRider/apexcharts-card/commit/280e3281871652c1bafcfefcc820d1b89694cc04))
* **tooltip:** Use colors from the theme ([5c263f1](https://github.com/RomRider/apexcharts-card/commit/5c263f1851518303d9751d66d9db1812485bc62f))


### Features

* Add delta and median function ([4a77e55](https://github.com/RomRider/apexcharts-card/commit/4a77e55a8ff0adba7cc7cf3d8d5263448ab94580))
* Better cache handling ([#1](https://github.com/RomRider/apexcharts-card/issues/1)) ([804415f](https://github.com/RomRider/apexcharts-card/commit/804415f295e015e35c6fcc070e0766a988cf446b))
* **group_by:** Add more functions and fix buckets ([c7324e0](https://github.com/RomRider/apexcharts-card/commit/c7324e04f7d1b196ccf9f7437bc2f44671f1ba84))
* Add spinner while data is loading ([39d4b8e](https://github.com/RomRider/apexcharts-card/commit/39d4b8e2155e0b691d07f38fc0c2419ae7f09d65))
* Display warning if sensor doesn't exist ([a69df3d](https://github.com/RomRider/apexcharts-card/commit/a69df3d9a1e0d8ae69be671b219b15a1b30ea2e4))
* Floating header ([1eccee8](https://github.com/RomRider/apexcharts-card/commit/1eccee87bc59fb0f3eb012f6b3024fd8ddef04d4))
* Initial support for aggregating data ([13dfd89](https://github.com/RomRider/apexcharts-card/commit/13dfd89d5be3ad62db73f9daea8ab5c92a3478a0))
* Show value in legend ([869a7f8](https://github.com/RomRider/apexcharts-card/commit/869a7f83dc3740ffe7b5d2f3827070d9c391101e))
* Support for all ApexCharts options ([03efa8d](https://github.com/RomRider/apexcharts-card/commit/03efa8da00015bbd954b923b3a83ce545ca7d681))
* Support for header ([c5a8ee2](https://github.com/RomRider/apexcharts-card/commit/c5a8ee2a3e92567fcdc7f327cb838d39bcb372f8))
* **card:** Support for pre-defined layouts ([c5987f8](https://github.com/RomRider/apexcharts-card/commit/c5987f8df0589b556235379d2ced172fee6facbd))
* **graph:** Extends graph's last value to the current time ([bfe64c5](https://github.com/RomRider/apexcharts-card/commit/bfe64c5fcf4869676bf6eac584de612fa6e8d6a2))
