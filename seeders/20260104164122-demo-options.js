"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("options", [
      // ===== JAVASCRIPT BASICS (Questions 1-20) =====
      // Q1: Variable declaration
      {
        question_id: 1,
        option_text: "var myVar;",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 1,
        option_text: "variable myVar;",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 1,
        option_text: "v myVar;",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 1,
        option_text: "declare myVar;",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q2: Statically typed
      {
        question_id: 2,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 2,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q3: Add element to array
      {
        question_id: 3,
        option_text: "push()",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 3,
        option_text: "pop()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 3,
        option_text: "shift()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 3,
        option_text: "unshift()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q4: === operator
      {
        question_id: 4,
        option_text: "Compares value only",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 4,
        option_text: "Compares value and type",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 4,
        option_text: "Assigns a value",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 4,
        option_text: "Compares references",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q5: JS in browsers only
      {
        question_id: 5,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 5,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q6: let vs var
      {
        question_id: 6,
        option_text: "let has block scope, var has function scope",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 6,
        option_text: "They are exactly the same",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 6,
        option_text: "var has block scope, let has function scope",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 6,
        option_text: "let cannot be redeclared, var can",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q7: null vs undefined
      {
        question_id: 7,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 7,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q8: Remove last element
      {
        question_id: 8,
        option_text: "pop()",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 8,
        option_text: "shift()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 8,
        option_text: "splice()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 8,
        option_text: "slice()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q9: typeof for array
      {
        question_id: 9,
        option_text: "array",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 9,
        option_text: "object",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 9,
        option_text: "list",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 9,
        option_text: "collection",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q10: Arrow functions and 'this'
      {
        question_id: 10,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 10,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q11: JSON string to object
      {
        question_id: 11,
        option_text: "JSON.parse()",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 11,
        option_text: "JSON.stringify()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 11,
        option_text: "JSON.convert()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 11,
        option_text: "JSON.decode()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q12: const reassignment
      {
        question_id: 12,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 12,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q13: Spread operator
      {
        question_id: 13,
        option_text: "Expands arrays/objects",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 13,
        option_text: "Reduces array size",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 13,
        option_text: "Creates a copy only",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 13,
        option_text: "Filters array elements",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q14: Hoisting
      {
        question_id: 14,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 14,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q15: Iterate and return new array
      {
        question_id: 15,
        option_text: "map()",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 15,
        option_text: "forEach()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 15,
        option_text: "filter()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 15,
        option_text: "reduce()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q16: Callbacks always async
      {
        question_id: 16,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 16,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q17: Object.keys()
      {
        question_id: 17,
        option_text: "Array of object keys",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 17,
        option_text: "Array of object values",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 17,
        option_text: "Object with keys only",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 17,
        option_text: "Count of keys",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q18: Promise.all()
      {
        question_id: 18,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 18,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q19: Find first element
      {
        question_id: 19,
        option_text: "find()",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 19,
        option_text: "filter()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 19,
        option_text: "findIndex()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 19,
        option_text: "search()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q20: Template literals
      {
        question_id: 20,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 20,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // ===== NODE.JS FUNDAMENTALS (Questions 21-40) =====
      // Q21: What is Node.js
      {
        question_id: 21,
        option_text: "A JavaScript runtime",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 21,
        option_text: "A web browser",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 21,
        option_text: "A database",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 21,
        option_text: "A CSS framework",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q22: Node.js single-threaded
      {
        question_id: 22,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 22,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q23: Web server module
      {
        question_id: 23,
        option_text: "http",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 23,
        option_text: "fs",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 23,
        option_text: "path",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 23,
        option_text: "os",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q24: npm stands for
      {
        question_id: 24,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 24,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q25: Purpose of package.json
      {
        question_id: 25,
        option_text: "Manages project metadata and dependencies",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 25,
        option_text: "Stores database credentials",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 25,
        option_text: "Contains compiled code",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 25,
        option_text: "Defines routes",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q26: Node.js uses V8
      {
        question_id: 26,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 26,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q27: File system module
      {
        question_id: 27,
        option_text: "fs",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 27,
        option_text: "file",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 27,
        option_text: "system",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 27,
        option_text: "io",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q28: Callbacks only way for async
      {
        question_id: 28,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 28,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q29: Global object in Node.js
      {
        question_id: 29,
        option_text: "global",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 29,
        option_text: "window",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 29,
        option_text: "globalThis",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 29,
        option_text: "root",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q30: Express.js is web framework
      {
        question_id: 30,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 30,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q31: Path utility module
      {
        question_id: 31,
        option_text: "path",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 31,
        option_text: "filesystem",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 31,
        option_text: "route",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 31,
        option_text: "directory",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q32: Middleware runs before handlers
      {
        question_id: 32,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 32,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q33: Purpose of require()
      {
        question_id: 33,
        option_text: "Import modules",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 33,
        option_text: "Create variables",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 33,
        option_text: "Define functions",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 33,
        option_text: "Connect to database",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q34: module.exports
      {
        question_id: 34,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 34,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q35: Event-driven architecture
      {
        question_id: 35,
        option_text: "Node.js",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 35,
        option_text: "PHP",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 35,
        option_text: "Python",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 35,
        option_text: "Java",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q36: Handle one connection at a time
      {
        question_id: 36,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 36,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q37: process.env contains
      {
        question_id: 37,
        option_text: "Environment variables",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 37,
        option_text: "System processes",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 37,
        option_text: "Current directory",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 37,
        option_text: "Node version",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q38: Promises better than callbacks
      {
        question_id: 38,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 38,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q39: Error handling in Express
      {
        question_id: 39,
        option_text: "Error middleware with 4 parameters",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 39,
        option_text: "try-catch in routes",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 39,
        option_text: "Global error object",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 39,
        option_text: "Process exit",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q40: async/await is syntactic sugar
      {
        question_id: 40,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 40,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // ===== SQL BASICS (Questions 41-60) =====
      // Q41: Retrieve data
      {
        question_id: 41,
        option_text: "SELECT",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 41,
        option_text: "GET",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 41,
        option_text: "FETCH",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 41,
        option_text: "RETRIEVE",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q42: SQL case-sensitive
      {
        question_id: 42,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 42,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q43: DISTINCT keyword
      {
        question_id: 43,
        option_text: "Removes duplicate rows",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 43,
        option_text: "Counts rows",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 43,
        option_text: "Orders results",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 43,
        option_text: "Groups data",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q44: WHERE clause
      {
        question_id: 44,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 44,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q45: Insert data
      {
        question_id: 45,
        option_text: "INSERT",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 45,
        option_text: "ADD",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 45,
        option_text: "CREATE",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 45,
        option_text: "PUT",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q46: PRIMARY KEY duplicates
      {
        question_id: 46,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 46,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q47: UPDATE statement
      {
        question_id: 47,
        option_text: "Modifies existing records",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 47,
        option_text: "Creates new table",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 47,
        option_text: "Deletes records",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 47,
        option_text: "Joins tables",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q48: FOREIGN KEY
      {
        question_id: 48,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 48,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q49: LEFT JOIN
      {
        question_id: 49,
        option_text: "LEFT JOIN",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 49,
        option_text: "RIGHT JOIN",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 49,
        option_text: "INNER JOIN",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 49,
        option_text: "FULL JOIN",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q50: NULL vs empty string
      {
        question_id: 50,
        option_text: "True",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 50,
        option_text: "False",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q51: GROUP BY
      {
        question_id: 51,
        option_text: "Groups rows with same values",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 51,
        option_text: "Sorts data alphabetically",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 51,
        option_text: "Removes duplicates",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 51,
        option_text: "Filters rows",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q52: HAVING clause
      {
        question_id: 52,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 52,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q53: COUNT function
      {
        question_id: 53,
        option_text: "COUNT()",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 53,
        option_text: "SUM()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 53,
        option_text: "AVG()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 53,
        option_text: "MAX()",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q54: ORDER BY multiple columns
      {
        question_id: 54,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 54,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q55: INDEX purpose
      {
        question_id: 55,
        option_text: "Speeds up queries",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 55,
        option_text: "Encrypts data",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 55,
        option_text: "Backs up data",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 55,
        option_text: "Sorts tables",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q56: UNION
      {
        question_id: 56,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 56,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q57: LIKE operator
      {
        question_id: 57,
        option_text: "Pattern matching on text",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 57,
        option_text: "Exact match only",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 57,
        option_text: "Compares dates",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 57,
        option_text: "Counts records",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q58: Subqueries
      {
        question_id: 58,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 58,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q59: UNIQUE constraint
      {
        question_id: 59,
        option_text: "UNIQUE",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 59,
        option_text: "PRIMARY KEY",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 59,
        option_text: "DISTINCT",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 59,
        option_text: "NOT NULL",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Q60: TRANSACTION
      {
        question_id: 60,
        option_text: "True",
        is_correct: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question_id: 60,
        option_text: "False",
        is_correct: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("options", null, {});
  },
};
