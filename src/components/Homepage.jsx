import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div>
      This is Homepage<br/>
      check this out<br/>
      <Link to="/login">authorization page</Link><br/>
    </div>
  );
};

export default Homepage;
