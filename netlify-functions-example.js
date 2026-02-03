// netlify/functions/signup.js
// Serverless function for Netlify deployment

const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    // Connect to MongoDB Atlas (free tier)
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("football-mondays");
    const signups = db.collection("signups");

    if (event.httpMethod === "GET") {
      // Get current signups
      const currentWeek = getCurrentWeekKey();
      const weekSignups = await signups.find({ week: currentWeek }).toArray();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          currentWeek,
          canSignup: isSignupTime(),
          mainList: weekSignups.slice(0, 10),
          reserveList: weekSignups.slice(10),
        }),
      };
    }

    if (event.httpMethod === "POST") {
      // Add signup
      if (!isSignupTime()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "Signups only allowed on Monday at 8pm or later",
          }),
        };
      }

      const { username } = JSON.parse(event.body);
      const currentWeek = getCurrentWeekKey();

      // Add signup logic here
      const newSignup = {
        week: currentWeek,
        username,
        signupTime: new Date(),
        position: (await signups.countDocuments({ week: currentWeek })) + 1,
      };

      await signups.insertOne(newSignup);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, position: newSignup.position }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};

function getCurrentWeekKey() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  return monday.toISOString().split("T")[0];
}

function isSignupTime() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday
  const hour = now.getHours();

  return (day === 1 && hour >= 20) || day > 1;
}
