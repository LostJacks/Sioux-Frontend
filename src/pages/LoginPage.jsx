import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import logo from "../assets/sioux-logo.jpg";
import "../styles/login.css";

function LoginPage({ setCurrentRole }) { 
    const [email, setEmail] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanedEmail = email.trim().toLowerCase();

        if (cleanedEmail === "employee@gmail.com") {
            setCurrentRole("employee");
            navigate("/employee");
        }
        else if (cleanedEmail === "receptionist@gmail.com") {
            setCurrentRole("receptionist");
            navigate("/receptionist");
        }
        else if (cleanedEmail === "manager@gmail.com") {
            setCurrentRole("manager");
            navigate("/manager");
        }
        else {
            setError("Invalid email");
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleSubmit}>

                <img src={logo} alt="Sioux Logo" className="login-logo" />

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;