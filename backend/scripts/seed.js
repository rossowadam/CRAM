const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const Course = require('../models/Course');

// Load environment variables for DB connection string
dotenv.config({ path: path.join(__dirname, "..", ".env") });

/**
 * Database Seed Function
 * This script reads the parsed courses.json and populates the MongoDB collection.
 * It transforms raw JSON data into the structured format required by the Course Schema.
 */
const seed = async () => {
    try {
        // Establish connection to the database (using your MONGO_URI).
        await connectDB();

        // Build path, read, and parse JSON file.
        const filePath = path.join(__dirname, "..", "data", "courses.json");
        const raw = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(raw);

        const subjects = Array.isArray(data?.subjects) ? data.subjects : [];
        console.log(`Seeding ${subjects.length} subjects...`);

        const ops = [];
        let totalCourses = 0;

        for (const subj of subjects) {
            const courses = Array.isArray(subj?.courses) ? subj.courses : [];
            
        for (const c of courses) {
        if (!c?.courseCode) continue;

        const [s, n] = String(c.courseCode).split(" ");

        // Push a bulk upsert operation into ops array.
        ops.push({
          updateOne: {
            filter: { courseCode: c.courseCode },
            update: {
              $set: {
                title: c.title ?? "",
                subject: s ?? "",
                number: n ?? "",
                courseCode: c.courseCode,
                description: c.description ?? "",
                credits: c.credits ?? 0,
                prerequisites: c.hasPrerequisites ? "Yes" : "None",
                attributes: Array.isArray(c.attributes) ? c.attributes.join(", ") : "",
              },
            },
            upsert: true, // Insert if not found.
          },
        });

        totalCourses++;
      }
    }

    console.log(`Prepared ${totalCourses} course upserts. Writing...`);

    // Write in chunks (not one giga payload).
    const CHUNK_SIZE = 500;
    let written = 0;

    for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
      const chunk = ops.slice(i, i + CHUNK_SIZE);

      // Bulk upsert.
      await Course.bulkWrite(chunk, { ordered: false });

      written += chunk.length;
      console.log(`Upserted ${written}/${ops.length} courses...`);
    }

    console.log(`Seed complete. Upserted ${ops.length} courses.`);

    // Exit successfully.
    process.exit(0);
  } catch (e) {
    console.error("Seeding Error:", e);
    process.exit(1);
  }
};

// Run the seed script.
seed();
