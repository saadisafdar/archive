import { useState } from 'react';

function App() {
  const [complaint, setComplaint] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complaint }),
      });
      
      const data = await response.json();
      setResult(data.ai_analysis);
    } catch {
      setResult('Error connecting to the AI backend. Make sure your Python app.py server is running on port 5000!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6">
      <header className="w-full max-w-4xl border-b border-gray-800 pb-4 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-400">🏙️ CommunityPulse AI</h1>
        <span className="bg-teal-900/50 text-teal-300 text-xs px-3 py-1 rounded-full border border-teal-700/50">
          APAC GenAI Academy Edition
        </span>
      </header>

      <main className="w-full max-w-4xl bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Submit Citizen Complaint</h2>
        <p className="text-sm text-gray-400 mb-6">Type a local city issue below. The Gemini-powered platform will instantly analyze severity and route an action workflow.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-teal-400 resize-none"
            placeholder="e.g., The main drainage line on Street 4 has overflowed, blocking traffic and causing a strong odor..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Analyzing with Gemini...' : 'Analyze & Dispatch'}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-4 bg-gray-900 border-l-4 border-teal-400 rounded-r-lg">
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-2">AI Decision Intelligence Output</h3>
            <p className="text-gray-200 leading-relaxed">{result}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;