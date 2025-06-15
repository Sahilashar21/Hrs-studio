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
    <div className="page-wrapper">
      <div className="login-card">
        <h1>Welcome to HRS STUDIO</h1>
        <button className="login-btn" onClick={loginWithGoogle}>Login with Google</button>
        <button className="review-btn" onClick={openReviewLink}>Leave a Google Review</button>
        <button className="contact-btn" onClick={() => navigate("/contact")}>Contact Us</button>
      </div>
    </div>
  );
}

export default LoginPage;
