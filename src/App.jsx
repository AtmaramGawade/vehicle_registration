import React, { useState } from "react";
import Auth from "./Auth";
import VehicleRegistration from "./VehicleRegistration";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {user ? <VehicleRegistration /> : <Auth onLogin={setUser} />}
    </div>
  );
}

export default App;
