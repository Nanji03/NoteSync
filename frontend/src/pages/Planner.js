import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import '../App.css'; // or './App.css' if you're merging into it


export default function Planner() {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const formattedDate = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('plannerTasks')) || {};
    setTasks(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('plannerTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) return;

    const newTask = {
      id: Date.now(),
      title,
      startTime,
      endTime,
      completed: false,
    };

    const updated = {
      ...tasks,
      [formattedDate]: [...(tasks[formattedDate] || []), newTask],
    };

    setTasks(updated);
    setTitle('');
    setStartTime('');
    setEndTime('');
  };

  const toggleComplete = (taskId) => {
    const updated = {
      ...tasks,
      [formattedDate]: tasks[formattedDate].map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    };
    setTasks(updated);
  };

  const deleteTask = (taskId) => {
    const updated = {
      ...tasks,
      [formattedDate]: tasks[formattedDate].filter(t => t.id !== taskId),
    };
    setTasks(updated);
  };

  return (
    <div className="min-h-screen p-8 bg-gtaBlack text-gtaWhite font-gta gta-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Calendar */}
        <div>
          <h1 className="text-3xl font-gta text-gtaAccent mb-4">📅 Mission Planner</h1>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded shadow-gta"
          />
        </div>

        {/* Tasks for selected day */}
        <div>
          <h2 className="text-xl font-gta mb-2 text-gtaAccent">Tasks on {formattedDate}</h2>

          <form onSubmit={handleAddTask} className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🎯 Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gtaBlack border border-gtaAccent px-4 py-2 rounded col-span-full text-gtaWhite shadow-gta"
              required
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-gtaBlack border border-gtaAccent px-4 py-2 rounded text-gtaWhite shadow-gta"
              required
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-gtaBlack border border-gtaAccent px-4 py-2 rounded text-gtaWhite shadow-gta"
              required
            />
            <button
              type="submit"
  className="bg-transparent border border-gtaAccent text-gtaAccent font-gta px-6 py-2 rounded shadow-gta hover:bg-gtaAccent hover:text-gtaBlack transition-all mb-6"
            >
              ➕ Add Task
            </button>
          </form>

          {(!tasks[formattedDate] || tasks[formattedDate].length === 0) && (
            <p className="text-gtaWhite/60">No tasks for this date.</p>
          )}

          <ul className="space-y-3">
            {(tasks[formattedDate] || []).map((task) => (
              <li key={task.id} className="bg-gtaBlack border border-gtaGreen p-4 rounded shadow-gta flex justify-between items-center">
                <div>
                  <p className={`${task.completed ? 'line-through text-gtaWhite/50' : 'font-bold text-gtaWhite'}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-gtaWhite/70">
                    ⏰ {task.startTime} - {task.endTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                  />
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gtaRed text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}