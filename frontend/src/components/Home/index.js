import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";

import Header from "../Header";

import "./index.css";

const Home = () => {
  //   const jwtToken = Cookies.get("jwt_token");
  //   if (jwtToken === undefined) {
  //     return <Redirect to="/login" />;
  //   }
  const val = 0;

  return (
    <>
      <Header />
      <div className="home-container">
        <h1>Welcome</h1>
      </div>
    </>
  );
};

export default Home;
