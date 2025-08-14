import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ handleLogin, isLoggedIn }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!data.email || !data.password) {
      return;
    }
    handleLogin(data);
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Entrar</h2>
        
        <form className="auth__form" onSubmit={handleSubmit}>
          <input
            className="auth__input"
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            required
          />
          
          <input
            className="auth__input"
            type="password"
            name="password"
            placeholder="Senha"
            value={data.password}
            onChange={handleChange}
            required
          />
          
          <button className="auth__button" type="submit">
            Entrar
          </button>
        </form>

        <div className="auth__signin">
          <p className="auth__signin-text">
            Ainda não é membro? 
            <Link to="/signup" className="auth__signin-link"> Inscreva-se aqui!</Link>
          </p>
        </div>
      </div>
    </div>
  );
}