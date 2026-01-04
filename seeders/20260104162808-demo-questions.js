"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("questions", [
      {
        question_set_id: 1,
        question_text:
          "What is the correct way to declare a variable in JavaScript?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "JavaScript is a statically typed language.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text:
          "Which method is used to add an element to the end of an array?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "What does '===' operator do in JavaScript?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "JavaScript can only run in web browsers.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "What is the difference between 'let' and 'var'?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "null and undefined are the same in JavaScript.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "Which method removes the last element from an array?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "What does typeof operator return for an array?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "Arrow functions have their own 'this' context.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text:
          "Which method converts a JSON string to a JavaScript object?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "const variables can be reassigned after declaration.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "What is the purpose of the 'spread operator' (...)?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text:
          "Hoisting in JavaScript moves variable declarations to the top.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text:
          "Which method iterates over array elements and returns a new array?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "Callbacks are always asynchronous in JavaScript.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "What does Object.keys() return?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "Promise.all() waits for all promises to be resolved.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text:
          "Which method is used to find the first element in an array that meets a condition?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 1,
        question_text: "Template literals use backticks (`) in JavaScript.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // ===== NODE.JS FUNDAMENTALS (Set 2) - 20 Questions =====
      {
        question_set_id: 2,
        question_text: "What is Node.js?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "Node.js is single-threaded.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text:
          "Which module is used to create a web server in Node.js?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "npm stands for Node Package Manager.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "What is the purpose of package.json?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "Node.js uses V8 engine for JavaScript execution.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "Which module is used for file system operations?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text:
          "Callbacks are the only way to handle asynchronous operations in Node.js.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "What is the global object in Node.js?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "Express.js is a web framework for Node.js.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text:
          "Which module provides utility functions for working with file paths?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "Middleware in Express.js runs before route handlers.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "What is the purpose of require() in Node.js?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text:
          "module.exports is used to expose functions from a file.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "Which of these is an event-driven architecture?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "Node.js can handle only one connection at a time.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "What does process.env contain?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text:
          "Promises are better than callbacks for handling async operations.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text:
          "Which method is used to handle errors in Express.js routes?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 2,
        question_text: "async/await is syntactic sugar over Promises.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // ===== SQL BASICS (Set 3) - 20 Questions =====
      {
        question_set_id: 3,
        question_text: "Which SQL statement is used to retrieve data?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "SQL is case-sensitive for keywords.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "What does DISTINCT keyword do in SQL?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "WHERE clause is used to filter records in SQL.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "Which SQL statement is used to insert data?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "PRIMARY KEY can have duplicate values.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "What does UPDATE statement do?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text:
          "FOREIGN KEY establishes a relationship between two tables.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text:
          "Which JOIN returns all rows from left table and matching rows from right?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "NULL is the same as an empty string in SQL.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "What does GROUP BY clause do?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "HAVING clause is used with aggregate functions.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "Which function counts the number of rows?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "ORDER BY can sort by multiple columns.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "What is the purpose of an INDEX in SQL?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text:
          "UNION combines results from multiple SELECT statements.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "What does LIKE operator do in SQL?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "Subqueries can be used in WHERE and SELECT clauses.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text:
          "Which constraint ensures that all values in a column are unique?",
        question_type: "multiple_choice",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_set_id: 3,
        question_text: "TRANSACTION ensures data consistency in SQL.",
        question_type: "true_false",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("questions", null, {});
  },
};
