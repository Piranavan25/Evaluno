"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [qaItems, setQaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwtDecode<{ username: string; user_id: string }>(token);
    setUsername(decoded.username);
    setUserId(decoded.user_id);
  }, []);

  const handleGenerate = async () => {
    if (!file) return alert("Please upload a CV file.");

    const formData = new FormData();
    formData.append("cv_file", file);
    formData.append("user_id", userId);
    formData.append("job_title", jobTitle);
    formData.append("job_requirements", jobRequirements);
    formData.append("job_description", jobDescription);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/interview/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to generate Q&A");
      const data = await response.json();
      setQaItems(data.items);
    } catch (error) {
      alert("Error generating interview Q&A");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <input
        type="text"
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <textarea
        placeholder="Job Requirements"
        value={jobRequirements}
        onChange={(e) => setJobRequirements(e.target.value)}
        className="w-full border p-2 mb-4"
        rows={3}
      />

      <textarea
        placeholder="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full border p-2 mb-4"
        rows={3}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? "Generating..." : "Generate Q&A"}
      </button>

      {qaItems.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Q&A:</h2>
          {qaItems.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded shadow">
              <p><strong>Q:</strong> {item.question}</p>
              <p><strong>A:</strong> {item.answer}</p>
              <p><strong>Difficulty:</strong> {item.difficulty}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/*"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// Define QA item type
type QAItem = {
  question: string;
  answer: string;
  difficulty: string;
};

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [cvText, setCvText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwtDecode<{ username: string; user_id: string }>(token);
    setUsername(decoded.username);
    setUserId(decoded.user_id);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/interview/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          cv_text: cvText,
          job_title: jobTitle,
          job_requirements: jobRequirements,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate Q&A");

      const data = await response.json();
      setQaItems(data.items); // Now TypeScript knows what items are
    } catch (error) {
      alert("Error generating interview Q&A");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>

      <textarea
        placeholder="Paste your CV here..."
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
        className="w-full border p-2 mb-4"
        rows={6}
      />

      <input
        type="text"
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <textarea
        placeholder="Job Requirements"
        value={jobRequirements}
        onChange={(e) => setJobRequirements(e.target.value)}
        className="w-full border p-2 mb-4"
        rows={3}
      />

      <textarea
        placeholder="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full border p-2 mb-4"
        rows={3}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? "Generating..." : "Generate Q&A"}
      </button>

      {qaItems.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Q&A:</h2>
          {qaItems.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded shadow">
              <p><strong>Q:</strong> {item.question}</p>
              <p><strong>A:</strong> {item.answer}</p>
              <p><strong>Difficulty:</strong> {item.difficulty}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/