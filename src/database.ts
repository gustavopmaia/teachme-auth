import { winstonLogger } from '@gustavopmaia/teachme-shared'
import { Logger } from 'winston'
import { config } from '@auth/config'
import { Sequelize } from 'sequelize'

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug')

export const sequelize = new Sequelize(`${config.MYSQL_DB}`, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
})

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate()
    log.info('AuthService MySQL database connection has been established successfully')
  } catch (error) {
    log.error('AuthService - Unable to connect to database.')
    log.log('error', 'AuthService databaseConnection() method error:', error)
  }
}
