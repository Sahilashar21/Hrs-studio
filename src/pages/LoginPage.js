// src/pages/LoginPage.js
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Redirect based on email
      if (user.email === "asharhiten@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const openReviewLink = () => {
    window.open("https://g.co/kgs/Co7pMp7", "_blank");
  };

  return (
    <div className="login-container">
      <h2>Welcome to HRS Studio Wallet</h2>
      <button className="login-btn" onClick={loginWithGoogle}>Login with Google</button>
      <button className="review-btn" onClick={openReviewLink}>Leave a Google Review</button>
    </div>
  );
}

export default LoginPage;
