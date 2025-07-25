import React, { useEffect, useState } from "react";

const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/incoming-requests/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      } else if (Array.isArray(data.requests)) {
        setRequests(data.requests);
      } else {
        console.warn("Unexpected format:", data);
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching incoming requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (id, action) => {
    try {
      const res = await fetch("/api/share-request/respond/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ id, action }),
      });

      const data = await res.json();
      alert(data.message || `${action} complete.`);
      fetchRequests();
    } catch (err) {
      console.error("Error responding to request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gtaBlack text-gtaWhite min-h-screen">
      <h2 className="text-3xl font-gta text-gtaAccent mb-6">🔔 Incoming Share Requests</h2>

      {loading ? (
        <p className="text-gtaWhite/60">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gtaWhite/60">No new requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="bg-gtaBlack border border-gtaWhite/20 p-4 rounded shadow-gta"
            >
              <p><strong>👤 From:</strong> User #{req.from_user}</p>
              <p><strong>📘 Type:</strong> {req.content_type}</p>
              <p><strong>🏷️ Course:</strong> {req.course_tag}</p>
              <p><strong>🆔 Content ID:</strong> {req.content_id}</p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => respondToRequest(req.id, "accepted")}
                  className="bg-gtaGreen text-gtaBlack font-bold px-4 py-2 rounded shadow-gta hover:scale-105 transition-all"
                >
                  ✅ Accept
                </button>
                <button
                  onClick={() => respondToRequest(req.id, "rejected")}
                  className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-gta hover:scale-105 transition-all"
                >
                  ❌ Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IncomingRequests;
