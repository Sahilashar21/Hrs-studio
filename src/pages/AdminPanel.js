import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
} from "firebase/firestore";
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

  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [editedBalance, setEditedBalance] = useState(0);

  const [allUsers, setAllUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);

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

  const updateTransaction = async (index, updatedTx) => {
    const newList = [...userData.transactionHistory];
    newList[index] = updatedTx;

    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
      transactionHistory: newList,
    });

    fetchUser();
  };

  const deleteTransaction = async (index) => {
    const newList = [...userData.transactionHistory];
    newList.splice(index, 1);

    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
      transactionHistory: newList,
    });

    fetchUser();
  };

  const updateRecharge = async (index, updatedRc) => {
    const newList = [...userData.rechargeHistory];
    newList[index] = updatedRc;

    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
      rechargeHistory: newList,
    });

    fetchUser();
  };

  const deleteRecharge = async (index) => {
    const newList = [...userData.rechargeHistory];
    newList.splice(index, 1);

    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
      rechargeHistory: newList,
    });

    fetchUser();
  };

  const fetchAllUsers = async () => {
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);
    const usersList = userSnapshot.docs.map((doc) => doc.data());
    setAllUsers(usersList);
    setShowAllUsers(true);
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
        onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
      />
      <button onClick={fetchUser}>Load User</button>
      <button onClick={fetchAllUsers}>📋 View All Users</button>

      {loading && <p>Loading user data...</p>}

      {showAllUsers && (
        <div className="section">
          <h3>All Users</h3>
          <ul>
            {allUsers.map((user, idx) => (
              <li key={idx}>
                <strong>{user.email}</strong> — ₹{user.balance}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowAllUsers(false)}>🔙 Hide All Users</button>
        </div>
      )}

      {userData && !showAllUsers && (
        <>
          <h3>
            Balance: ₹
            {isEditingBalance ? (
              <>
                <input
                  type="number"
                  value={editedBalance}
                  onChange={(e) => setEditedBalance(Number(e.target.value))}
                />
                <button
                  onClick={async () => {
                    const userRef = doc(db, "users", email);
                    await updateDoc(userRef, { balance: editedBalance });
                    setIsEditingBalance(false);
                    fetchUser();
                  }}
                >
                  ✅ Save
                </button>
                <button onClick={() => setIsEditingBalance(false)}>❌ Cancel</button>
              </>
            ) : (
              <>
                {userData.balance}
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setEditedBalance(userData.balance);
                    setIsEditingBalance(true);
                  }}
                >
                  ✏️ Edit Balance
                </button>
              </>
            )}
          </h3>

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
            {[{ label: "Tea", qty: teaQty, setQty: setTeaQty, price: 10 },
              { label: "Water", qty: waterQty, setQty: setWaterQty, price: 10 },
              { label: "Coffee", qty: coffeeQty, setQty: setCoffeeQty, price: 15 }
            ].map((item) => (
              <div key={item.label}>
                <label>
                  {item.label} Qty:
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => item.setQty(Number(e.target.value))}
                  />
                </label>
                <button onClick={() => deductFromWallet(item.label.toLowerCase(), item.price * item.qty)}>
                  {item.label} x {item.qty} = ₹{item.price * item.qty}
                </button>
              </div>
            ))}
          </div>

          <div className="section">
            <h4>Transaction History</h4>
            {userData.transactionHistory?.length > 0 ? (
              <ul>
                {userData.transactionHistory.map((tx, index) => (
                  <li key={index}>
                    {new Date(tx.date).toLocaleString()} — <strong>{tx.type}</strong> (₹{tx.amount})
                    <button
                      onClick={() => {
                        const newAmount = prompt("Edit amount", tx.amount);
                        if (newAmount !== null) {
                          updateTransaction(index, {
                            ...tx,
                            amount: Number(newAmount),
                          });
                        }
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteTransaction(index)}>🗑️ Delete</button>
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
                    <button
                      onClick={() => {
                        const newAmount = prompt("Edit amount", rc.amount);
                        if (newAmount !== null) {
                          const newBonus = Math.floor(Number(newAmount) * 0.10);
                          updateRecharge(index, {
                            ...rc,
                            amount: Number(newAmount),
                            bonus: newBonus,
                          });
                        }
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteRecharge(index)}>🗑️ Delete</button>
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
