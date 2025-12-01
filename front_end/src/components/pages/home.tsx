import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h2 className="mt-1.5 text-center text-3xl font-bold text-white">
        INICIAL PAGE
      </h2>
      <p className="ml-2 flex flex-col gap-2 text-blue-400">
        <Link to="/login">Ir para Login</Link>
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Home;
