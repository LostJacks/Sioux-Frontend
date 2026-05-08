import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sioux-logo.jpg";
import "../styles/Login.css";

const API_BASE = "http://localhost:8080";

const ROUTE_FOR_ROLE = {
    employee: "/employee",
    receptionist: "/receptionist",
    manager: "/manager",
    admin: "/manager"
};

const lower = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");

/**
 * Email-only sign-in for the demo. Hits GET /api/users, finds the user with
 * a matching email, and lifts (currentUserId, currentRole) up to the App
 * shell so the NotificationProvider polls the right user and the role
 * switcher reflects who you actually are.
 */
function LoginPage({ setCurrentRole, setCurrentUser }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/users`);
            if (!res.ok) {
                throw new Error(`Failed to load users (${res.status})`);
            }
            const users = await res.json();

            const target = lower(email);
            const found = (Array.isArray(users) ? users : []).find(
                (u) => lower(u.email) === target
            );

            if (!found) {
                setError("No user with that email");
                return;
            }

            const role = lower(found.role) || "employee";
            const route = ROUTE_FOR_ROLE[role] || ROUTE_FOR_ROLE.employee;

            setCurrentRole(role === "admin" ? "manager" : role);
            if (typeof setCurrentUser === "function") {
                setCurrentUser({ id: found.id, email: found.email, role });
            }
            navigate(route);
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setSubmitting(false);
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
                    autoFocus
                />

                {error && <p className="error" style={{ color: "#b00020", margin: 0 }}>{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? "Signing in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
