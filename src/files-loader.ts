import * as fs from "fs"
import * as path from "path"
import {promisify} from "util"
import {loadMigrationFile} from "./migration-file"
import {Logger, Migration} from "./types"

const readDir = promisify(fs.readdir)

const isValidFile = (fileName: string) => /\.(sql|js)$/gi.test(fileName)

/**
 * Load the migration files and assert they are reasonably valid.
 *
 * 'Reasonably valid' in this case means obeying the file name and
 * consecutive ordering rules.
 *
 * No assertions are made about the validity of the SQL.
 */
export const loadMigrationFiles = async (
  directory: string,
  // tslint:disable-next-line no-empty
  log: Logger = () => {},
): Promise<Array<Migration>> => {
  log(`Loading migrations from: ${directory}`)

  const fileNames = await readDir(directory)
  log(`Found migration files: ${fileNames}`)

  if (fileNames == null) {
    return []
  }

  const migrationFiles = [
    path.join(__dirname, "migrations/0_create-migrations-table.sql"),
    ...fileNames.map((fileName) => path.resolve(directory, fileName)),
  ].filter(isValidFile)

  const unorderedMigrations = await Promise.all(
    migrationFiles.map(loadMigrationFile),
  )

  // Arrange in ID order
  const orderedMigrations = unorderedMigrations.sort((a, b) => a.id - b.id)

  validateIdsAreUnique(orderedMigrations)

  return orderedMigrations
}

function validateIdsAreUnique(migrations: Array<Migration>) {
  migrations.reduce((map, migration) => {
    if (Boolean(map[migration.id]))
      throw new Error(
        `Two migration files have the same id! ${map[migration.id].fileName} ${
          migration.fileName
        }`,
      )
    map[migration.id] = migration
    return map
  }, {} as {[key: number]: Migration})
}
