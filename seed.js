const mongoose = require('mongoose');
const Task = require('./models/Task.model');
const User = require('./models/User.model');
const connectDB = require("./config/db");

const seedDatabase = async () => {
  await connectDB();
  try {
    const users = await User.find();
    if (users.length === 0) {
      throw new Error('No users found');
    }

    const tasks = [];

    const taskTitles = [
      'Complete Project Report',
      'Fix Bugs in Application',
      'Plan Team Meeting',
      'Update Documentation',
      'Design New Logo',
      'Research Market Trends',
      'Write Blog Post',
      'Prepare Presentation',
      'Review Code Submissions',
      'Organize Files'
    ];

    const taskDescriptions = [
      'Detailed project report needs to be completed by end of the week.',
      'Several bugs were reported in the application, they need to be fixed ASAP.',
      'Schedule and plan the team meeting for next Monday.',
      'Update the project documentation with the latest changes.',
      'Create a new logo design for the marketing team.',
      'Research the latest market trends for the quarterly report.',
      'Draft a new blog post for the company website.',
      'Prepare the presentation for the upcoming client meeting.',
      'Review code submissions from the team members.',
      'Organize project files in the shared drive.'
    ];

    for (let i = 0; i < taskTitles.length; i++) {
      const user = users[i % users.length]; // Распределяем задачи по пользователям

      const task = {
        title: taskTitles[i],
        description: taskDescriptions[i],
        body: `Detailed information about ${taskTitles[i].toLowerCase()}.`,
        todoList: [
          { title: `Todo 1 for ${taskTitles[i]}` },
          { title: `Todo 2 for ${taskTitles[i]}`, isComplete: i % 2 === 0 }
        ],
        isPinned: i % 3 === 0,
        user: user._id
      };

      tasks.push(task);
    }

    await Task.insertMany(tasks);
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
