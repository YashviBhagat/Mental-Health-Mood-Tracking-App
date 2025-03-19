import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to Nirvana</h1>
      <div>
        <br />
        <button onClick={() => navigate("/notes_list")}>Go to Notes List</button>
        <br />
      </div>
    </>
  );
}

export default Home;
