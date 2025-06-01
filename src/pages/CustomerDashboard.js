import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import "./customerdashboard.css";

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userEmail = currentUser.email;

        // Query user document by email
        const q = query(collection(db, "users"), where("email", "==", userEmail));
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            setWalletBalance(docData.balance || 0);
            setTransactions(docData.transactionHistory || []);
            setRecharges(docData.rechargeHistory || []);
            setLoading(false);
          } else {
            // No user document found, reset data
            setWalletBalance(0);
            setTransactions([]);
            setRecharges([]);
            setLoading(false);
          }
        });

        // Clean up snapshot listener when auth changes or component unmounts
        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setWalletBalance(0);
        setTransactions([]);
        setRecharges([]);
        setLoading(false);
      }
    });

    // Clean up auth listener on unmount
    return () => unsubscribeAuth();
  }, []);

  if (loading) return <div>Loading your dashboard...</div>;

return (
  <div style={{ padding: "30px" }} className="dashboard">
    {/* Logo */}
    <div className="logo-container">
      <img src="/HRS LOGO.jpg" alt="HRS Studio Logo" className="logo" />
    </div>

    <h2>🎤 Welcome, {user?.displayName || user?.email}</h2>
    <h3>💰 Wallet Balance: ₹{walletBalance}</h3>

    {/* Transaction History */}
    <div style={{ marginTop: "30px" }}>
      <h4>🧾 Transaction History</h4>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map((txn, idx) => (
            <li key={idx}>
              {txn.type?.toUpperCase() || "ITEM"} - ₹{txn.amount} on{" "}
              {new Date(txn.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Recharge History */}
    <div style={{ marginTop: "30px" }}>
      <h4>💳 Recharge History</h4>
      {recharges.length === 0 ? (
        <p>No recharges yet.</p>
      ) : (
        <ul>
          {recharges.map((rchg, idx) => (
            <li key={idx}>
              ₹{rchg.amount} + ₹{rchg.bonus} on {new Date(rchg.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Contact Info */}
    <div className="contact-info">
      <h4>📞 Contact Us</h4>
      <p>📍 HRS Studio, Shop no 9, Harsiddhi APT, Gokul Aangan Vasai west </p>
      <p>📞 +91 9321066921/22</p>
      <p>⏱️ Monday to Saturday: 5:30 PM to 10 PM</p>
      <p>⏱️ Sunday: 10:30 AM to 1:30 PM & 5:30 PM to 10 PM</p>
    </div>
  </div>
);

};

export default CustomerDashboard;
