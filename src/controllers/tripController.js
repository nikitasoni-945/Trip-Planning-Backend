const Trip = require("../models/Trip");

// This is your controller for trip planning
exports.planTrip = async (req, res) => {
  const { destination, dates, interests } = req.body;

  const prompt = `
Generate a personalized travel plan for:
Destination: ${destination}
Dates/Days: ${dates}
Interests: ${interests.join(", ")}

Give a day-by-day breakdown in 2-3 lines per day.
`;

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful travel planner.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await aiRes.json();

    const itinerary = data.choices[0].message.content;

    // Save trip in DB
    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      dates,
      interests,
      itinerary,
    });

    res.json({ itinerary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI planning failed" });
  }
};
