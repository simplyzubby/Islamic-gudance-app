import { useState } from "react";

function Reflections() {
  const [reflection, setReflection] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(reflection);
    setReflection("");
  };

  return (
    <div>
      <h2>My Reflections</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your reflection..."
        />
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Reflections;