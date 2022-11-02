import dotenv from "dotenv";
import { env } from "process";
import * as cmd from "./utils/CommandExecuter";

dotenv.config();

export function configurations() {
    return {
        host:                      process.env['HOST'],
        port:                      process.env['DB_PORT'],
        user:                      process.env['TEST_USERNAME'] || process.env['PRODUCTION_USERNAME'] || process.env['DEVELOPMENT_USERNAME'],
        password:                  process.env['TEST_PASSWORD'] || process.env['PRODUCTION_PASSWORD'] || process.env['DEVELOPMENT_PASSWORD'],
        database:                  process.env['DATABASE'],
        connectionLimit:           process.env['CONNECTION_LIMIT'],
        encryption_key:            process.env['ENCRYPTION_KEY'] || '',
        environment:               process.env['NODE_ENV'],
        server_port:               process.env['PORT'],
        migration:                 process.env['MIGRATION'],
        is_worker_pool_active:     process.env['WORKER_POOL_ENABLED'] === "0" ? process.env['NODE_ENV'] === 'production' ? process.env['WORKER_POOL_ENABLED'] = "1" : process.env['WORKER_POOL_ENABLED'] = "0" : process.env['WORKER_POOL_ENABLED'],
        os                   :     process.platform === 'darwin' ? 'MAC' : process.platform === 'linux' ? 'LINUX' : process.platform === 'win32' ? 'WINDOWS' : process.platform === 'freebsd' || process.platform === 'openbsd' || process.platform === 'sunos' ? 'UNIX' : 'UNKNOWN',
        socket_path          :     process.platform !== 'win32' ? cmd._mysqlSocket() : '',
        execution_point      :     process.env['EXECUTION_POINT'] || '',
        domain_name:               process.env['DOMAIN_NAME'] || '',
        support_team_email:        process.env['SUPPORT_TEAM_EMAIL'] || '',
        api_authentication_secret: process.env['API_AUTHENTICATION_SECRET'] || '',
    }
};