# Changelog

## 5.0.0

- Fetch latest upstream code, which includes a breaking change of going to `pg` version 8. See the [pg changelog](https://github.com/brianc/node-postgres/blob/master/CHANGELOG.md#pg800) for details.

## 4.1.4

- Export Migration type

## 4.1.3

- Add optional ssl parameter to type definition

## 4.0.2

- Fix detection of previously run migration scripts.

## 4.0.1

- Allow non-consecutive migration ids

## 4.0.0

- [BREAKING] Updated whole project to TypeScript
  - some types might differ, no functional change
  - 21a7ee6
- [BREAKING] Increase required Node.js version to v10
  - 24bf9b7
- [BREAKING] Ensure file extension includes `.`
  - b8ed85a
- [BREAKING] Implement advisory locks to manage concurrency
  - 73b5ade
- Optionally accept a `pg` client for database connections
  - ad81ed9 c246ad3
