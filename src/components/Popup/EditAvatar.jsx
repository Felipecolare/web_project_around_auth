import { useState, useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

export default function EditAvatar() {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);

  const [avatar, setAvatar] = useState("");

  const handleAvatarChange = (event) => {
    setAvatar(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleUpdateAvatar({ avatar });
  };

  return (
    <form
      className="popup__input input-avatar"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="input__wrap">
        <input
          className="input__text input__text-avatar"
          id="avatar"
          name="avatar"
          type="url"
          placeholder="Link do avatar"
          required
          value={avatar}
          onChange={handleAvatarChange}
        />
        <p className="input__errorMessage"></p>
      </div>
      <button type="submit" className="input__submit input__submit-save">
        Salvar
      </button>
    </form>
  );
}