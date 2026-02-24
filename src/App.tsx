import { useState, useEffect } from 'react';
import './index.css';

// --- TS Types ---
type ScreenId = 'welcome' | 'qualification' | 'supply_chain' | 'documents' | 'timeline' | 'calculating' | 'dashboard' | 'lead_capture' | 'fallback_qualification' | 'fallback_supplier' | 'fallback_domestic';

interface ScreenerState {
  currentScreen: ScreenId;
  answers: {
    qualification?: string;
    supply_chain?: string;
    documents?: string;
    timeline?: string;
  };
  progress: number;
}

function App() {
  const [state, setState] = useState<ScreenerState>({
    currentScreen: 'welcome',
    answers: {},
    progress: 0,
  });

  const [loadingText, setLoadingText] = useState("Cross-referencing Harmonized Tariff Schedule (HTS) exemptions...");

  // Calculate Progress based on screen
  useEffect(() => {
    const progressMap: Record<ScreenId, number> = {
      'welcome': 0,
      'qualification': 15,
      'supply_chain': 35,
      'documents': 50,
      'timeline': 75,
      'calculating': 90,
      'dashboard': 100,
      'lead_capture': 100,
      'fallback_qualification': 100,
      'fallback_supplier': 100,
      'fallback_domestic': 100
    };
    setState(s => ({ ...s, progress: progressMap[s.currentScreen] }));
  }, [state.currentScreen]);

  // Loading Screen Interstitial Effect
  useEffect(() => {
    if (state.currentScreen === 'calculating') {
      const timer1 = setTimeout(() => setLoadingText("Verifying Importer of Record stipulations..."), 1200);
      const timer2 = setTimeout(() => setLoadingText("Calculating 314-day liquidation windows based on CBP guidelines..."), 2400);
      const timer3 = setTimeout(() => setLoadingText("Building your protective recovery plan..."), 3600);
      const timer4 = setTimeout(() => {
        handleNext('dashboard');
      }, 4800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [state.currentScreen]);

  // --- Handlers ---
  const handleNext = (screen: ScreenId) => {
    setState(s => ({ ...s, currentScreen: screen }));
  };

  const handleAnswer = (question: keyof ScreenerState['answers'], answer: string, nextScreen: ScreenId) => {
    setState(s => ({
      ...s,
      answers: { ...s.answers, [question]: answer },
      currentScreen: nextScreen
    }));
  };

  // --- UI Components ---
  const Logo = () => (
    <div className="header">
      <div className="logo">
        <span className="logo-icon">✦</span> Starlight | Aurora
      </div>
    </div>
  );

  const ProgressBar = () => (
    state.progress > 0 && state.progress <= 100 ? (
      <div className="progress-container fade-enter">
        <div className="progress-bar" style={{ width: `${state.progress}%` }}></div>
      </div>
    ) : null
  );

  const HelpIcon = ({ text }: { text: string }) => {
    const [showHelp, setShowHelp] = useState(false);
    return (
      <div className="help-container">
        <button className="help-button" onClick={() => setShowHelp(!showHelp)}>
          ⓘ {showHelp ? 'Hide Help' : 'What does this mean?'}
        </button>
        {showHelp && <div className="help-text fade-enter">{text}</div>}
      </div>
    );
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'welcome':
        return (
          <div className="fade-enter">
            <h1 className="title">Welcome to Aurora. Let's see if you're owed a tariff rebate.</h1>
            <p className="subtitle">
              The Supreme Court recently struck down the Trump Administration's IEEPA tariffs. Billions of dollars in unlawfully collected duties are now owed to businesses like yours.
            </p>
            <ul className="benefits-list">
              <li>✓ Takes 2 minutes</li>
              <li>✓ We'll check your eligibility across your CBP forms and liquidation status</li>
              <li>✓ 100% free triage</li>
            </ul>
            <button className="primary-button" onClick={() => handleNext('qualification')}>
              Let's Begin ➔
            </button>
          </div>
        );

      case 'qualification':
        return (
          <div className="fade-enter">
            <h1 className="title">First, let's find out what kind of extra duties you paid.</h1>
            <p className="subtitle">
              You can usually find your tariff classification and duty amounts in <strong>Box 33 and Box 38 of your CBP Form 7501 (Entry Summary)</strong>.
              <br /><br />
              <em>Don't worry if you don't have this right now. You can always check with your broker later.</em>
            </p>

            <div className="options-grid">
              <button className="option-card" onClick={() => handleAnswer('qualification', 'A', 'supply_chain')}>
                🛢️ Fentanyl-based tariffs (Canada, Mexico, China) starting Feb 4, 2025
              </button>
              <button className="option-card" onClick={() => handleAnswer('qualification', 'B', 'supply_chain')}>
                🌎 Global "Liberation Day" tariffs starting Apr 5, 2025
              </button>
              <button className="option-card" onClick={() => handleAnswer('qualification', 'C', 'fallback_qualification')}>
                📎 Section 301 (China), Section 232 (Steel/Aluminum), or Antidumping Duties
              </button>
              <button className="option-card" onClick={() => handleAnswer('qualification', 'D', 'supply_chain')}>
                🤷 I'm not sure yet
              </button>
            </div>
            {state.answers.qualification === 'D' && (
              <div className="info-alert fade-enter" style={{ marginTop: '1rem' }}>
                No problem. Check your <strong>CBP Form 7501 (Entry Summary)</strong> or ping your customs broker.
              </div>
            )}
          </div>
        );

      case 'supply_chain':
        return (
          <div className="fade-enter">
            <h1 className="title">Who is legally listed as the 'Importer of Record' (IOR) on your shipments?</h1>
            <HelpIcon text="This is the entity legally responsible for the shipment. Your IOR Number is legally verified on Box 10 of your CBP Form 7501 or Box 2 of your CBP Form 3461 (Customs Release)." />

            <div className="options-grid">
              <button className="option-card" onClick={() => handleAnswer('supply_chain', 'A', 'documents')}>
                🏢 My Business. (We hire a customs broker for clearance).
              </button>
              <button className="option-card" onClick={() => handleAnswer('supply_chain', 'B', 'fallback_supplier')}>
                🚢 My Overseas Supplier. (We buy on Delivered Duty Paid / DDP terms).
              </button>
              <button className="option-card" onClick={() => handleAnswer('supply_chain', 'C', 'fallback_domestic')}>
                🇺🇸 Domestic Purchase. (We buy domestically, but later export or destroy the goods).
              </button>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="fade-enter">
            <h1 className="title">Document Readiness Check</h1>
            <p className="subtitle">To successfully file a legal claim, the government requires specific paperwork. Do you have access to the following documents for your impacted shipments?</p>

            <ul className="checklist">
              <li>📄 <strong>CBP Form 7501 (Entry Summary)</strong> (The master ledger of your import duties)</li>
              <li>📄 <strong>CBP Form 3461 (Entry/Immediate Delivery)</strong> (Proof of release from customs)</li>
              <li>📄 <strong>Commercial Invoices & Packing Lists</strong> (Proof of valuation and origin)</li>
              <li>📄 <strong>Customs Power of Attorney (POA)</strong> (Authorizing your broker)</li>
            </ul>

            <div className="options-grid">
              <button className="option-card" onClick={() => handleAnswer('documents', 'A', 'timeline')}>
                📁 Yes, we have a digital archive ready.
              </button>
              <button className="option-card" onClick={() => handleAnswer('documents', 'B', 'timeline')}>
                📞 No, our customs broker holds all of these.
              </button>
              <button className="option-card" onClick={() => handleAnswer('documents', 'C', 'timeline')}>
                🤷 I need to track these down.
              </button>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="fade-enter">
            <h1 className="title">Roughly when did these shipments arrive?</h1>
            <HelpIcon text="The government creates hard deadlines based on when a shipment 'liquidates'—usually 314 days after the Date of Entry (Box 31 on CBP Form 7501). We just want to ensure you don't miss yours." />

            <div className="options-grid" style={{ marginTop: '1.5rem' }}>
              <button className="option-card" onClick={() => handleAnswer('timeline', 'A', 'calculating')}>
                📅 Newer than 314 days (Open/Unliquidated)
              </button>
              <button className="option-card" onClick={() => handleAnswer('timeline', 'B', 'calculating')}>
                🗓️ Older than 314 days (Closed/Liquidated)
              </button>
              <button className="option-card" onClick={() => handleAnswer('timeline', 'C', 'calculating')}>
                🗂️ A mix of both
              </button>
            </div>
          </div>
        );

      case 'calculating':
        return (
          <div className="loading-container fade-enter">
            <div className="spinner"></div>
            <p className="loading-text">{loadingText}</p>
          </div>
        );

      case 'dashboard':
        return (
          <div className="fade-enter">
            <h1 className="title">Your Aurora Recovery Dashboard</h1>
            <p className="subtitle">Based on an analysis of your supply chain and liquidation timeline, here is your legally sound action plan.</p>

            {(state.answers.timeline === 'A' || state.answers.timeline === 'C') && (
              <div className="track-card track-green fade-enter">
                <h3>🟢 Fast Track: PSC Eligible (Newer than 314 days)</h3>
                <p>File a <strong>Post-Summary Correction (PSC)</strong> now to pull the tariffs before the entry closes and liquidates.</p>
              </div>
            )}

            {(state.answers.timeline === 'B' || state.answers.timeline === 'C') && (
              <div className="track-card track-yellow fade-enter">
                <h3>🟡 Protective Track: 1581(i) Action (Older than 314 days)</h3>
                <p>The safest path is to file a <strong>Section 1581(i) lawsuit</strong> in the Court of International Trade to preserve your right to the refund.</p>
              </div>
            )}

            <div className="dashboard-section">
              <h3>Immediate Next Steps</h3>
              <ol className="steps-list">
                <li><strong>Compile the Master File:</strong> Pull your <strong>CBP Form 7501s</strong>, <strong>CBP Form 3461s</strong>, <strong>Commercial Invoices</strong>, and <strong>Packing Lists</strong>. Save local backups.</li>
                <li><strong>Audit With Your Broker:</strong> Ask for a spreadsheet of all entry numbers, HTS tariff classifications, and projected liquidation dates from their ABI (<strong>Automated Broker Interface</strong>) system.</li>
                <li><strong>Draft the Legal Strategy:</strong> Share this verified summary with your trade attorney to execute the PSC or 1581(i) action immediately.</li>
              </ol>
            </div>

            <div className="info-alert pro-tip">
              <strong>💡 Starlight Pro-Tip: Unlock Your Customs Bond (CBP Form 301)</strong><br />
              The tariffs likely forced you to increase your Continuous Customs Bond (<strong>CBP Form 301</strong>). Send your recovery documentation to your surety company immediately to start the review process and release your tied-up capital.
            </div>

            <div className="dashboard-actions">
              <button className="action-btn" onClick={() => handleNext('lead_capture')}>📧 Email this summary to my broker</button>
              <button className="action-btn" onClick={() => handleNext('lead_capture')}>🤝 Connect me with a vetted trade attorney</button>
              <button className="action-btn" onClick={() => handleNext('lead_capture')}>🖨️ Print my thorough compliance checklist</button>
            </div>

            <button className="text-button" onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>
              Start Over
            </button>
          </div>
        );

      case 'lead_capture':
        return (
          <div className="fade-enter">
            <h1 className="title">Secure Your Aurora Recovery Plan</h1>
            <p className="subtitle">
              Share your email, and we will alert you when the full screening is live with our partners, and send you your verified results.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email');

              // This is a Google Forms backend submission template. 
              // The user will need to replace FORM_ID and the entry.123456 IDs with their actual Google Form field IDs.
              // To submit silently without leaving the page, we use a hidden iframe or simple fetch (no-cors).
              const formActionBase = "https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse";
              const params = new URLSearchParams();
              params.append('entry.111111', email as string);
              params.append('entry.222222', state.answers.qualification || 'unknown');
              params.append('entry.333333', state.answers.supply_chain || 'unknown');
              params.append('entry.444444', state.answers.documents || 'unknown');
              params.append('entry.555555', state.answers.timeline || 'unknown');

              // Fire and forget submission
              fetch(`${formActionBase}?${params.toString()}`, { mode: 'no-cors' })
                .then(() => {
                  alert("Thank you! Your information has been securely submitted.");
                  handleNext('welcome'); // or somewhere else
                })
                .catch(() => {
                  alert("There was an error, but in a real app this would submit to the Google Form.");
                });
            }}>
              <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Business Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '1rem', fontFamily: 'Inter' }}
                />
              </div>
              <button type="submit" className="primary-button">Submit & Get Updates</button>
            </form>
            <button className="text-button" onClick={() => handleNext('dashboard')} style={{ marginTop: '1.5rem' }}>
              ← Back to Dashboard
            </button>
          </div>
        );

      // OFF RAMPS
      case 'fallback_qualification':
        return (
          <div className="fade-enter">
            <h1 className="title">These specific tariffs aren't currently covered.</h1>
            <p className="subtitle">
              Ah, unfortunately, Section 301, 232, and Antidumping duties aren't covered by this specific Supreme Court ruling.
              But trade law changes fast. We can keep you updated on future changes.
            </p>
            <button className="primary-button" onClick={() => window.location.reload()}>Return Home</button>
          </div>
        );

      case 'fallback_supplier':
        return (
          <div className="fade-enter">
            <h1 className="title">Your supplier holds the right to this rebate.</h1>
            <p className="subtitle">
              Because your supplier is the Importer of Record on DDP terms, the rebate legally belongs to them. <br /><br />
              <strong>Action:</strong> Renegotiate with your supplier to claw back your costs.
            </p>
            <button className="primary-button" onClick={() => window.location.reload()}>Return Home</button>
          </div>
        );

      case 'fallback_domestic':
        return (
          <div className="fade-enter">
            <h1 className="title">Explore Duty Drawback Instead.</h1>
            <p className="subtitle">
              Since you purchased these goods domestically, you cannot file a direct claim for these IEEPA tariffs. However, you might recover this via <strong>Duty Drawback</strong> if you export or destroy the goods. <br /><br />
              Explore a specialist or software solution for drawback recovery.
            </p>
            <button className="primary-button" onClick={() => window.location.reload()}>Return Home</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Logo />
      <ProgressBar />
      {renderScreen()}
      <div className="disclaimer">
        &gt; [!WARNING]<br />
        <strong>NOT LEGAL ADVICE</strong><br />
        The Aurora Screener is a lightweight triage tool designed to help you identify where your business stands in the IEEPA tariff recovery process. This is for informational purposes only and does not constitute legal counsel. Please consult a qualified trade attorney for official guidance.
        <br /><br />
        © 2026 Starlight ✦ Navigating Government, Together
      </div>
    </div>
  );
}

export default App;
