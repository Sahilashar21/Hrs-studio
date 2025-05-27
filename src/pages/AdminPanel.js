import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "./styles.css"; // Import the CSS

function AdminPanel() {
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [songCount, setSongCount] = useState(1);
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
                Tea Quantity:
                <input type="number" min="1" value={teaCount} onChange={(e) => setTeaCount(Number(e.target.value))} />
              </label>
              <button onClick={() => deductFromWallet("tea", 10 * teaCount)}>
                ☕ Tea @ ₹10 x {teaCount} = ₹{10 * teaCount}
              </button>
            </div>

            <div>
              <label>
                Water Quantity:
                <input type="number" min="1" value={waterCount} onChange={(e) => setWaterCount(Number(e.target.value))} />
              </label>
              <button onClick={() => deductFromWallet("water", 10 * waterCount)}>
                💧 Water @ ₹10 x {waterCount} = ₹{10 * waterCount}
              </button>
            </div>

            <div>
              <label>
                Coffee Quantity:
                <input type="number" min="1" value={coffeeCount} onChange={(e) => setCoffeeCount(Number(e.target.value))} />
              </label>
              <button onClick={() => deductFromWallet("coffee", 15 * coffeeCount)}>
                🥤 Coffee @ ₹15 x {coffeeCount} = ₹{15 * coffeeCount}
              </button>
            </div>
          </div>


          <div className="section">
            <h4>Transaction History</h4>
            {userData.transactionHistory?.length > 0 ? (
              <ul>
                {userData.transactionHistory.map((tx, index) => (
                  <li key={index}>
                    {new Date(tx.date).toLocaleString()} — <strong>{tx.type}</strong> (₹{tx.amount})
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
