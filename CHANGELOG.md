# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.4.1]
 - update sharp 
 
## [1.4.0]
- support Hexo 4

## [1.3.3]
### Fixed
- crash when cache file is missing during cache clean

## [1.3.2]
### Updated
- updated dependencies

## [1.3.1]
### Fixed
- clash with `hexo-neat`,
  content placeholders now use base64-encoded path

## [1.3.0]
### Updated
- bluebird 3.5.3
- sharp to 0.21.x - colors and SVGs may slightly change

## [1.2.0]
### Updated
- `potrace` svg data URI is shorted and # characters are escaped
### Added
- `priority` configuration
- improved logging and more information with `--debug` flag

## [1.1.1]
### Fixed
- cache values by type

## [1.1.0]
### Added
- possibility to configure cache file name
- possibility to clean cache with `hexo clean`
- `color` type

## [1.0.0]
### Added
- Initial version published as `hexo-filter-lqip`
