import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  Activity,
  Bell,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Droplets,
  HeartPulse,
  Home,
  Info,
  LayoutDashboard,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  Plus,
  ScanLine,
  Send,
  Settings,
  Sparkles,
  Stethoscope,
  Utensils,
  X,
} from "lucide-react"

type Reading = {
  id: number
  type: "blood-pressure" | "glucose"
  primary: string
  secondary?: string
  pulse?: string
  context: string
  time: string
}

type ModalView = "vital" | "meal" | "assistant" | null

const initialReadings: Reading[] = [
  {
    id: 1,
    type: "blood-pressure",
    primary: "124",
    secondary: "78",
    pulse: "68",
    context: "At rest",
    time: "Today, 8:12 AM",
  },
  {
    id: 2,
    type: "glucose",
    primary: "108",
    context: "Fasting",
    time: "Today, 7:48 AM",
  },
]

const navItems = [
  { label: "Home", icon: Home },
  { label: "Trends", icon: Activity },
  { label: "Assistant", icon: MessageCircle },
  { label: "Profile", icon: CircleUserRound },
]

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      className="icon-button"
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Brand() {
  return (
    <div className="brand" aria-label="BeSmart health">
      <div className="brand-mark">
        <HeartPulse size={20} strokeWidth={2.2} />
      </div>
      <span>
        Be<span>Smart</span>
      </span>
    </div>
  )
}

function Sidebar({ onAssistant }: { onAssistant: () => void }) {
  return (
    <aside className="sidebar">
      <Brand />
      <nav className="side-nav" aria-label="Primary navigation">
        <p className="nav-label">Workspace</p>
        <button className="nav-item active" type="button">
          <LayoutDashboard size={18} />
          Overview
        </button>
        <button className="nav-item" type="button">
          <Activity size={18} />
          Health trends
        </button>
        <button className="nav-item" type="button" onClick={onAssistant}>
          <Sparkles size={18} />
          AI assistant
          <span className="nav-pill">AI</span>
        </button>
        <p className="nav-label nav-label-secondary">Manage</p>
        <button className="nav-item" type="button">
          <Stethoscope size={18} />
          Care team
        </button>
        <button className="nav-item" type="button">
          <Settings size={18} />
          Preferences
        </button>
      </nav>
      <div className="privacy-note">
        <div className="privacy-icon">
          <LockKeyhole size={16} />
        </div>
        <div>
          <strong>Your data, protected</strong>
          <p>Private by design and always in your control.</p>
        </div>
      </div>
      <button className="profile-chip" type="button">
        <span className="avatar">JD</span>
        <span>
          <strong>Jordan Davis</strong>
          <small>My health profile</small>
        </span>
        <ChevronDown size={16} />
      </button>
    </aside>
  )
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <Brand />
      </div>
      <div className="topbar-status">
        <span className="status-dot" />
        <span>All systems normal</span>
      </div>
      <div className="topbar-actions">
        <IconButton label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </IconButton>
        <button className="top-avatar" type="button" aria-label="Open profile">
          JD
        </button>
      </div>
    </header>
  )
}

function MetricCard({
  label,
  value,
  unit,
  detail,
  meta,
  icon,
  tone,
}: {
  label: string
  value: string
  unit: string
  detail: string
  meta: string
  icon: React.ReactNode
  tone: "blue" | "coral" | "violet"
}) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <div className="metric-heading">
        <p>{label}</p>
        <span className="good-tag">
          <Check size={12} /> In range
        </span>
      </div>
      <div className="metric-value">
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
      <div className="metric-footer">
        <span>{detail}</span>
        <small>{meta}</small>
      </div>
    </article>
  )
}

