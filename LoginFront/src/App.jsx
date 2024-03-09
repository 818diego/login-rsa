import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [passwordEncrypted, setPassword] = useState("");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [UserID, setLoginID] = useState("");
  const [UserPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `https://localhost:7114/api/Users/Login?userId=${UserID}&password=${UserPassword}`
      );
      if (response.ok) {
        console.log("Login successful");
        const userData = await response.json();
        setUser(userData);
        setShowUserInfoModal(true);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch(
        "https://localhost:7114/api/Users/Registrar/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            passwordEncrypted: passwordEncrypted,
            d: 0,
          }),
        }
      );
      const data = await response.json();
      console.log("Create user response:", data);

      setEmail("");
      setPassword("");

      setShowCreateUserModal(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
          Login
        </h2>
        <div className="relative">
          <i className="absolute left-3 top-1/2 transform -translate-y-1/2 fas fa-user"></i>
          <input
            type="email"
            className="pl-8 w-full mb-4 p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-500 ease-in-out transform focus:-translate-y-1 focus:scale-250"
            placeholder="User ID"
            value={UserID}
            onChange={(e) => setLoginID(e.target.value)}
          />
        </div>
        <div className="relative">
          <i className="absolute left-3 top-1/2 transform -translate-y-1/2 fas fa-lock"></i>
          <input
            type="password"
            className="pl-8 w-full mb-6 p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-500 ease-in-out transform focus:-translate-y-1 focus:scale-250"
            placeholder="Password"
            value={UserPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 focus:outline-none transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-250"
            onClick={handleLogin}>
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
          <button
            className="mt-4 text-blue-500 w-full text-center focus:outline-none transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-250 hover:bg-blue-200 p-2 rounded"
            onClick={() => setShowCreateUserModal(true)}>
            <i className="fas fa-user-plus"></i> Crear Usuario
          </button>
        </div>
      </div>

      {showCreateUserModal && (
        
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
              Crear Usuario
            </h2>
            <div className="relative">
              <i className="absolute left-3 top-1/2 transform -translate-y-1/2 fas fa-envelope"></i>
              <input
                type="email"
                className="pl-8 w-full mb-4 p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-500 ease-in-out transform focus:-translate-y-1 focus:scale-250"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <i className="absolute left-3 top-1/2 transform -translate-y-1/2 fas fa-lock"></i>
              <input
                type="password"
                className="pl-8 w-full mb-6 p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-500 ease-in-out transform focus:-translate-y-1 focus:scale-250"
                placeholder="Password"
                value={passwordEncrypted}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-700 focus:outline-none transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-250"
              onClick={handleCreateUser}>
              <i className="fas fa-user-plus"></i> Crear
            </button>
            <button
              className="mt-4 text-white bg-gray-500 w-full text-center focus:outline-none transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-250 hover:bg-gray-700 p-2 rounded"
              onClick={() => setShowCreateUserModal(false)}>
              <i className="fas fa-times"></i> Cancelar
            </button>
          </div>
        </div>
      )}

      {showUserInfoModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 animate-fade-in-down">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              Informacion del Usuario
            </h2>
            <p className="mb-4 text-gray-600">
              <span className="font-bold">Email:</span> {user.email}
            </p>
            <p className="mb-6 text-gray-600">
              <span className="font-bold">Contraseña Encriptada:</span>{" "}
              {user.passwordEncrypted}
            </p>
            <button
              className="bg-red-500 text-white w-full text-center py-2 rounded focus:outline-none transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-250 font-bold"
              onClick={() => setShowUserInfoModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
