import { useState } from "react";
import './App.css';
import keychainLogo from "./assets/keychainlogo.png";
import failedImage from "./assets/failedImage.png";
import successImage from "./assets/successImage.png";
import { Spinner } from "./components/spinner";
import { HiveQRCode } from "./components/hive-qr";

const App = () => {
  const [step, setStep] = useState(1);
  const [recipient] = useState("@networkstate");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("HIVE");
  const [memo, setMemo] = useState("Value4Value donation for this work");
  const [sender, setSender] = useState("");
  const [msg, setMsg] = useState("");
  const [paymentMode, setPaymentMode] = useState('keychain');

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

    if(!sender) {
      setMsg("Please enter sender's username");
      return;
    }

    setStep("pending");
    setMsg("")

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

  const op = [
    "transfer",
    {
      to: "networkstate",
      amount: `${amount} ${token}`,
      memo,
    },
  ];

  return (
    <div className="app-container">
      <div className="page-title">
        <h2>Make a Value4Value donation to the authors of the book</h2>
        <h3>“The Digital Community Manifesto”</h3>
      </div>
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
            <div className="toggle-buttons">
              <span
                className={`toggle-btn ${paymentMode === 'keychain' ? 'active' : ''}`}
                onClick={() => setPaymentMode('keychain')}
              >
                Pay with Keychain
              </span>
              <span
                className={`toggle-btn ${paymentMode === 'qr' ? 'active' : ''}`}
                onClick={() => setPaymentMode('qr')}
              >
                Scan QR Code
              </span>
            </div>

            {paymentMode === 'keychain' && (
              <>
                <div className="form-field">
                  <p>Enter the username of the account that's paying</p>
                  <label className="form-label">username:</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    value={sender}
                    onChange={(e) => setSender(e.target.value.toLowerCase())}
                  />
                </div>

                <button className="submit-btn" onClick={handleSubmit}>
                  <img className="keychain-logo" src={keychainLogo} alt="Keychain Logo" />
                  Send with Keychain
                </button>
              </>
            )}

            {paymentMode === 'qr' && (
              <div className="qr-wrapper">
                <p>Scan QR code with Keychain mobile app to complete payment</p>
                <HiveQRCode op={op} withLogo={true} size={200} />
              </div>
            )}

            <button
              className="back-btn test-btn"
              onClick={(e) => {
                e.preventDefault();
                setStep(1);
                setSender("");
              }}
            >
              Go back
            </button>
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