function TrendChart() {
  return (
    <div className="trend-chart" aria-label="Seven-day blood glucose trend">
      <div className="chart-y-axis">
        <span>140</span>
        <span>120</span>
        <span>100</span>
        <span>80</span>
      </div>
      <div className="chart-area">
        <span className="target-label">Target range</span>
        <div className="target-band" />
        <svg
          viewBox="0 0 640 180"
          role="img"
          aria-label="Mostly stable glucose readings over seven days"
        >
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity=".2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="chart-fill"
            d="M0 124 C40 120 50 96 92 102 S145 138 184 116 S245 70 276 86 S330 132 368 112 S420 56 460 78 S528 124 552 98 S610 66 640 74 L640 180 L0 180 Z"
          />
          <path
            className="chart-line"
            d="M0 124 C40 120 50 96 92 102 S145 138 184 116 S245 70 276 86 S330 132 368 112 S420 56 460 78 S528 124 552 98 S610 66 640 74"
          />
          {[
            ["0", "124"],
            ["92", "102"],
            ["184", "116"],
            ["276", "86"],
            ["368", "112"],
            ["460", "78"],
            ["552", "98"],
            ["640", "74"],
          ].map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="4.5" className="chart-point" />
          ))}
        </svg>
        <div className="chart-x-axis">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  icon,
  title,
  detail,
  tone,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  detail: string
  tone: string
  onClick: () => void
}) {
  return (
    <button className="quick-action" type="button" onClick={onClick}>
      <span className={`quick-icon ${tone}`}>{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight size={18} />
    </button>
  )
}

function VitalModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (reading: Reading) => void
}) {
  const [readingType, setReadingType] = useState<"blood-pressure" | "glucose">(
    "blood-pressure",
  )
  const [primary, setPrimary] = useState("124")
  const [secondary, setSecondary] = useState("78")
  const [pulse, setPulse] = useState("68")
  const [context, setContext] = useState("At rest")

  function submit(event: FormEvent) {
    event.preventDefault()
    onSave({
      id: Date.now(),
      type: readingType,
      primary,
      secondary: readingType === "blood-pressure" ? secondary : undefined,
      pulse: readingType === "blood-pressure" ? pulse : undefined,
      context,
      time: "Just now",
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vital-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">New measurement</span>
            <h2 id="vital-title">Log a vital</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        <form onSubmit={submit}>
          <div className="segmented">
            <button
              className={readingType === "blood-pressure" ? "selected" : ""}
              type="button"
              onClick={() => setReadingType("blood-pressure")}
            >
              Blood pressure
            </button>
            <button
              className={readingType === "glucose" ? "selected" : ""}
              type="button"
              onClick={() => setReadingType("glucose")}
            >
              Blood glucose
            </button>
          </div>
          <div className="form-grid">
            <label>
              <span>
                {readingType === "blood-pressure" ? "Systolic" : "Glucose"}
              </span>
              <div className="input-with-unit">
                <input
                  required
                  inputMode="numeric"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                />
                <small>
                  {readingType === "blood-pressure" ? "mmHg" : "mg/dL"}
                </small>
              </div>
            </label>
            {readingType === "blood-pressure" && (
              <>
                <label>
                  <span>Diastolic</span>
                  <div className="input-with-unit">
                    <input
                      required
                      inputMode="numeric"
                      value={secondary}
                      onChange={(e) => setSecondary(e.target.value)}
                    />
                    <small>mmHg</small>
                  </div>
                </label>
                <label>
                  <span>Pulse</span>
                  <div className="input-with-unit">
                    <input
                      required
                      inputMode="numeric"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                    />
                    <small>bpm</small>
                  </div>
                </label>
              </>
            )}
            <label className={readingType === "glucose" ? "" : "context-field"}>
              <span>Context</span>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
              >
                <option>At rest</option>
                <option>Fasting</option>
                <option>Before meal</option>
                <option>After meal</option>
                <option>After activity</option>
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <button
              className="button secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="button primary" type="submit">
              <Check size={17} /> Save measurement
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function MealModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (meal: string) => void
}) {
  const [meal, setMeal] = useState("")
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal-card meal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">Nutrition</span>
            <h2 id="meal-title">Log your meal</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        <div className="meal-upload">
          <div className="meal-upload-icon">
            <Camera size={25} />
          </div>
          <strong>Add a meal photo</strong>
          <p>Photo analysis will be available when Gemini is connected.</p>
          <label className="button secondary file-button">
            <input type="file" accept="image/*" />
            Choose photo
          </label>
        </div>
        <label className="meal-description">
          <span>What did you eat?</span>
          <textarea
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            placeholder="e.g. Grilled chicken, brown rice and vegetables"
          />
        </label>
        <div className="modal-actions">
          <button className="button secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button primary"
            type="button"
            disabled={!meal.trim()}
            onClick={() => onSave(meal)}
          >
            <Check size={17} /> Save meal
          </button>
        </div>
      </section>
    </div>
  )
}

function AssistantModal({ onClose }: { onClose: () => void }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi Jordan. I can help you understand the health data on this screen. What would you like to know?",
    },
  ])
  const [thinking, setThinking] = useState(false)

  function ask(event: FormEvent) {
    event.preventDefault()
    const clean = question.trim()
    if (!clean) return
    setMessages((current) => [...current, { role: "user", text: clean }])
    setQuestion("")
    setThinking(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Your recent readings look steady and within the target ranges shown. Keep logging around the same times each day so we can spot meaningful patterns. This is general guidance, not medical advice.",
        },
      ])
      setThinking(false)
    }, 700)
  }

  return (
    <div
      className="modal-backdrop assistant-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="assistant-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="assistant-header">
          <div className="ai-orb">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 id="assistant-title">BeSmart assistant</h2>
            <p>
              <span className="status-dot" /> Preview mode
            </p>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        <div className="messages">
          <div className="assistant-context">
            <Info size={14} /> Gemini responses will activate after secure
            backend setup.
          </div>
          {messages.map((message, index) => (
            <div
              className={`message ${message.role}`}
              key={`${message.role}-${index}`}
            >
              {message.text}
            </div>
          ))}
          {thinking && (
            <div className="message assistant thinking">
              <LoaderCircle size={17} /> Reviewing your recent data...
            </div>
          )}
        </div>
        <form className="chat-form" onSubmit={ask}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your health trends..."
            aria-label="Ask the assistant"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!question.trim() || thinking}
          >
            <Send size={18} />
          </button>
        </form>
        <p className="medical-note">
          BeSmart does not replace professional medical advice.
        </p>
      </section>
    </div>
  )
}

