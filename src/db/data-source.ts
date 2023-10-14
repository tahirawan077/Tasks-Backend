import "reflect-metadata"
import { DataSource } from "typeorm"
import { Task } from "../entities/Task"
import { User } from "../entities/User"


const DevAppDataSource = new DataSource({
    type: "postgres",
    host: 'otto.db.elephantsql.com',
    port: 5432,
    username: "mtakoaoy",
    password: "4jlloWFY0tgr1bTXdSUSOiVBA4hWmYKx",
    database: "mtakoaoy",
    entities: [Task, User],
    synchronize: true,
    logging: true,
})
const TestAppDataSource = new DataSource({
    type: 'sqlite', // Use an in-memory SQLite database for testing
    database: './database.sqlite',
    // database: ':memory:',
    entities: [Task, User],
    synchronize: true,
    // logging: true
  });

const AppDataSource = process.env.NODE_ENV == 'test' ? TestAppDataSource : DevAppDataSource;
export default AppDataSource