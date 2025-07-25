import React, { useEffect, useState } from "react";

const AcceptedShares = () => {
  const [shares, setShares] = useState([]);

useEffect(() => {
  const fetchShares = async () => {
    try {
      const res = await fetch("/api/accepted-shares/");
      const data = await res.json();

      // Handle object responses like { shares: [...] }
      if (Array.isArray(data)) {
        setShares(data);
      } else if (Array.isArray(data.shares)) {
        setShares(data.shares);
      } else {
        console.warn("Unexpected API format:", data);
        setShares([]);
      }
    } catch (err) {
      console.error("Failed to fetch accepted shares:", err);
      setShares([]);
    }
  };

  fetchShares();
}, []);


  return (
    <div className="max-w-3xl mx-auto p-6 bg-gtaBlack text-gtaWhite min-h-screen">
      <h2 className="text-3xl font-gta text-gtaAccent mb-6">📚 Accepted Mission Files</h2>
      {Array.isArray(shares) && shares.length === 0 ? (
        <p className="text-gtaWhite/60">You have no accepted shares yet.</p>
      ) : (
        <ul className="space-y-4">
          {Array.isArray(shares) && shares.map((item) => (
            <li key={item.id} className="bg-gtaBlack border border-gtaWhite/20 p-4 rounded shadow-gta">
              <p><strong>👤 From:</strong> User #{item.from_user}</p>
              <p><strong>📘 Type:</strong> {item.content_type}</p>
              <p><strong>🏷️ Course:</strong> {item.course_tag}</p>
              <p><strong>🆔 Content ID:</strong> {item.content_id}</p>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default AcceptedShares;
