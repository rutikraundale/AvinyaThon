import { useState, useEffect } from "react";
import { addWorker, getWorkersBySite } from "../../services/workerService";
import { useSite } from "../../context/SiteContext";

const Workers = () => {
  const { selectedSite } = useSite();

  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    dailyWage: "",
  });

  // 🔹 Fetch Workers
  useEffect(() => {
    if (!selectedSite) return;

    const fetchWorkers = async () => {
      const res = await getWorkersBySite(selectedSite.$id);
      setWorkers(res.documents);
    };

    fetchWorkers();
  }, [selectedSite]);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Add Worker
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWorker = {
      ...formData,
      dailyWage: Number(formData.dailyWage),
      siteId: selectedSite.$id,
      createdBy: "demoUser", // later replace with Clerk
    };

    await addWorker(newWorker);

    alert("Worker Added");

    // Refresh
    const res = await getWorkersBySite(selectedSite.$id);
    setWorkers(res.documents);
  };

  return (
    <div>
      <h2>Workers</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="role" placeholder="Role" onChange={handleChange} />
        <input
          name="dailyWage"
          placeholder="Daily Wage"
          type="number"
          onChange={handleChange}
        />
        <button type="submit">Add Worker</button>
      </form>

      {/* LIST */}
      <ul>
        {workers.map((w) => (
          <li key={w.$id}>
            {w.name} - ₹{w.dailyWage}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workers;