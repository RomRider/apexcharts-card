### [2.1.2](https://github.com/RomRider/apexcharts-card/compare/v2.1.1...v2.1.2) (2024-07-10)


### Bug Fixes

* **series:** extremas would be wrong in some cases with `in_header: false` ([019b4ee](https://github.com/RomRider/apexcharts-card/commit/019b4ee1c7432e780a3f10ab6bf366fc1e5ded65)), closes [#725](https://github.com/RomRider/apexcharts-card/issues/725)

### [2.1.1](https://github.com/RomRider/apexcharts-card/compare/v2.1.0...v2.1.1) (2024-07-09)


### Bug Fixes

* **yaxis:** when `in_chart: false`, `yaxis` generated config would be wrong ([5932f2f](https://github.com/RomRider/apexcharts-card/commit/5932f2fc7ebb260677753b3c7526d3fb42b6da95)), closes [#724](https://github.com/RomRider/apexcharts-card/issues/724)

## [2.1.0](https://github.com/RomRider/apexcharts-card/compare/v2.0.4...v2.1.0) (2024-07-09)


### Features

* Add change type for statistics ([#555](https://github.com/RomRider/apexcharts-card/issues/555)) ([608fbe5](https://github.com/RomRider/apexcharts-card/commit/608fbe577672752177a9b000c692e120b844f9f3)), closes [#552](https://github.com/RomRider/apexcharts-card/issues/552)
* **locales:** Support for new locales ([2fca527](https://github.com/RomRider/apexcharts-card/commit/2fca527345e0ec7cc4072903cbd1089fe40a2b66))
* **series:** Direct support for dashed lines ([29aad77](https://github.com/RomRider/apexcharts-card/commit/29aad77ef1d2bedbc04c507d2319ed1f6f764f23)), closes [#413](https://github.com/RomRider/apexcharts-card/issues/413)
* **series:** hide specific serie in legend with `in_legend: false` ([12cb893](https://github.com/RomRider/apexcharts-card/commit/12cb8933270eb133aece07938acef6fec70ff58d)), closes [#74](https://github.com/RomRider/apexcharts-card/issues/74)
* **series:** support for `monotoneCubic` curves ([998cb99](https://github.com/RomRider/apexcharts-card/commit/998cb994b6c8295b430fb138c54d1a9e30e7506a))
* **series:** Support for stack group of columns ([2935b4e](https://github.com/RomRider/apexcharts-card/commit/2935b4efb73d67014b8043c369e089ce692dfc24)), closes [#673](https://github.com/RomRider/apexcharts-card/issues/673) [#550](https://github.com/RomRider/apexcharts-card/issues/550)
* **statistics:** add weekly statistics period ([#680](https://github.com/RomRider/apexcharts-card/issues/680)) ([e923126](https://github.com/RomRider/apexcharts-card/commit/e923126d162b49a344a673df8cd413078d48adf0))
* support for server time ([55c8f97](https://github.com/RomRider/apexcharts-card/commit/55c8f9720bd3ddcf37a7a9f8c8f9d4609bc1c728)), closes [#709](https://github.com/RomRider/apexcharts-card/issues/709) [#579](https://github.com/RomRider/apexcharts-card/issues/579)


### Bug Fixes

* `extremas` with `time_delta` would generate wrong results ([f7ab3e8](https://github.com/RomRider/apexcharts-card/commit/f7ab3e808a577d0ea6a6d9e3b76d386ab761e43c)), closes [#713](https://github.com/RomRider/apexcharts-card/issues/713)
* display was wrong when using server time + serie offset ([84357f9](https://github.com/RomRider/apexcharts-card/commit/84357f9bc85a7111e73ec6aa2c91a402d90cbfc8)), closes [#579](https://github.com/RomRider/apexcharts-card/issues/579)
* **series:** fix `in_legend` for apexcharts.js v3.50.0 ([221b0a5](https://github.com/RomRider/apexcharts-card/commit/221b0a50ad46e47050653ba0ee4a544a3fb3a6df))

## [2.1.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v2.1.0-dev.3...v2.1.0-dev.4) (2024-07-09)


### Features

* **series:** hide specific serie in legend with `in_legend: false` ([12cb893](https://github.com/RomRider/apexcharts-card/commit/12cb8933270eb133aece07938acef6fec70ff58d)), closes [#74](https://github.com/RomRider/apexcharts-card/issues/74)
* **series:** Support for stack group of columns ([2935b4e](https://github.com/RomRider/apexcharts-card/commit/2935b4efb73d67014b8043c369e089ce692dfc24)), closes [#673](https://github.com/RomRider/apexcharts-card/issues/673) [#550](https://github.com/RomRider/apexcharts-card/issues/550)

## [2.1.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v2.1.0-dev.2...v2.1.0-dev.3) (2024-07-05)


### Features

* **locales:** Support for new locales ([2fca527](https://github.com/RomRider/apexcharts-card/commit/2fca527345e0ec7cc4072903cbd1089fe40a2b66))
* **series:** Direct support for dashed lines ([29aad77](https://github.com/RomRider/apexcharts-card/commit/29aad77ef1d2bedbc04c507d2319ed1f6f764f23)), closes [#413](https://github.com/RomRider/apexcharts-card/issues/413)
* **series:** support for `monotoneCubic` curves ([998cb99](https://github.com/RomRider/apexcharts-card/commit/998cb994b6c8295b430fb138c54d1a9e30e7506a))

## [2.1.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v2.1.0-dev.1...v2.1.0-dev.2) (2024-07-04)


### Bug Fixes

* `extremas` with `time_delta` would generate wrong results ([f7ab3e8](https://github.com/RomRider/apexcharts-card/commit/f7ab3e808a577d0ea6a6d9e3b76d386ab761e43c)), closes [#713](https://github.com/RomRider/apexcharts-card/issues/713)
* display was wrong when using server time + serie offset ([84357f9](https://github.com/RomRider/apexcharts-card/commit/84357f9bc85a7111e73ec6aa2c91a402d90cbfc8)), closes [#579](https://github.com/RomRider/apexcharts-card/issues/579)

## [2.1.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v2.0.4...v2.1.0-dev.1) (2024-07-04)


### Features

* Add change type for statistics ([#555](https://github.com/RomRider/apexcharts-card/issues/555)) ([608fbe5](https://github.com/RomRider/apexcharts-card/commit/608fbe577672752177a9b000c692e120b844f9f3)), closes [#552](https://github.com/RomRider/apexcharts-card/issues/552)
* **statistics:** add weekly statistics period ([#680](https://github.com/RomRider/apexcharts-card/issues/680)) ([e923126](https://github.com/RomRider/apexcharts-card/commit/e923126d162b49a344a673df8cd413078d48adf0))
* support for server time ([55c8f97](https://github.com/RomRider/apexcharts-card/commit/55c8f9720bd3ddcf37a7a9f8c8f9d4609bc1c728)), closes [#709](https://github.com/RomRider/apexcharts-card/issues/709) [#579](https://github.com/RomRider/apexcharts-card/issues/579)

### [2.0.4](https://github.com/RomRider/apexcharts-card/compare/v2.0.3...v2.0.4) (2023-04-02)


### Bug Fixes

* actually really fix the issue with HA 2023.4 beta and above ([972f2c0](https://github.com/RomRider/apexcharts-card/commit/972f2c0150df923790cf30108ab90fed46db482f)), closes [#529](https://github.com/RomRider/apexcharts-card/issues/529)
* extra space at bottom because of the card's action-handler ([533a784](https://github.com/RomRider/apexcharts-card/commit/533a7842d191733a8b2d541c34f91445dcf8661f))

### [2.0.4-dev.1](https://github.com/RomRider/apexcharts-card/compare/v2.0.3...v2.0.4-dev.1) (2023-04-02)


### Bug Fixes

* actually really fix the issue with HA 2023.4 beta and above ([972f2c0](https://github.com/RomRider/apexcharts-card/commit/972f2c0150df923790cf30108ab90fed46db482f)), closes [#529](https://github.com/RomRider/apexcharts-card/issues/529)
* extra space at bottom because of the card's action-handler ([533a784](https://github.com/RomRider/apexcharts-card/commit/533a7842d191733a8b2d541c34f91445dcf8661f))

### [2.0.3](https://github.com/RomRider/apexcharts-card/compare/v2.0.2...v2.0.3) (2023-04-02)


### Bug Fixes

* card broken with HA 2023.4.0bXX and above ([e1aaf69](https://github.com/RomRider/apexcharts-card/commit/e1aaf691aee8bb4e8c8b75eb3fb301d1c31d20b6)), closes [#527](https://github.com/RomRider/apexcharts-card/issues/527)

### [2.0.3-dev.1](https://github.com/RomRider/apexcharts-card/compare/v2.0.2...v2.0.3-dev.1) (2023-04-02)


### Bug Fixes

* card broken with HA 2023.4.0bXX and above ([e1aaf69](https://github.com/RomRider/apexcharts-card/commit/e1aaf691aee8bb4e8c8b75eb3fb301d1c31d20b6)), closes [#527](https://github.com/RomRider/apexcharts-card/issues/527)

### [2.0.2](https://github.com/RomRider/apexcharts-card/compare/v2.0.1...v2.0.2) (2022-12-08)


### Bug Fixes

* Home Assistant API deprecation warning ([1449c7f](https://github.com/RomRider/apexcharts-card/commit/1449c7fab66cc65b3dc2c567184f57e0f2f67f76)), closes [#417](https://github.com/RomRider/apexcharts-card/issues/417)

### [2.0.2-dev.1](https://github.com/RomRider/apexcharts-card/compare/v2.0.1...v2.0.2-dev.1) (2022-11-04)


### Bug Fixes

* Home Assistant API deprecation warning ([1449c7f](https://github.com/RomRider/apexcharts-card/commit/1449c7fab66cc65b3dc2c567184f57e0f2f67f76)), closes [#417](https://github.com/RomRider/apexcharts-card/issues/417)

### [2.0.1](https://github.com/RomRider/apexcharts-card/compare/v2.0.0...v2.0.1) (2022-04-24)


### Bug Fixes

* Friendly name wouldn't display anymore ([ef38724](https://github.com/RomRider/apexcharts-card/commit/ef38724124011b8d2110cb3eb7f7963ea753e2c3))

## [2.0.0](https://github.com/RomRider/apexcharts-card/compare/v1.10.0...v2.0.0) (2022-04-23)


### ⚠ BREAKING CHANGES

* `extend_to_end` has been removed and replaced by `extend_to` with support for `now` and `end`.

### Features

* `extend_to` replaces `extend_to_end` with new options ([4bb1dd2](https://github.com/RomRider/apexcharts-card/commit/4bb1dd2464927c1dea66d422474cacaef7c89a16)), closes [#318](https://github.com/RomRider/apexcharts-card/issues/318)
* add state type to long term statistics ([#329](https://github.com/RomRider/apexcharts-card/issues/329)) ([3fad4f0](https://github.com/RomRider/apexcharts-card/commit/3fad4f05cb8bcd95f33ba8426ccb21e61c6e42fe))
* Apply a `time_delta` to all the datapoints of your serie ([435e381](https://github.com/RomRider/apexcharts-card/commit/435e381ceeb467261501bf471010ac3c029064c5)), closes [#277](https://github.com/RomRider/apexcharts-card/issues/277)
* display only the min or max extrema ([3db982b](https://github.com/RomRider/apexcharts-card/commit/3db982b88ea7d3568f253e63fb7626cc3153c7ad)), closes [#319](https://github.com/RomRider/apexcharts-card/issues/319)
* follow Home Assistant number format ([9204de2](https://github.com/RomRider/apexcharts-card/commit/9204de2578b9310d1ea2276d2b4118292404b2dd)), closes [#307](https://github.com/RomRider/apexcharts-card/issues/307)
* support actions on the title with `title_actions` ([a9f406e](https://github.com/RomRider/apexcharts-card/commit/a9f406ed8fd4b873825def74774df6dc672f8639)), closes [#323](https://github.com/RomRider/apexcharts-card/issues/323)
* Support for HA long-term statistics ([#208](https://github.com/RomRider/apexcharts-card/issues/208)) ([29aaa7c](https://github.com/RomRider/apexcharts-card/commit/29aaa7c1763f5f50196ae3ad4ab04666a7d60e98)), closes [#308](https://github.com/RomRider/apexcharts-card/issues/308)


### Bug Fixes

* `last_updated` date format was not following the configuration ([3dd4904](https://github.com/RomRider/apexcharts-card/commit/3dd4904a72b55cba94a3951a83dc2bd0d7caee09))
* `update_interval` was broken ([31d2fb7](https://github.com/RomRider/apexcharts-card/commit/31d2fb770555d0ec58d03de89bc0b4512ed03f68))
* annotations with time were not following the time format configuration ([5d08853](https://github.com/RomRider/apexcharts-card/commit/5d088532f933991ccdf3c8b876ba8c921fe5f233))
* another caching issue with statistics ([b93ee75](https://github.com/RomRider/apexcharts-card/commit/b93ee75148e55dfa591d1987c5eee44b3f4314b6))
* caching issue for statistics ([8daff2f](https://github.com/RomRider/apexcharts-card/commit/8daff2ff7b70a1973ff7fb154f56ea7492c7b922))
* hidden by default would not work without a name ([9c75ce8](https://github.com/RomRider/apexcharts-card/commit/9c75ce89dfdf59ed72c3235d8be6d7c501b50ff5)), closes [#280](https://github.com/RomRider/apexcharts-card/issues/280)
* last caching issue with statistics ([2e528f7](https://github.com/RomRider/apexcharts-card/commit/2e528f77f974a2b5b68ef89725311d70fbf35a0e))
* median function fails if it receives an empty table ([#316](https://github.com/RomRider/apexcharts-card/issues/316)) ([12f8d2e](https://github.com/RomRider/apexcharts-card/commit/12f8d2edb9cd8cb7ba56c30af65b3372aa242624))
* Support for fire-dom-event with browser-mod ([3dc9625](https://github.com/RomRider/apexcharts-card/commit/3dc962522d1e776202acea8be7e2b2dafe1fdd23)), closes [#196](https://github.com/RomRider/apexcharts-card/issues/196)
* Update apexcharts.js to the the latest version ([dd0bf6f](https://github.com/RomRider/apexcharts-card/commit/dd0bf6f03405e41be3dc9efdebb95d265f27ea63))

## [2.0.0-dev.8](https://github.com/RomRider/apexcharts-card/compare/v2.0.0-dev.7...v2.0.0-dev.8) (2022-04-23)


### Features

* support actions on the title with `title_actions` ([a9f406e](https://github.com/RomRider/apexcharts-card/commit/a9f406ed8fd4b873825def74774df6dc672f8639)), closes [#323](https://github.com/RomRider/apexcharts-card/issues/323)

## [2.0.0-dev.7](https://github.com/RomRider/apexcharts-card/compare/v2.0.0-dev.6...v2.0.0-dev.7) (2022-04-22)


### Features

* add state type to long term statistics ([#329](https://github.com/RomRider/apexcharts-card/issues/329)) ([3fad4f0](https://github.com/RomRider/apexcharts-card/commit/3fad4f05cb8bcd95f33ba8426ccb21e61c6e42fe))

## [2.0.0-dev.6](https://github.com/RomRider/apexcharts-card/compare/v2.0.0-dev.5...v2.0.0-dev.6) (2022-04-22)


### Bug Fixes

* last caching issue with statistics ([2e528f7](https://github.com/RomRider/apexcharts-card/commit/2e528f77f974a2b5b68ef89725311d70fbf35a0e))

## [2.0.0-dev.5](https://github.com/RomRider/apexcharts-card/compare/v2.0.0-dev.4...v2.0.0-dev.5) (2022-04-22)


### Bug Fixes

* another caching issue with statistics ([b93ee75](https://github.com/RomRider/apexcharts-card/commit/b93ee75148e55dfa591d1987c5eee44b3f4314b6))

## [2.0.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v2.0.0-dev.3...v2.0.0-dev.4) (2022-04-22)


### Bug Fixes

* caching issue for statistics ([8daff2f](https://github.com/RomRider/apexcharts-card/commit/8daff2ff7b70a1973ff7fb154f56ea7492c7b922))

## [2.0.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v2.0.0-dev.2...v2.0.0-dev.3) (2022-04-22)


### Features

* Support for HA long-term statistics ([#208](https://github.com/RomRider/apexcharts-card/issues/208)) ([29aaa7c](https://github.com/RomRider/apexcharts-card/commit/29aaa7c1763f5f50196ae3ad4ab04666a7d60e98)), closes [#308](https://github.com/RomRider/apexcharts-card/issues/308)

## [2.0.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v2.0.0-dev.1...v2.0.0-dev.2) (2022-04-21)


### Features

* Apply a `time_delta` to all the datapoints of your serie ([435e381](https://github.com/RomRider/apexcharts-card/commit/435e381ceeb467261501bf471010ac3c029064c5)), closes [#277](https://github.com/RomRider/apexcharts-card/issues/277)

## [2.0.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.11.0-dev.1...v2.0.0-dev.1) (2022-04-20)


### ⚠ BREAKING CHANGES

* `extend_to_end` has been removed and replaced by `extend_to` with support for `now` and `end`.

### Features

* `extend_to` replaces `extend_to_end` with new options ([4bb1dd2](https://github.com/RomRider/apexcharts-card/commit/4bb1dd2464927c1dea66d422474cacaef7c89a16)), closes [#318](https://github.com/RomRider/apexcharts-card/issues/318)


### Bug Fixes

* `last_updated` date format was not following the configuration ([3dd4904](https://github.com/RomRider/apexcharts-card/commit/3dd4904a72b55cba94a3951a83dc2bd0d7caee09))
* annotations with time were not following the time format configuration ([5d08853](https://github.com/RomRider/apexcharts-card/commit/5d088532f933991ccdf3c8b876ba8c921fe5f233))
* hidden by default would not work without a name ([9c75ce8](https://github.com/RomRider/apexcharts-card/commit/9c75ce89dfdf59ed72c3235d8be6d7c501b50ff5)), closes [#280](https://github.com/RomRider/apexcharts-card/issues/280)

## [1.11.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.10.1-dev.2...v1.11.0-dev.1) (2022-04-09)


### Features

* display only the min or max extrema ([3db982b](https://github.com/RomRider/apexcharts-card/commit/3db982b88ea7d3568f253e63fb7626cc3153c7ad)), closes [#319](https://github.com/RomRider/apexcharts-card/issues/319)
* follow Home Assistant number format ([9204de2](https://github.com/RomRider/apexcharts-card/commit/9204de2578b9310d1ea2276d2b4118292404b2dd)), closes [#307](https://github.com/RomRider/apexcharts-card/issues/307)


### Bug Fixes

* median function fails if it receives an empty table ([#316](https://github.com/RomRider/apexcharts-card/issues/316)) ([12f8d2e](https://github.com/RomRider/apexcharts-card/commit/12f8d2edb9cd8cb7ba56c30af65b3372aa242624))
* Update apexcharts.js to the the latest version ([dd0bf6f](https://github.com/RomRider/apexcharts-card/commit/dd0bf6f03405e41be3dc9efdebb95d265f27ea63))

### [1.10.1-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.10.1-dev.1...v1.10.1-dev.2) (2021-11-04)


### Bug Fixes

* `update_interval` was broken ([31d2fb7](https://github.com/RomRider/apexcharts-card/commit/31d2fb770555d0ec58d03de89bc0b4512ed03f68))

### [1.10.1-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.10.0...v1.10.1-dev.1) (2021-10-24)


### Bug Fixes

* Support for fire-dom-event with browser-mod ([3dc9625](https://github.com/RomRider/apexcharts-card/commit/3dc962522d1e776202acea8be7e2b2dafe1fdd23)), closes [#196](https://github.com/RomRider/apexcharts-card/issues/196)

## [1.10.0](https://github.com/RomRider/apexcharts-card/compare/v1.9.0...v1.10.0) (2021-10-24)


### Features

* uses the time format defined in Home Assistant user profile ([78df800](https://github.com/RomRider/apexcharts-card/commit/78df800f32004c180fb3bebfb4d35ac82858f3c2)), closes [#213](https://github.com/RomRider/apexcharts-card/issues/213)
* **yaxis:** Align the extremas to the closest `align_to`  value. ([a46c812](https://github.com/RomRider/apexcharts-card/commit/a46c8127d8252fcadcb212ee7d2ee28d36c8d03a)), closes [#170](https://github.com/RomRider/apexcharts-card/issues/170)
* pie/donut now shows the value of the serie instead of the percentage. Old behavior with `datalabels: percent` ([7591aba](https://github.com/RomRider/apexcharts-card/commit/7591aba03e0c8d001b4883456b21fc948ea5cfe4))
* **actions:** `header_actions` support for actions in header ([#171](https://github.com/RomRider/apexcharts-card/issues/171)) ([bd6a497](https://github.com/RomRider/apexcharts-card/commit/bd6a49791ec583b894f72ce42ec33b223d63e38e)), closes [#61](https://github.com/RomRider/apexcharts-card/issues/61)
* display the chart's last update time using `last_updated` ([2dd84ff](https://github.com/RomRider/apexcharts-card/commit/2dd84ffdac637c753ae96f30029190cc99747b8d))
* **yaxis:** Set the number of decimals shown on the yaxis. Deprecate `y_axis_precision`. ([33fc474](https://github.com/RomRider/apexcharts-card/commit/33fc4746c185112d3838759ca19d1c274f4fa34a)), closes [#164](https://github.com/RomRider/apexcharts-card/issues/164)
* update from lit-html/lit-element to lit ([5a7d944](https://github.com/RomRider/apexcharts-card/commit/5a7d944b6fccc76f046fe940e21af4bdec09d28b))
* **yaxis:** `id` and `yaxis_id` no longer needed with only 1 yaxis defined ([e5e8904](https://github.com/RomRider/apexcharts-card/commit/e5e89040620ca9df43dd38d5e267ce2b70386bc2))


### Bug Fixes

* color_threshold would sometimes render weirdly ([d7063a5](https://github.com/RomRider/apexcharts-card/commit/d7063a5462bc6e949c477a423b0a57c80dd172ac)), closes [#177](https://github.com/RomRider/apexcharts-card/issues/177)
* extremas would not display with offset applied on series ([4d7d77a](https://github.com/RomRider/apexcharts-card/commit/4d7d77a92919234b81e8d830e3f9e3d7dcaf7caa)), closes [#177](https://github.com/RomRider/apexcharts-card/issues/177)
* Floats were not truncated properly for radialBar ([0c789ff](https://github.com/RomRider/apexcharts-card/commit/0c789ffc27be47b459bf22875e5a0b5243249197)), closes [#174](https://github.com/RomRider/apexcharts-card/issues/174)
* history data could be modified in some rare cases ([d38fd6e](https://github.com/RomRider/apexcharts-card/commit/d38fd6e0c3531dcd225e856ca90c57026c9049ab))
* Ignore recorder when not required ([c28a7a6](https://github.com/RomRider/apexcharts-card/commit/c28a7a682b9bb0943fd82a24f525c87801fbe4f5)), closes [#169](https://github.com/RomRider/apexcharts-card/issues/169)
* the hass object could sometimes be null ([ff27baf](https://github.com/RomRider/apexcharts-card/commit/ff27baff63845dbdaa0cbd90bd71252fa5cb27e1)), closes [#191](https://github.com/RomRider/apexcharts-card/issues/191)
* When recorder was skipped, attributes were ignored ([15e5372](https://github.com/RomRider/apexcharts-card/commit/15e537213c9ab9b16ed9d0e3734d80def769fbde))
* **yaxis:** auto scale was not taking the serie's offset into account ([f82f7e0](https://github.com/RomRider/apexcharts-card/commit/f82f7e0c1c74311fa3cc1b9d333d7a050b0304ec)), closes [#172](https://github.com/RomRider/apexcharts-card/issues/172)
* **yaxis:** Fixed + unfixed bounds on the same yaxis is now working ([f7e4668](https://github.com/RomRider/apexcharts-card/commit/f7e46688fc3b891981854d1632c513fa9dac4773))


### Documentation

* `align_to` description update ([4471469](https://github.com/RomRider/apexcharts-card/commit/447146951dd7e1a758ca4a0f7b5d85c13970d4c0))
* Missing doc for `last_updated` ([93ae54a](https://github.com/RomRider/apexcharts-card/commit/93ae54abb60cc8c0e9e1011f97d8978de7f0b7bd))

## [1.10.0-dev.7](https://github.com/RomRider/apexcharts-card/compare/v1.10.0-dev.6...v1.10.0-dev.7) (2021-10-24)


### Features

* uses the time format defined in Home Assistant user profile ([78df800](https://github.com/RomRider/apexcharts-card/commit/78df800f32004c180fb3bebfb4d35ac82858f3c2)), closes [#213](https://github.com/RomRider/apexcharts-card/issues/213)


### Bug Fixes

* history data could be modified in some rare cases ([d38fd6e](https://github.com/RomRider/apexcharts-card/commit/d38fd6e0c3531dcd225e856ca90c57026c9049ab))
* the hass object could sometimes be null ([ff27baf](https://github.com/RomRider/apexcharts-card/commit/ff27baff63845dbdaa0cbd90bd71252fa5cb27e1)), closes [#191](https://github.com/RomRider/apexcharts-card/issues/191)

## [1.10.0-dev.6](https://github.com/RomRider/apexcharts-card/compare/v1.10.0-dev.5...v1.10.0-dev.6) (2021-07-12)


### Bug Fixes

* extremas would not display with offset applied on series ([4d7d77a](https://github.com/RomRider/apexcharts-card/commit/4d7d77a92919234b81e8d830e3f9e3d7dcaf7caa)), closes [#177](https://github.com/RomRider/apexcharts-card/issues/177)

## [1.10.0-dev.5](https://github.com/RomRider/apexcharts-card/compare/v1.10.0-dev.4...v1.10.0-dev.5) (2021-07-12)


### Bug Fixes

* color_threshold would sometimes render weirdly ([d7063a5](https://github.com/RomRider/apexcharts-card/commit/d7063a5462bc6e949c477a423b0a57c80dd172ac)), closes [#177](https://github.com/RomRider/apexcharts-card/issues/177)
* Floats were not truncated properly for radialBar ([0c789ff](https://github.com/RomRider/apexcharts-card/commit/0c789ffc27be47b459bf22875e5a0b5243249197)), closes [#174](https://github.com/RomRider/apexcharts-card/issues/174)


### Documentation

* `align_to` description update ([4471469](https://github.com/RomRider/apexcharts-card/commit/447146951dd7e1a758ca4a0f7b5d85c13970d4c0))

## [1.10.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v1.10.0-dev.3...v1.10.0-dev.4) (2021-07-04)


### Features

* **yaxis:** Align the extremas to the closest `align_to`  value. ([a46c812](https://github.com/RomRider/apexcharts-card/commit/a46c8127d8252fcadcb212ee7d2ee28d36c8d03a)), closes [#170](https://github.com/RomRider/apexcharts-card/issues/170)

## [1.10.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.10.0-dev.2...v1.10.0-dev.3) (2021-07-04)


### Features

* pie/donut now shows the value of the serie instead of the percentage. Old behavior with `datalabels: percent` ([7591aba](https://github.com/RomRider/apexcharts-card/commit/7591aba03e0c8d001b4883456b21fc948ea5cfe4))


### Bug Fixes

* When recorder was skipped, attributes were ignored ([15e5372](https://github.com/RomRider/apexcharts-card/commit/15e537213c9ab9b16ed9d0e3734d80def769fbde))

## [1.10.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.10.0-dev.1...v1.10.0-dev.2) (2021-07-04)


### Features

* **actions:** `header_actions` support for actions in header ([#171](https://github.com/RomRider/apexcharts-card/issues/171)) ([bd6a497](https://github.com/RomRider/apexcharts-card/commit/bd6a49791ec583b894f72ce42ec33b223d63e38e)), closes [#61](https://github.com/RomRider/apexcharts-card/issues/61)
* display the chart's last update time using `last_updated` ([2dd84ff](https://github.com/RomRider/apexcharts-card/commit/2dd84ffdac637c753ae96f30029190cc99747b8d))
* **yaxis:** Set the number of decimals shown on the yaxis. Deprecate `y_axis_precision`. ([33fc474](https://github.com/RomRider/apexcharts-card/commit/33fc4746c185112d3838759ca19d1c274f4fa34a)), closes [#164](https://github.com/RomRider/apexcharts-card/issues/164)
* update from lit-html/lit-element to lit ([5a7d944](https://github.com/RomRider/apexcharts-card/commit/5a7d944b6fccc76f046fe940e21af4bdec09d28b))


### Bug Fixes

* Ignore recorder when not required ([c28a7a6](https://github.com/RomRider/apexcharts-card/commit/c28a7a682b9bb0943fd82a24f525c87801fbe4f5)), closes [#169](https://github.com/RomRider/apexcharts-card/issues/169)
* **yaxis:** auto scale was not taking the serie's offset into account ([f82f7e0](https://github.com/RomRider/apexcharts-card/commit/f82f7e0c1c74311fa3cc1b9d333d7a050b0304ec)), closes [#172](https://github.com/RomRider/apexcharts-card/issues/172)


### Documentation

* Missing doc for `last_updated` ([93ae54a](https://github.com/RomRider/apexcharts-card/commit/93ae54abb60cc8c0e9e1011f97d8978de7f0b7bd))

## [1.10.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.9.1-dev.1...v1.10.0-dev.1) (2021-05-25)


### Features

* **yaxis:** `id` and `yaxis_id` no longer needed with only 1 yaxis defined ([e5e8904](https://github.com/RomRider/apexcharts-card/commit/e5e89040620ca9df43dd38d5e267ce2b70386bc2))

### [1.9.1-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.9.0...v1.9.1-dev.1) (2021-05-25)


### Bug Fixes

* **yaxis:** Fixed + unfixed bounds on the same yaxis is now working ([f7e4668](https://github.com/RomRider/apexcharts-card/commit/f7e46688fc3b891981854d1632c513fa9dac4773))

## [1.9.0](https://github.com/RomRider/apexcharts-card/compare/v1.8.2...v1.9.0) (2021-05-24)


### Features

* make datagenerator async ([#157](https://github.com/RomRider/apexcharts-card/issues/157)) ([b9049fc](https://github.com/RomRider/apexcharts-card/commit/b9049fcd70ba633575127a86de6982d6f46d8831))
* Native multi y-axis support with auto-scale ([#160](https://github.com/RomRider/apexcharts-card/issues/160)) ([e08aa14](https://github.com/RomRider/apexcharts-card/commit/e08aa14416fd1724fc379a7b0d991e6ed53cdc03)), closes [#158](https://github.com/RomRider/apexcharts-card/issues/158)
* soft bounds and extended bounds for yaxis min/max ([#161](https://github.com/RomRider/apexcharts-card/issues/161)) ([c57278b](https://github.com/RomRider/apexcharts-card/commit/c57278b59becef474264d2e0bf76a18a312a377f))
* **apex_config:** Support for functions in `apex_config` ([cebc03b](https://github.com/RomRider/apexcharts-card/commit/cebc03b53a0bbf3131076422dd11660d440209dd)), closes [#81](https://github.com/RomRider/apexcharts-card/issues/81)


### Bug Fixes

* always get all state changes, not only significant ones ([3b2f9c8](https://github.com/RomRider/apexcharts-card/commit/3b2f9c8670d55324019901556d1c50775807f505))
* graph might be wrong when using `attributes` if value was 0 ([e200323](https://github.com/RomRider/apexcharts-card/commit/e2003234f0b5a620c60a4a3e197c3b9577fd51ba))
* Support for custom views config parameters (`view_layout`) ([76a8023](https://github.com/RomRider/apexcharts-card/commit/76a8023a12fbdf920309ed1751e1e8d488e90ca1))
* yaxis would always start at 0 ([50ef9e4](https://github.com/RomRider/apexcharts-card/commit/50ef9e41d563d981b408382615c0939b7f330469)), closes [#158](https://github.com/RomRider/apexcharts-card/issues/158)
* **group_by:** `group_by` reporting erronerous values for the first bucket of data ([8303b84](https://github.com/RomRider/apexcharts-card/commit/8303b84a935ed3f1a7c72642777052c487003e0f)), closes [#110](https://github.com/RomRider/apexcharts-card/issues/110)
* **group_by:** When group_by was used with lines, the end of the chart was showing an empty slot (display bug only) ([0163f9e](https://github.com/RomRider/apexcharts-card/commit/0163f9ebbf511c809573c4f567a4e67750a99e38))

## [1.9.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v1.9.0-dev.3...v1.9.0-dev.4) (2021-05-24)


### Features

* soft bounds and extended bounds for yaxis min/max ([#161](https://github.com/RomRider/apexcharts-card/issues/161)) ([c57278b](https://github.com/RomRider/apexcharts-card/commit/c57278b59becef474264d2e0bf76a18a312a377f))

## [1.9.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.9.0-dev.2...v1.9.0-dev.3) (2021-05-24)


### Bug Fixes

* yaxis would always start at 0 ([50ef9e4](https://github.com/RomRider/apexcharts-card/commit/50ef9e41d563d981b408382615c0939b7f330469)), closes [#158](https://github.com/RomRider/apexcharts-card/issues/158)

## [1.9.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.9.0-dev.1...v1.9.0-dev.2) (2021-05-24)


### Features

* make datagenerator async ([#157](https://github.com/RomRider/apexcharts-card/issues/157)) ([b9049fc](https://github.com/RomRider/apexcharts-card/commit/b9049fcd70ba633575127a86de6982d6f46d8831))
* Native multi y-axis support with auto-scale ([#160](https://github.com/RomRider/apexcharts-card/issues/160)) ([e08aa14](https://github.com/RomRider/apexcharts-card/commit/e08aa14416fd1724fc379a7b0d991e6ed53cdc03)), closes [#158](https://github.com/RomRider/apexcharts-card/issues/158)


### Bug Fixes

* Support for custom views config parameters (`view_layout`) ([76a8023](https://github.com/RomRider/apexcharts-card/commit/76a8023a12fbdf920309ed1751e1e8d488e90ca1))

## [1.9.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.8.3-dev.3...v1.9.0-dev.1) (2021-03-21)


### Features

* **apex_config:** Support for functions in `apex_config` ([cebc03b](https://github.com/RomRider/apexcharts-card/commit/cebc03b53a0bbf3131076422dd11660d440209dd)), closes [#81](https://github.com/RomRider/apexcharts-card/issues/81)

### [1.8.3-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.8.3-dev.2...v1.8.3-dev.3) (2021-03-21)


### Bug Fixes

* always get all state changes, not only significant ones ([3b2f9c8](https://github.com/RomRider/apexcharts-card/commit/3b2f9c8670d55324019901556d1c50775807f505))

### [1.8.3-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.8.3-dev.1...v1.8.3-dev.2) (2021-03-20)


### Bug Fixes

* **group_by:** `group_by` reporting erronerous values for the first bucket of data ([8303b84](https://github.com/RomRider/apexcharts-card/commit/8303b84a935ed3f1a7c72642777052c487003e0f)), closes [#110](https://github.com/RomRider/apexcharts-card/issues/110)
* **group_by:** When group_by was used with lines, the end of the chart was showing an empty slot (display bug only) ([0163f9e](https://github.com/RomRider/apexcharts-card/commit/0163f9ebbf511c809573c4f567a4e67750a99e38))

### [1.8.3-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.8.2...v1.8.3-dev.1) (2021-03-09)


### Bug Fixes

* graph might be wrong when using `attributes` if value was 0 ([e200323](https://github.com/RomRider/apexcharts-card/commit/e2003234f0b5a620c60a4a3e197c3b9577fd51ba))

### [1.8.2](https://github.com/RomRider/apexcharts-card/compare/v1.8.1...v1.8.2) (2021-03-06)


### Bug Fixes

* Chart not displayed properly or at all with layout-card ([e5840fb](https://github.com/RomRider/apexcharts-card/commit/e5840fb60c1121a237daa189453e2cb1d3bb22f9)), closes [#121](https://github.com/RomRider/apexcharts-card/issues/121)

### [1.8.1](https://github.com/RomRider/apexcharts-card/compare/v1.8.0...v1.8.1) (2021-03-04)


### Bug Fixes

* **in_header:** `after/before_now` not working with offsetted series ([960b43c](https://github.com/RomRider/apexcharts-card/commit/960b43cd1a183230e89c6d63baa07723b5acf0ec))

## [1.8.0](https://github.com/RomRider/apexcharts-card/compare/v1.7.1...v1.8.0) (2021-03-03)


### Features

* **brush:** Support for a timeframe selection chart ([#102](https://github.com/RomRider/apexcharts-card/issues/102)) ([c8dedf7](https://github.com/RomRider/apexcharts-card/commit/c8dedf7de96171e8332cdcc9269eccc70043eb1e))
* **extremas:** Display the time on top of your extremas ([#97](https://github.com/RomRider/apexcharts-card/issues/97)) ([d127b37](https://github.com/RomRider/apexcharts-card/commit/d127b376fb1c3931c5c9c95129347144eb5ea791))
* **group_by:** With `start_with_last`, each bucket will start with the last data from the previous bucket ([8669411](https://github.com/RomRider/apexcharts-card/commit/8669411142a320139b1bed6200e670d173a47bac))
* **header:** Standard header title home-assistant format using `standard_format` ([35c5391](https://github.com/RomRider/apexcharts-card/commit/35c5391c0425c1d195f2f35b885aa8689c02129d)), closes [#35](https://github.com/RomRider/apexcharts-card/issues/35)
* **series.show:** Display the value before/after the current time in the header ([2855403](https://github.com/RomRider/apexcharts-card/commit/2855403ee1c025326015793367f0ff3b34dc8827)), closes [#86](https://github.com/RomRider/apexcharts-card/issues/86)
* **series.show:** Hide the name of a serie in the header ([b20133d](https://github.com/RomRider/apexcharts-card/commit/b20133df7827abbf8ef0954bfaefbef39840f2f3)), closes [#111](https://github.com/RomRider/apexcharts-card/issues/111)
* **series.show:** Hide the offset from the name of the serie ([a46c3f0](https://github.com/RomRider/apexcharts-card/commit/a46c3f06982056f5349a0f4f31427b246401b407)), closes [#112](https://github.com/RomRider/apexcharts-card/issues/112)
* **span:** Add support for `isoWeek` ([7abc750](https://github.com/RomRider/apexcharts-card/commit/7abc75027600de2ee937ad07e510a78aa28125ed)), closes [#106](https://github.com/RomRider/apexcharts-card/issues/106)
* Bring back `hours_12` from the dead ([676bdb7](https://github.com/RomRider/apexcharts-card/commit/676bdb7f3b60a39dc4eeb4fa0a424f15648315db))


### Bug Fixes

* `group_by` would sometimes not work with `data_generator` ([cfa6871](https://github.com/RomRider/apexcharts-card/commit/cfa687146628518677f6ec625d4561fb0cafac93))
* header units for `radialBar` ([6883a8f](https://github.com/RomRider/apexcharts-card/commit/6883a8f1913ee9935b862eb28b75a6fe5229e2f5)), closes [#105](https://github.com/RomRider/apexcharts-card/issues/105)
* **start_with_last:** `start_with_last` would sometimes throw ([f5aa2e3](https://github.com/RomRider/apexcharts-card/commit/f5aa2e36e1d792a5c73fb69a028ad5e71e9a0d68))
* bug introduced by 591add ([b9c9297](https://github.com/RomRider/apexcharts-card/commit/b9c929727182e2101fb3747e0e82982450ffd9f6))
* Display non inverted numbers in legend/tooltip/datalabels when `invert: true` ([331fe04](https://github.com/RomRider/apexcharts-card/commit/331fe044f7c7cd1ed324c0be24a4469fcdfaaad1)), closes [#96](https://github.com/RomRider/apexcharts-card/issues/96)
* extremas was not working with `invert: true` ([4d06ef6](https://github.com/RomRider/apexcharts-card/commit/4d06ef68b72cd99777b18f6c7b7e0aa32cf32c1c)), closes [#96](https://github.com/RomRider/apexcharts-card/issues/96)
* Optimize `extend_to_end` when used with `group_by` ([591add8](https://github.com/RomRider/apexcharts-card/commit/591add86317a288c8935daa2264ae831ca392d29))
* Support for card-mod >= 3.0 ([8348119](https://github.com/RomRider/apexcharts-card/commit/8348119be517ad3cc90bbce1821d0e2d836fa2ed)), closes [#104](https://github.com/RomRider/apexcharts-card/issues/104)
* **extremas:** Multi y-axis support ([#98](https://github.com/RomRider/apexcharts-card/issues/98)) ([5c7d742](https://github.com/RomRider/apexcharts-card/commit/5c7d7424e100b5a3327d94800e36f31e9931cfe8)), closes [#89](https://github.com/RomRider/apexcharts-card/issues/89)

## [1.8.0-dev.7](https://github.com/RomRider/apexcharts-card/compare/v1.8.0-dev.6...v1.8.0-dev.7) (2021-03-02)


### Features

* **series.show:** Hide the name of a serie in the header ([b20133d](https://github.com/RomRider/apexcharts-card/commit/b20133df7827abbf8ef0954bfaefbef39840f2f3)), closes [#111](https://github.com/RomRider/apexcharts-card/issues/111)
* **series.show:** Hide the offset from the name of the serie ([a46c3f0](https://github.com/RomRider/apexcharts-card/commit/a46c3f06982056f5349a0f4f31427b246401b407)), closes [#112](https://github.com/RomRider/apexcharts-card/issues/112)

## [1.8.0-dev.6](https://github.com/RomRider/apexcharts-card/compare/v1.8.0-dev.5...v1.8.0-dev.6) (2021-03-01)


### Bug Fixes

* header units for `radialBar` ([6883a8f](https://github.com/RomRider/apexcharts-card/commit/6883a8f1913ee9935b862eb28b75a6fe5229e2f5)), closes [#105](https://github.com/RomRider/apexcharts-card/issues/105)

## [1.8.0-dev.5](https://github.com/RomRider/apexcharts-card/compare/v1.8.0-dev.4...v1.8.0-dev.5) (2021-03-01)


### Features

* **group_by:** With `start_with_last`, each bucket will start with the last data from the previous bucket ([8669411](https://github.com/RomRider/apexcharts-card/commit/8669411142a320139b1bed6200e670d173a47bac))
* **span:** Add support for `isoWeek` ([7abc750](https://github.com/RomRider/apexcharts-card/commit/7abc75027600de2ee937ad07e510a78aa28125ed)), closes [#106](https://github.com/RomRider/apexcharts-card/issues/106)


### Bug Fixes

* **start_with_last:** `start_with_last` would sometimes throw ([f5aa2e3](https://github.com/RomRider/apexcharts-card/commit/f5aa2e36e1d792a5c73fb69a028ad5e71e9a0d68))
* bug introduced by 591add ([b9c9297](https://github.com/RomRider/apexcharts-card/commit/b9c929727182e2101fb3747e0e82982450ffd9f6))
* Optimize `extend_to_end` when used with `group_by` ([591add8](https://github.com/RomRider/apexcharts-card/commit/591add86317a288c8935daa2264ae831ca392d29))

## [1.8.0-dev.4](https://github.com/RomRider/apexcharts-card/compare/v1.8.0-dev.3...v1.8.0-dev.4) (2021-02-26)


### Features

* **brush:** Support for a timeframe selection chart ([#102](https://github.com/RomRider/apexcharts-card/issues/102)) ([c8dedf7](https://github.com/RomRider/apexcharts-card/commit/c8dedf7de96171e8332cdcc9269eccc70043eb1e))
* **header:** Standard header title home-assistant format using `standard_format` ([35c5391](https://github.com/RomRider/apexcharts-card/commit/35c5391c0425c1d195f2f35b885aa8689c02129d)), closes [#35](https://github.com/RomRider/apexcharts-card/issues/35)


### Bug Fixes

* Support for card-mod >= 3.0 ([8348119](https://github.com/RomRider/apexcharts-card/commit/8348119be517ad3cc90bbce1821d0e2d836fa2ed)), closes [#104](https://github.com/RomRider/apexcharts-card/issues/104)

## [1.8.0-dev.3](https://github.com/RomRider/apexcharts-card/compare/v1.8.0-dev.2...v1.8.0-dev.3) (2021-02-23)


### Bug Fixes

* Display non inverted numbers in legend/tooltip/datalabels when `invert: true` ([331fe04](https://github.com/RomRider/apexcharts-card/commit/331fe044f7c7cd1ed324c0be24a4469fcdfaaad1)), closes [#96](https://github.com/RomRider/apexcharts-card/issues/96)

## [1.8.0-dev.2](https://github.com/RomRider/apexcharts-card/compare/v1.8.0-dev.1...v1.8.0-dev.2) (2021-02-23)


### Features

* **series.show:** Display the value before/after the current time in the header ([2855403](https://github.com/RomRider/apexcharts-card/commit/2855403ee1c025326015793367f0ff3b34dc8827)), closes [#86](https://github.com/RomRider/apexcharts-card/issues/86)
* Bring back `hours_12` from the dead ([676bdb7](https://github.com/RomRider/apexcharts-card/commit/676bdb7f3b60a39dc4eeb4fa0a424f15648315db))

## [1.8.0-dev.1](https://github.com/RomRider/apexcharts-card/compare/v1.7.1...v1.8.0-dev.1) (2021-02-18)


### Features

* **extremas:** Display the time on top of your extremas ([#97](https://github.com/RomRider/apexcharts-card/issues/97)) ([d127b37](https://github.com/RomRider/apexcharts-card/commit/d127b376fb1c3931c5c9c95129347144eb5ea791))


### Bug Fixes

* **extremas:** Multi y-axis support ([#98](https://github.com/RomRider/apexcharts-card/issues/98)) ([5c7d742](https://github.com/RomRider/apexcharts-card/commit/5c7d7424e100b5a3327d94800e36f31e9931cfe8)), closes [#89](https://github.com/RomRider/apexcharts-card/issues/89)
* extremas was not working with `invert: true` ([4d06ef6](https://github.com/RomRider/apexcharts-card/commit/4d06ef68b72cd99777b18f6c7b7e0aa32cf32c1c)), closes [#96](https://github.com/RomRider/apexcharts-card/issues/96)

### [1.7.1](https://github.com/RomRider/apexcharts-card/compare/v1.7.0...v1.7.1) (2021-02-17)


### Bug Fixes

* Disable support for colors with alpha channel ([#91](https://github.com/RomRider/apexcharts-card/issues/91)) ([522363a](https://github.com/RomRider/apexcharts-card/commit/522363aaa681777f53d744330355f46d9fa5042a)), closes [#90](https://github.com/RomRider/apexcharts-card/issues/90)
* **color_threshold:** Sometimes it would break the card ([65b5419](https://github.com/RomRider/apexcharts-card/commit/65b54191a2bd7ce03aaae97835043c4901e72fc7))

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
