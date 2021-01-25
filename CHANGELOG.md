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
