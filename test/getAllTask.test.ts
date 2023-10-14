import request from 'supertest';
import app from '../src/app'; // Import your Express app
import { DataSource, Repository } from "typeorm"
import { Task } from '../src/entities/Task'; // Import your Task entity
import { User } from '../src/entities/User';
import jwt from 'jsonwebtoken';
require('dotenv').config();

// Explicitly declare the type for AppDataSource
let AppDataSource: DataSource | undefined;
let authToken = "";

beforeAll(async () => {
  AppDataSource = new DataSource({
    type: 'sqlite', // Use an in-memory SQLite database for testing
    database: './database.sqlite',
    entities: [Task,User],
    synchronize: true,
    // logging: true,
  });

  // Initialize the database connection for testing
  await AppDataSource.initialize();
  console.log('Database is connected');
  taskRepository = AppDataSource.getRepository(Task);
  userRepository = AppDataSource.getRepository(User);
  const testUser = await userRepository?.findOne({ where: { username: 'testuser' } });
  console.log("testUser", testUser);
  if(testUser) {
    authToken = generateAuthToken(testUser);
  }
});

let taskRepository: Repository<Task> | undefined; // Declare the type explicitly
let userRepository: Repository<User> | undefined; // Declare the type explicitly

beforeEach(async () => {

});

afterAll(async () => {
  if (AppDataSource && taskRepository) {
    // Close the database connection after testing
    // await taskRepository.clear();
    // await userRepository?.clear();
  }
});


// Function to generate an authentication token for the test user
const generateAuthToken = (user: User) => {
  const token = jwt.sign({ id: user.id }, `${process.env.SECRET}`,{
    expiresIn: '1h', //token expiry time
  });
  return token;
};

    
// GET `/tasks` - Retrieve all tasks
describe('GET /tasks', () => {
  it('should retrieve all tasks', async () => {
    // Ensure taskRepository is defined
    if (!taskRepository) {
      throw new Error('Task repository is not defined.');
    }
    //using the same function as in main application
    const total = await taskRepository?.find();

    // Create test data in the database
    await taskRepository.save([
      {
        "title": "TASK 1",
        "description": "This is a new Task",
        "dueDate": "2023-11-25 16:00:43.947",
        "assignedTo": "tahir",
        "category": "Home",
        "status": "Pending"
      },
      {
        "title": "TASK 2",
        "description": "This is a new Task",
        "dueDate": "2023-11-25 16:00:43.947",
        "assignedTo": "tahir",
        "category": "Home",
        "status": "Pending"
      },
    ]);

    // Perform the GET request
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    // Assertions
    expect(response.status).toBe(200);
    // expect(response.body).toHaveLength(total.length+2); // Check that two tasks were retrieved
  });
});


// POST `/task` - Create a new task
it('should create a new task', async () => {
  const response = await request(app)
    .post('/task')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      "title": "TASK 2",
      "description": "This is a new Task",
      "dueDate": "2023-11-25 16:00:43.947",
      "assignedTo": "tahir",
      "category": "Home",
      "status": "Pending"
    });

  expect(response.status).toBe(201);
  // Add more assertions as needed
});

// GET `/task/:id` - Retrieve a task by its ID
it('should retrieve a task by its ID', async () => {

  let latestTask = await taskRepository?.createQueryBuilder('task')
  .orderBy('task.id', 'DESC')
  .getOne();

  const taskId = latestTask?.id;
  const response = await request(app)
    .get(`/task/${taskId}`)
    .set('Authorization', `Bearer ${authToken}`);

  expect(response.status).toBe(200);
});

// PUT `/task/:id` - Update a specific task
it('should update a specific task', async () => {
  let latestTask = await taskRepository?.createQueryBuilder('task')
  .orderBy('task.id', 'DESC')
  .getOne();

  const taskId = latestTask?.id;

  const response = await request(app)
    .put(`/task/${taskId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: 'Updated Task',
      description: 'Updated description',
    });

  expect(response.status).toBe(200);
  // Add more assertions as needed
});

// DELETE `/task/:id` - Delete a specific task
it('should delete a specific task', async () => {
  let latestTask = await taskRepository?.createQueryBuilder('task')
  .orderBy('task.id', 'DESC')
  .getOne();
  const taskId = latestTask?.id;
  const response = await request(app)
    .delete(`/task/${taskId}`)
    .set('Authorization', `Bearer ${authToken}`);

  expect(response.status).toBe(204);
  // Add more assertions as needed
});

// GET `/tasks?assignedTo=[username]` - Retrieve tasks assigned to a specific user
it('should retrieve tasks assigned to a specific user', async () => {
  const username = 'tahir'; // Replace with a valid username
  const response = await request(app)
    .get(`/tasks?assignedTo=${username}`)
    .set('Authorization', `Bearer ${authToken}`);

  expect(response.status).toBe(200);
});

// GET `/tasks?category=[categoryName]` - Retrieve tasks under a specific category
it('should retrieve tasks under a specific category', async () => {
  const category = 'Home'; // Replace with a valid category name
  const response = await request(app)
    .get(`/tasks?category=${category}`)
    .set('Authorization', `Bearer ${authToken}`);

  expect(response.status).toBe(200);
});