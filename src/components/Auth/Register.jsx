import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register({ handleRegistration, isLoggedIn }) {
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
    handleRegistration(data);
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Inscreva-se</h2>
        
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
            Inscreva-se
          </button>
        </form>

        <div className="auth__signin">
          <p className="auth__signin-text">
            Já é um membro? 
            <Link to="/signin" className="auth__signin-link"> Faça o login aqui!</Link>
          </p>
        </div>
      </div>
    </div>
  );
}