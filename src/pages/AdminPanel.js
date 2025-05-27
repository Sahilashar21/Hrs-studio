import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

function AdminPanel() {
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data());
    } else {
      await setDoc(userRef, {
        email,
        balance: 0,
        rechargeHistory: [],
        transactionHistory: [],
      });
      setUserData({ email, balance: 0, rechargeHistory: [], transactionHistory: [] });
    }

    setLoading(false);
  };

  const rechargeWallet = async () => {
    const bonus = Math.floor(rechargeAmount * 0.10);
    const total = Number(rechargeAmount) + bonus;

    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
      balance: userData.balance + total,
      rechargeHistory: arrayUnion({
        amount: Number(rechargeAmount),
        bonus,
        date: new Date().toISOString(),
      }),
    });

    fetchUser();
    setRechargeAmount("");
  };

  const deductFromWallet = async (type, amount) => {
    if (userData.balance < amount) {
      alert("Insufficient balance!");
      return;
    }

    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
      balance: userData.balance - amount,
      transactionHistory: arrayUnion({
        type,
        amount,
        date: new Date().toISOString(),
      }),
    });

    fetchUser();
  };

  const getCurrentHour = () => new Date().getHours();
  const songPrice = getCurrentHour() >= 18 && getCurrentHour() < 20 ? 25 : 30;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel – HRS Studio</h2>

      <input
        placeholder="Enter customer email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={fetchUser} style={{ marginLeft: "10px" }}>
        Load User
      </button>

      {loading && <p>Loading user data...</p>}

      {userData && (
        <>
          <h3>Balance: ₹{userData.balance}</h3>

          <h4>Recharge Wallet</h4>
          <input
            type="number"
            placeholder="₹100"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
          />
          <button onClick={rechargeWallet} style={{ marginLeft: "10px" }}>
            Recharge
          </button>

          <h4>Deduct for Items</h4>
          <button onClick={() => deductFromWallet("song", songPrice)}>🎵 Song ₹{songPrice}</button>
          <button onClick={() => deductFromWallet("tea", 10)}>☕ Tea ₹10</button>
          <button onClick={() => deductFromWallet("water", 10)}>💧 Water ₹10</button>
          <button onClick={() => deductFromWallet("coffee", 15)}>🥤 Coffee ₹15</button>

          <h4 style={{ marginTop: "20px" }}>Transaction History</h4>
          <ul>
            {userData.transactionHistory?.map((t, index) => (
              <li key={index}>
                {t.type.toUpperCase()} - ₹{t.amount} on {new Date(t.date).toLocaleString()}
              </li>
            ))}
          </ul>

          <h4>Recharge History</h4>
          <ul>
            {userData.rechargeHistory?.map((r, index) => (
              <li key={index}>
                ₹{r.amount} + ₹{r.bonus} on {new Date(r.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
