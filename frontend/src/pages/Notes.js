import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Notes() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get('http://localhost:8000/api/notes/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchNotes();
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      await axios.post('http://localhost:8000/api/notes/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setTitle('');
      setFile(null);
      fetchNotes();
    } catch (err) {
      alert('Upload failed.');
    }
  };

  const handleDelete = async (noteId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`http://localhost:8000/api/notes/${noteId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      alert('Delete failed.');
    }
  };

const handleDownload = async (noteId, title) => {
  const token = localStorage.getItem('accessToken');
  try {
    const res = await axios.get(`http://localhost:8000/api/notes/${noteId}/download/`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'  // important for binary files
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title}.pdf`); 
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert('Download failed.');
  }
};

const handleView = async (noteId) => {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await axios.get(`http://localhost:8000/api/notes/${noteId}/view/`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob"
    });

    // Make blob with the correct MIME type
    const file = new Blob([res.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    // Open in new tab
    window.open(fileURL, "_blank");
  } catch (err) {
    alert("Failed to view note.");
  }
};

  
  return (
    <div className="min-h-screen p-8 bg-gtaBlack text-gtaWhite">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-gta text-gtaAccent mb-6">📂 CJ’s Secret Archives</h1>

        <form onSubmit={handleUpload} className="space-y-6 mb-10">
          <div>
            <label className="block text-sm text-gtaGreen mb-1">📝 Note Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gtaBlack text-gtaWhite border border-gtaAccent px-4 py-2 rounded shadow-gta"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gtaGreen mb-1">📤 Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-gtaBlack text-gtaWhite border border-gtaAccent px-2 py-1 rounded"
              accept=".pdf,.doc,.docx,.txt"
              required
            />
          </div>

          <button
            type="submit"
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
          >
            Upload Note
          </button>
        </form>

        <h2 className="text-2xl font-gta text-gtaAccent mb-4">🧾 Uploaded Case Files:</h2>
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="bg-gtaBlack border border-gtaWhite/20 p-4 rounded-lg shadow-gta">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gtaAccent">{note.title}</p>

                </div>
                <div>
                  <button
                    onClick={() => handleDownload(note.id, note.title)}
                    className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-3 py-1 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
                  >
                    Download PDF
                  </button>

                </div>
                <div>
                  <button
                    onClick={() => handleView(note.id)}
                    className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-3 py-1 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
                  >
                  View
                  </button>


                  <span className="text-xs text-gtaWhite/50 ml-2">
                    ({new Date(note.uploaded_at).toLocaleString()})
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-500 text-sm hover:scale-105"
                >
                  ❌ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
