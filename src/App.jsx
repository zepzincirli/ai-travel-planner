import { useState } from "react";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const prompt = `
      You are a travel planner. Create a ${days}-day itinerary for ${city}.
      Interests: ${interests}.
      Provide the plan day by day with times.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    setResult(response.choices[0].message.content);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
          ✈️ AI Travel Planner
        </h1>

        <form onSubmit={generatePlan} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">City</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Paris, Rome, Amsterdam..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Days</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Interests
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="food, art, shopping..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold p-3 rounded-xl shadow-md"
          >
            Generate Plan
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-600 mt-6">
            ⏳ Generating plan...
          </p>
        )}

        {!loading && result && (
          <div className="mt-6 bg-gray-50 p-6 rounded-xl shadow-inner border">
            <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
