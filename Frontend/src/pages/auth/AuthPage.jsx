import React, { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AvatarStack } from "../../components/common/Avatar.jsx";
import { api } from "../../lib/api.js";

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === "register";
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const credentials = {
      email: form.get("email").toString().trim(),
      password: form.get("password").toString(),
    };

    try {
      const session = isRegister
        ? await api.register({ ...credentials, full_name: form.get("name").toString().trim() })
        : await api.login(credentials);
      onAuthenticated(session);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="auth-page"><section className="auth-brand-panel"><div className="auth-brand"><span className="brand-mark"><Sparkles size={18} fill="currentColor" /></span><span className="brand-name">orbit</span></div><div className="auth-quote"><span className="auth-quote-mark">“</span><h1>Good work happens when everyone is in orbit.</h1><p>A calmer space for teams to plan, build, and make things happen together.</p><div className="auth-people"><AvatarStack ids={[0, 1, 2, 3]} /><span>Made for teams that care about the details.</span></div></div><span className="auth-decoration decoration-one" /><span className="auth-decoration decoration-two" /></section><section className="auth-form-panel"><div className="auth-form-wrap"><p className="eyebrow">{isRegister ? "START YOUR WORKSPACE" : "WELCOME BACK"}</p><h2>{isRegister ? "Create your account" : "Sign in to Orbit"}</h2><p className="auth-subtitle">{isRegister ? "Let’s get your team moving in the same direction." : "Your team and your projects are waiting for you."}</p><form className="form-stack" onSubmit={submit}><button type="button" className="button button-outline google-button" onClick={() => setError("Google sign-in is not configured on this backend.")}><span className="google-g">G</span>Continue with Google</button><div className="auth-divider"><span />or continue with email<span /></div>{isRegister && <label>Your name<input name="name" placeholder="Olivia Rhye" required /></label>}<label>Email address<input name="email" type="email" placeholder="you@company.com" required /></label><label>Password<div className="password-input"><input name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" minLength="8" required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div></label>{!isRegister && <button type="button" className="forgot-link" onClick={() => setError("Password reset is not configured on this backend.")}>Forgot password?</button>}{error && <p className="auth-error" role="alert">{error}</p>}<button type="submit" className="button button-primary auth-submit" disabled={submitting}>{submitting ? "Please wait..." : isRegister ? "Create account" : "Sign in"}<ArrowRight size={15} /></button></form><p className="auth-switch">{isRegister ? "Already have an account?" : "Don’t have an account?"} <button onClick={() => { setError(""); setMode(isRegister ? "login" : "register"); }}>{isRegister ? "Sign in" : "Create an account"}</button></p><p className="auth-terms">By continuing, you agree to our <button onClick={() => window.alert("Terms of service")}>Terms</button> and <button onClick={() => window.alert("Privacy policy")}>Privacy Policy</button>.</p></div></section></main>;
}
