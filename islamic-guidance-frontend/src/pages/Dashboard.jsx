import { useEffect, useState } from "react";
import { getAyah } from "../services/api";
import AyahCard from "../components/AyahCard";

function Dashboard() {
  const [ayah, setAyah] = useState(null);

  useEffect(() => {
    const fetchAyah = async () => {
      const data = await getAyah();
      setAyah(data);
    };

    fetchAyah();
  }, []);

  return (
    <div>
      <h1>Daily Guidance</h1>

      {ayah && <AyahCard ayah={ayah} />}
    </div>
  );
}

export default Dashboard;