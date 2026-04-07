"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthScreen from "@/components/AuthScreen";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const { user, loading: authLoading } = useAuth();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [driverScore, setDriverScore] = useState<number>(5);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!origin || !destination) {
      setError("Please enter both origin and destination capabilities.");
      return;
    }
    
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        city: destination,
        driver_score: driverScore.toString(),
        origin: origin,
        destination: destination,
      });

      const response = await fetch(`http://localhost:8000/api/predict?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching the prediction data.");
    } finally {
      setLoading(false);
    }
  };

  const mapUrl = (origin: string, destination: string) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "YOUR_API_KEY";
    return `https://www.google.com/maps/embed/v1/directions?key=${key}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  };

  const riskProps = {
    High: {
      title: "High Risk Route",
      icon: "🛑",
      message: "This route indicates a higher probability of delays or safety issues based on current telemetry and environment data."
    },
    Moderate: {
      title: "Moderate Risk Route",
      icon: "⚠️",
      message: "Standard caution advised. Certain environmental or driver parameters indicate potential friction."
    },
    Low: {
      title: "Optimal Route",
      icon: "✅",
      message: "This route meets all optimization criteria. Environmental and operational telemetry are nominal."
    }
  };

  if (authLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}><div className="spinner blue" style={{borderWidth:'4px'}}></div></div>;
  }

  if (!user) {
    return (
      <div className="app-wrapper">
        <Header isTransparent />
        <AuthScreen />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Header />

      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">Predictive Logistics Routing and Risk Intelligence</h1>
          <p className="hero-subtitle">Optimize your supply chain safety with machine learning powered real-time weather analytics and driver performance assessments, fully integrated with Google Maps.</p>
        </div>
      </section>

      <main className="dashboard">
        <div className="container">
          <h2 className="dashboard-title">
             <span style={{color: 'var(--google-blue)'}}>✦</span> Routing Analysis Console
          </h2>
          
          <div className="main-grid">
            {/* Left Column: Form Settings */}
            <div className="panel">
              <h3 style={{fontFamily: "'Google Sans', sans-serif", fontSize:'18px', fontWeight:500, marginBottom:'24px'}}>Route Input Parameters</h3>
              
              <div className="form-group">
                <label className="form-label">Origin Location</label>
                <div className="input-container">
                  <span className="input-icon">⚲</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Mumbai, India" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Destination Location</label>
                <div className="input-container">
                  <span className="input-icon">◎</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Delhi, India" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{marginTop: '32px'}}>
                <div className="slider-val-box">
                  <label className="form-label" style={{margin:0}}>Driver Confidence Score</label>
                  <div className="slider-score">{driverScore} <span style={{fontSize:'14px', color:'var(--text-muted)'}}>/ 10</span></div>
                </div>
                <div className="slider-wrap">
                  <input 
                    type="range" 
                    min="1" max="10" step="0.1"
                    value={driverScore}
                    onChange={(e) => setDriverScore(parseFloat(e.target.value))}
                    className="slider"
                  />
                  <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px', fontSize:'12px', color:'var(--text-muted)'}}>
                    <span>Novice</span>
                    <span>Experienced</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="error-msg">
                  <span style={{fontWeight:'bold'}}>!</span> {error}
                </div>
              )}

              <button 
                className="btn btn-primary btn-full" 
                onClick={handleAnalyze} 
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner"></div> Computing Route...</>
                ) : (
                  "Generate Route Analysis"
                )}
              </button>
            </div>

            {/* Right Column: Intelligent Output */}
            <div className="output-section">
              {!result && !loading && (
                <>
                  <div className="empty-box" style={{marginBottom: '0'}}>
                    <div style={{fontSize:'48px', marginBottom:'16px'}}>🌐</div>
                    <h3 className="empty-title">Awaiting Telemetry Input</h3>
                    <p className="empty-subtitle">Configure the origin, destination, and driver performance parameters on the left to securely evaluate route viability via our predictive risk engine.</p>
                  </div>
                  
                  <div className="map-container">
                    <div className="map-header">
                      <span style={{color: 'var(--google-blue)'}}>⚲</span> 
                      Global Network Active — Awaiting Coordinates
                    </div>
                    {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
                      <iframe
                        className="map-iframe"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=New+Delhi,India&zoom=4`}
                      ></iframe>
                    ) : (
                      <div style={{width:'100%', height:'450px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'#f8f9fa', color:'#5f6368', padding:'24px', textAlign:'center'}}>
                        <div style={{fontSize:'36px', marginBottom:'16px'}}>📍</div>
                        <h4 style={{fontFamily:"'Google Sans', sans-serif", fontSize:'18px', color:'#202124', marginBottom:'8px'}}>Google Maps Integration Active</h4>
                        <p style={{maxWidth:'300px'}}>Map preview requires the <code>NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> environment variable to be set in your `.env.local` file.</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {loading && (
                <div className="empty-box" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <div className="spinner blue" style={{width:'36px', height:'36px', borderTopColor:'var(--google-blue)', borderWidth:'4px', marginBottom:'24px'}}></div>
                  <h3 className="empty-title">Contacting Global APIs</h3>
                  <p className="empty-subtitle">Resolving route waypoints and synthesizing real-time atmospheric data with trained driver analytics.</p>
                </div>
              )}

              {result && !loading && (
                <>
                  <div className={`risk-banner risk-${result.risk?.toLowerCase()}`}>
                    <div className="risk-icon">
                      {riskProps[result.risk as keyof typeof riskProps]?.icon}
                    </div>
                    <div className="risk-info">
                      <div className="risk-label">Analysis Result</div>
                      <h3 className="risk-title">{riskProps[result.risk as keyof typeof riskProps]?.title}</h3>
                      <p className="risk-desc">{riskProps[result.risk as keyof typeof riskProps]?.message}</p>
                    </div>
                  </div>

                  <div className="weather-cards">
                    <div className="weather-card">
                      <div className="weather-lbl">Current Temp</div>
                      <div className="weather-val">{result.weather?.temperature}°C</div>
                      <div style={{fontSize:'20px'}}>🌡️</div>
                    </div>
                    <div className="weather-card">
                      <div className="weather-lbl">Condition</div>
                      <div className="weather-val" style={{fontSize:'20px'}}>{result.weather?.condition}</div>
                      <div style={{fontSize:'20px'}}>🌤️</div>
                    </div>
                    <div className="weather-card">
                      <div className="weather-lbl">Wind</div>
                      <div className="weather-val">{result.weather?.wind_speed}<span style={{fontSize:'14px', fontWeight:'normal'}}> km/h</span></div>
                      <div style={{fontSize:'20px'}}>💨</div>
                    </div>
                  </div>

                  <div className="map-container">
                    <div className="map-header">
                      <span style={{color: 'var(--google-blue)'}}>⚲</span> 
                      {origin} To {destination}
                    </div>
                    {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
                      <iframe
                        className="map-iframe"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={mapUrl(origin, destination)}
                      ></iframe>
                    ) : (
                      <div style={{width:'100%', height:'450px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'#f8f9fa', color:'#5f6368', padding:'24px', textAlign:'center'}}>
                        <div style={{fontSize:'36px', marginBottom:'16px'}}>📍</div>
                        <h4 style={{fontFamily:"'Google Sans', sans-serif", fontSize:'18px', color:'#202124', marginBottom:'8px'}}>Google Maps Integration Active</h4>
                        <p style={{maxWidth:'300px'}}>Map preview requires the <code>NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> environment variable to be set in your `.env.local` file.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
