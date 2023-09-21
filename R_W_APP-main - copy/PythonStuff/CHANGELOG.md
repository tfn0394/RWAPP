# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.0.1] - 2021-10-18

### Added

- This CHANGELOG file to have a better logs of changes made.
- Getting date string to get better results of finding selected data along with time string.
- Handling of errors.

### Changed

- Start scraping table data from html doc into pandas.
- Rewrite "Ignoring Deprecations" methods.
- Improve project directory structure.
- Improved handling of finding time string.
- Improved handling of transforming data between formats using pandas instead of using String replace().
- Improved path handling using PathLib.
- Improved console readability.
- Improved directory and file cleanup.
- Changed how resolving path in FinalDataScrape.py in RunEachHour.py.
- Rewrite imports to be better optimize.
- Rewrite clean up of data containing non-relevant information.
- Rewrite how data headers are handle instead of String replace() to clean out the headers, just set data headers to
  known format.
- Fix typos.

### Removed

- Old method of making a json file from csv.