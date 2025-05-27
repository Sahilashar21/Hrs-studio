import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "./styles.css";

const allowedAdmins = [
  "hetuashar@gmail.com",
  "sahilashar21@gmail.com",
  "asharhiten@gmail.com",
];

const ADMIN_PASSWORD = "04232129";

function AdminPanel() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [songCount, setSongCount] = useState(1);
  const [teaQty, setTeaQty] = useState(1);
  const [waterQty, setWaterQty] = useState(1);
  const [coffeeQty, setCoffeeQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const authenticateAdmin = () => {
    if (allowedAdmins.includes(adminEmail) && adminPassword === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Access Denied: Invalid email or password.");
    }
  };

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

  if (!authenticated) {
    return (
      <div className="admin-panel">
        <h2>Admin Access Required</h2>
        <input
          placeholder="Enter admin email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        <button onClick={authenticateAdmin}>Login as Admin</button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel – HRS Studio</h2>

      <input
        placeholder="Enter customer email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={fetchUser}>Load User</button>

      {loading && <p>Loading user data...</p>}

      {userData && (
        <>
          <h3>Balance: ₹{userData.balance}</h3>

          <div className="section">
            <h4>Recharge Wallet</h4>
            <input
              type="number"
              placeholder="₹100"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
            />
            <button onClick={rechargeWallet}>Recharge</button>
          </div>

          <div className="section">
            <h4>Deduct for Songs</h4>
            <label>
              Number of Songs:
              <input
                type="number"
                min="1"
                value={songCount}
                onChange={(e) => setSongCount(Number(e.target.value))}
              />
            </label>
            <button onClick={() => deductFromWallet("song", 25 * songCount)}>
              🎵 Song @ ₹25 x {songCount} = ₹{25 * songCount}
            </button>
            <button onClick={() => deductFromWallet("song", 30 * songCount)}>
              🎵 Song @ ₹30 x {songCount} = ₹{30 * songCount}
            </button>
          </div>

          <div className="section">
            <h4>Deduct for Items</h4>
            <div>
              <label>
                Tea Qty:
                <input
                  type="number"
                  min="1"
                  value={teaQty}
                  onChange={(e) => setTeaQty(Number(e.target.value))}
                />
              </label>
              <button onClick={() => deductFromWallet("tea", 10 * teaQty)}>
                ☕ Tea x {teaQty} = ₹{10 * teaQty}
              </button>
            </div>

            <div>
              <label>
                Water Qty:
                <input
                  type="number"
                  min="1"
                  value={waterQty}
                  onChange={(e) => setWaterQty(Number(e.target.value))}
                />
              </label>
              <button onClick={() => deductFromWallet("water", 10 * waterQty)}>
                💧 Water x {waterQty} = ₹{10 * waterQty}
              </button>
            </div>

            <div>
              <label>
                Coffee Qty:
                <input
                  type="number"
                  min="1"
                  value={coffeeQty}
                  onChange={(e) => setCoffeeQty(Number(e.target.value))}
                />
              </label>
              <button onClick={() => deductFromWallet("coffee", 15 * coffeeQty)}>
                🥤 Coffee x {coffeeQty} = ₹{15 * coffeeQty}
              </button>
            </div>
          </div>

          <div className="section">
            <h4>Transaction History</h4>
            {userData.transactionHistory?.length > 0 ? (
              <ul>
                {userData.transactionHistory.map((tx, index) => (
                  <li key={index}>
                    {new Date(tx.date).toLocaleString()} —{" "}
                    <strong>{tx.type}</strong> (₹{tx.amount})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions yet.</p>
            )}
          </div>

          <div className="section">
            <h4>Recharge History</h4>
            {userData.rechargeHistory?.length > 0 ? (
              <ul>
                {userData.rechargeHistory.map((rc, index) => (
                  <li key={index}>
                    {new Date(rc.date).toLocaleString()} — ₹{rc.amount} + Bonus ₹{rc.bonus}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recharges yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
