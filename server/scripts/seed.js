const path = require('path');
// This forces dotenv to look at the .env file in the PARENT folder
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Sprint = require('../models/Sprint'); // Ensure this matches your model path

const sprints = [
    {
        title: "Secure Express Middleware",
        difficulty: "Medium",
        category: "Backend",
        description: "Write an Express middleware function that validates a JWT from the 'Authorization' header. If valid, attach the user to 'req.user' and call next(). If missing or invalid, return a 401 status with an error message.",
        starterCode: "const jwt = require('jsonwebtoken');\n\nconst authMiddleware = (req, res, next) => {\n  // Implement logic here\n};",
        constraints: [
            "Check for 'Bearer' prefix in the header",
            "Use process.env.JWT_SECRET",
            "Handle expired token errors specifically"
        ],
        xpReward: 200
    },
    {
        title: "React Custom Hook: useFetch",
        difficulty: "Easy",
        category: "Frontend",
        description: "Create a custom React hook called 'useFetch' that takes a URL. It should return an object containing: { data, loading, error }. Ensure it handles clean-up if the component unmounts.",
        starterCode: "import { useState, useEffect } from 'react';\n\nexport const useFetch = (url) => {\n  // Implement hook here\n};",
        constraints: [
            "Must use the useEffect hook",
            "Must implement an AbortController for clean-up",
            "Data should initialize as null"
        ],
        xpReward: 150
    },
    {
        title: "MongoDB Aggregation Pipeline",
        difficulty: "Hard",
        category: "Database",
        description: "Write a function using Mongoose to find the top 5 users who have spent the most money. Your 'Order' collection has 'userId' and 'totalAmount' fields.",
        starterCode: "const Order = require('../models/Order');\n\nconst getTopSpenders = async () => {\n  // Implement aggregation here\n};",
        constraints: [
            "Use the $group stage",
            "Use $sort and $limit",
            "Return results as an array of objects"
        ],
        xpReward: 400
    },
    {
        title: "Input Validation Logic",
        difficulty: "Medium",
        category: "Logic",
        description: "Create a validation utility for a registration form. It must check: 1) Email format, 2) Password strength (min 8 chars, 1 number, 1 special char), and 3) Username length (3-15 chars).",
        starterCode: "const validateRegistration = (data) => {\n  const errors = {};\n  // Implement validation\n  return errors;\n};",
        constraints: [
            "Use Regex for email validation",
            "Password must contain at least one special character",
            "Return an empty object if no errors exist"
        ],
        xpReward: 250
    },
    {
        title: "Optimized Image Component",
        difficulty: "Medium",
        category: "Frontend",
        description: "Build a React component that 'lazy loads' images using the Intersection Observer API. It should show a grey placeholder until the image is in view.",
        starterCode: "import React, { useState, useEffect, useRef } from 'react';\n\nconst LazyImage = ({ src, alt }) => {\n  // Implement intersection observer logic\n};",
        constraints: [
            "Must use useRef for the image element",
            "Unobserve the element after it loads",
            "Use a 10% threshold for the observer"
        ],
        xpReward: 300
    }
];

const seedDB = async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Clear existing sprints to avoid duplicates during development
        await Sprint.deleteMany({});
        console.log("Cleared old Sprints.");

        await Sprint.insertMany(sprints);
        console.log("Successfully seeded 5 Sprints!");

        process.exit();
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();