import { useState, useEffect } from "react"; 
import axios from "axios";
import './App.css'; // Ensure this is correctly linked

const CouponManager = () => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [coupons, setCoupons] = useState([]);

  // Fetch coupons on load
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:3000/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons", err);
    }
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/create-coupon", {
        code,
        discount,
        expirationDate,
      });
      alert("Coupon created successfully!");
      fetchCoupons();
    } catch (err) {
      console.error("Error creating coupon", err);
    }
  };

  const redeemCoupon = async (code) => {
    try {
      await axios.post("http://localhost:3000/redeem-coupon", { code });
      alert("Coupon redeemed successfully!");
      fetchCoupons();
    } catch (err) {
      console.error("Error redeeming coupon", err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Coupon Manager</h1>
      <form className="coupon-form" onSubmit={createCoupon}>
        <input
          type="text"
          placeholder="Coupon Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
        />
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />
        <button type="submit" className="create-button">Create Coupon</button>
      </form>

      <h2 className="subtitle">Active Coupons</h2>
      <ul className="coupon-list">
        {coupons.map((coupon) => (
          <li key={coupon.code} className="coupon-item">
            <span>{coupon.code} - {coupon.discount}% off - Expires: {coupon.expirationDate}</span>
            <button className="redeem-button" onClick={() => redeemCoupon(coupon.code)}>Redeem</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CouponManager;
