import React, { useState } from "react";

export default function MfaSetupWizard({ onEnableMfa }) {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      setIsCompleted(true);
      onEnableMfa();
    }
  };

  return (
    <div className="sec-card">
      <h3 className="text-lg font-extrabold text-white mb-1">🔐 Two-Factor Authentication (2FA / MFA)</h3>
      <p className="text-xs text-slate-400 mb-6">Enhance clinical account security using TOTP Authenticator apps</p>

      {isCompleted ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h4 className="font-bold text-white">MFA Security Active</h4>
            <p className="text-emerald-300">Account protected with hardware TOTP authentication codes.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center font-mono text-[10px] text-slate-900 text-center font-bold">
                  [QR CODE MOCK]
                  <br />
                  MEDTRACK-MFA
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white">Step 1: Scan QR Code</p>
                  <p className="text-slate-400">
                    Open Google Authenticator or Authy on your mobile device and scan the code.
                  </p>
                  <p className="font-mono text-blue-400 text-[11px]">Secret Key: JBSWY3DPEHPK3PXP</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition"
              >
                Proceed to Verification →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify} className="space-y-3">
              <label className="block font-semibold text-slate-300 uppercase">
                Step 2: Enter 6-Digit Code from App
              </label>
              <input
                type="text"
                maxLength="6"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  Verify & Enable
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
