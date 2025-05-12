import { useState } from "react";
import './App.css';
import keychainLogo from "./assets/keychainlogo.png";
import failedImage from "./assets/failedImage.png";
import successImage from "./assets/successImage.png";
import { Spinner } from "./components/spinner";

const App = () => {
  const [step, setStep] = useState(1);
  const [recipient] = useState("@networkstate");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("HIVE");
  const [memo, setMemo] = useState("");
  const [sender, setSender] = useState("");
  const [msg, setMsg] = useState("");

  const transfer = (account, to, amount, memo, currency, enforce = true, rpc = null) => {
    return new Promise((resolve, reject) => {
      if (!window.hive_keychain) {
        return reject({ message: "Hive Keychain is not installed" });
      }
      console.log(account, to.replace(/^@/, ""), amount, memo, currency, enforce = true, rpc = null)
  
      window.hive_keychain.requestTransfer(
        account,
        to.replace(/^@/, ""),
        amount,
        memo,
        currency,
        (response) => {
          if (!response.success) {
            return reject({ message: "Operation cancelled" });
          }
          resolve(response);
        },
        enforce,
        rpc
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep("pending");

    try {
      const res = await transfer(sender, recipient, Number(amount).toFixed(3), memo, token, true);
      console.log("Transaction broadcasted successfully!", res);
      setStep("success");
      setAmount("")
      setToken("HIVE")
      setMemo("")
      setSender("")
    } catch (err) {
      console.error("Transaction failed:", err.message);
      setStep("fail");
    }
  };

  const stepChanged = () => {
    if(!amount) {
      setMsg("Amount is required");
      return;
    }
    setMsg("")
    setStep(2);
  };

  return (
    <div className="app-container">
      <h2 className="header-title">NETWORK STATE</h2>
      <form className="transfer-form">
        <p className="warning">{msg}</p>
        {step === 1 && (
          <div className="step-1">
            <div className="form-field">
              <label className="form-label">Recipient:</label>
              <input
                className="form-input"
                type="text"
                value={recipient}
                readOnly
              />
            </div>

            <div className="form-field">
              <label className="form-label">Amount:</label>
              <input
                className="form-input"
                type="number"
                step="0.001"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Currency:</label>
              <select
                className="form-select"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              >
                <option value="HIVE">HIVE</option>
                <option value="HBD">HBD</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Memo:</label>
              <input
                className="form-input"
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={stepChanged}
            >
              <img className="keychain-logo" src={keychainLogo} alt="Keychain Logo" />
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-2">
            <div className="form-field">
              <label className="form-label">Your username:</label>
              <input
                className="form-input"
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>

            <button className="submit-btn" onClick={handleSubmit}>
              <img className="keychain-logo" src={keychainLogo} alt="Keychain Logo" />
              Send with Keychain
            </button>

            <button className="back-btn test-btn" onClick={(e)=> {
              e.preventDefault()
              setStep(1)
              setSender("")
              }}>Go back</button>
          </div>
        )}

        {step === "pending" && (
          <div className="status-message">
            <Spinner />
            <p>Transaction is pending...</p>
          </div>
        )}

        {step === "success" && (
          <div className="status-message success">
            <img className="status-images" src={successImage} alt="" />
            <p>Transaction successful!</p>
            <button className="success-btn" onClick={(e)=> {
              e.preventDefault()
              setStep(1)
            }}>Completed</button>
          </div>
        )}

        {step === "fail" && (
          <div className="status-message fail">
            <img className="status-images" src={failedImage} alt="" />
            <p>Transaction failed. Please try again.</p>
            <button className="back-btn" onClick={()=> setStep(2)}>Go back</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default App;