function BottomNav({ onAssistant }: { onAssistant: () => void }) {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {navItems.map(({ label, icon: Icon }) => (
        <button
          className={label === "Home" ? "active" : ""}
          type="button"
          key={label}
          onClick={label === "Assistant" ? onAssistant : undefined}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const [readings, setReadings] = useState<Reading[]>(() => {
    const saved = window.localStorage.getItem("besmart-readings")
    return saved ? JSON.parse(saved) : initialReadings
  })
  const [modal, setModal] = useState<ModalView>(null)
  const [mealLogged, setMealLogged] = useState(
    () => window.localStorage.getItem("besmart-meal") === "true",
  )
  const [toast, setToast] = useState("")
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.localStorage.setItem("besmart-readings", JSON.stringify(readings))
  }, [readings])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(""), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const latestPressure = useMemo(
    () =>
      readings.find((reading) => reading.type === "blood-pressure") ??
      initialReadings[0],
    [readings],
  )
  const latestGlucose = useMemo(
    () =>
      readings.find((reading) => reading.type === "glucose") ??
      initialReadings[1],
    [readings],
  )
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date())

  function saveReading(reading: Reading) {
    setReadings((current) => [reading, ...current])
    setModal(null)
    setToast("Measurement saved to this device")
  }

  function saveMeal() {
    window.localStorage.setItem("besmart-meal", "true")
    setMealLogged(true)
    setModal(null)
    setToast("Meal added to today’s log")
  }

  function simulateScan() {
    fileInput.current?.click()
  }

  return (
    <div className="app-shell">
      <Sidebar onAssistant={() => setModal("assistant")} />
      <div className="app-frame">
        <Topbar />
        <main className="dashboard">
          <section className="welcome">
            <div>
              <p className="date-label">{date}</p>
              <h1>Good morning, Jordan</h1>
              <p>Here’s how your health is looking today.</p>
            </div>
            <button
              className="button primary desktop-log"
              type="button"
              onClick={() => setModal("vital")}
            >
              <Plus size={18} /> Log a reading
            </button>
          </section>

          <section className="metric-grid" aria-label="Latest health readings">
            <MetricCard
              label="Blood pressure"
              value={`${latestPressure.primary}/${latestPressure.secondary}`}
              unit="mmHg"
              detail="Healthy range"
              meta={latestPressure.time}
              icon={<HeartPulse size={21} />}
              tone="coral"
            />
            <MetricCard
              label="Blood glucose"
              value={latestGlucose.primary}
              unit="mg/dL"
              detail={latestGlucose.context}
              meta={latestGlucose.time}
              icon={<Droplets size={21} />}
              tone="blue"
            />
            <MetricCard
              label="Resting pulse"
              value={latestPressure.pulse ?? "68"}
              unit="bpm"
              detail="Normal"
              meta={latestPressure.time}
              icon={<Activity size={21} />}
              tone="violet"
            />
          </section>

          <div className="dashboard-grid">
            <div className="main-column">
              <section className="card trend-card">
                <div className="card-heading">
                  <div>
                    <span className="eyebrow">7-day overview</span>
                    <h2>Blood glucose trend</h2>
                  </div>
                  <button className="period-button" type="button">
                    Last 7 days <ChevronDown size={15} />
                  </button>
                </div>
                <div className="trend-summary">
                  <div>
                    <strong>112</strong>
                    <span>mg/dL average</span>
                  </div>
                  <span className="steady-tag">
                    <Activity size={14} /> Stable this week
                  </span>
                </div>
                <TrendChart />
              </section>

              <section className="card insight-card">
                <div className="insight-art">
                  <Sparkles size={25} />
                </div>
                <div className="insight-copy">
                  <div className="insight-label">
                    <span>AI insight</span>
                    <small>Preview</small>
                  </div>
                  <h2>Your mornings are looking consistent</h2>
                  <p>
                    Your fasting glucose has stayed within a narrow range for 5
                    of the last 7 days. Logging your evening meals can help
                    reveal what supports this pattern.
                  </p>
                  <button type="button" onClick={() => setModal("assistant")}>
                    Ask a follow-up <ChevronRight size={15} />
                  </button>
                </div>
              </section>
            </div>

            <aside className="right-column">
              <section className="card quick-card">
                <div className="card-heading">
                  <div>
                    <span className="eyebrow">Quick capture</span>
                    <h2>Add to today</h2>
                  </div>
                </div>
                <div className="quick-list">
                  <QuickAction
                    icon={<ScanLine size={20} />}
                    title="Scan a device"
                    detail="Capture vitals with camera"
                    tone="mint"
                    onClick={simulateScan}
                  />
                  <input
                    className="hidden-file-input"
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    onChange={() => {
                      if (fileInput.current?.files?.length) {
                        setModal("vital")
                        setToast("Photo received — confirm the detected values")
                      }
                    }}
                  />
                  <QuickAction
                    icon={<Utensils size={20} />}
                    title="Log a meal"
                    detail="Photo or quick description"
                    tone="amber"
                    onClick={() => setModal("meal")}
                  />
                  <QuickAction
                    icon={<Plus size={20} />}
                    title="Enter manually"
                    detail="Add a reading yourself"
                    tone="blue"
                    onClick={() => setModal("vital")}
                  />
                </div>
              </section>

              <section className="card plan-card">
                <div className="card-heading">
                  <div>
                    <span className="eyebrow">Daily plan</span>
                    <h2>2 of 3 complete</h2>
                  </div>
                  <div className="progress-ring">
                    <span>{mealLogged ? "100" : "67"}%</span>
                  </div>
                </div>
                <div className="plan-list">
                  <div className="plan-item done">
                    <span>
                      <Check size={14} />
                    </span>
                    <div>
                      <strong>Morning glucose</strong>
                      <small>Logged at 7:48 AM</small>
                    </div>
                  </div>
                  <div className="plan-item done">
                    <span>
                      <Check size={14} />
                    </span>
                    <div>
                      <strong>Blood pressure</strong>
                      <small>Logged at 8:12 AM</small>
                    </div>
                  </div>
                  <button
                    className={`plan-item ${mealLogged ? "done" : ""}`}
                    type="button"
                    onClick={() => !mealLogged && setModal("meal")}
                  >
                    <span>
                      {mealLogged ? (
                        <Check size={14} />
                      ) : (
                        <Utensils size={14} />
                      )}
                    </span>
                    <div>
                      <strong>Log lunch</strong>
                      <small>
                        {mealLogged ? "Added to today" : "Due around 12:30 PM"}
                      </small>
                    </div>
                    {!mealLogged && <ChevronRight size={16} />}
                  </button>
                </div>
              </section>

              <section className="care-card">
                <div className="care-icon">
                  <Leaf size={20} />
                </div>
                <div>
                  <strong>A steady week</strong>
                  <p>You’ve logged vitals 6 days in a row.</p>
                </div>
                <span>6</span>
              </section>
            </aside>
          </div>
        </main>
      </div>

      <BottomNav onAssistant={() => setModal("assistant")} />
      {modal === "vital" && (
        <VitalModal onClose={() => setModal(null)} onSave={saveReading} />
      )}
      {modal === "meal" && (
        <MealModal onClose={() => setModal(null)} onSave={saveMeal} />
      )}
      {modal === "assistant" && (
        <AssistantModal onClose={() => setModal(null)} />
      )}
      {toast && (
        <div className="toast">
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  )
}
