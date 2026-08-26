import compression from "compression"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import { bootstrapAdmin } from "./controllers/auth"
import { startNotificationScheduler } from "./notifications/scheduler"

/* ROUTE IMPORTS */
import adminNotifications from "./routes/admin-notifications"
import auth from "./routes/auth"
import blogs from "./routes/blog"
import councilLists from "./routes/council-list"
import emailAdmin from "./routes/email-admin"
import events from "./routes/events"
import forms from "./routes/form"
import home from "./routes/home"
import news from "./routes/news"
import notifications from "./routes/notifications"
import recipientGroups from "./routes/recipient-groups"
import reportsPublications from "./routes/reports-publications"
import search from "./routes/search"
import services from "./routes/service"
import shops from "./routes/shop"
import stats from "./routes/stat"
import team from "./routes/team"
import users from "./routes/user"
import vacancies from "./routes/vacancy"
import webhooks from "./routes/webhooks"

/* CONFIGURATIONS */
dotenv.config()
const app = express()

// Security & performance middleware
// InfiSend webhook — mounted BEFORE global body parsers so express.raw()
// can capture the raw bytes needed for HMAC-SHA-256 signature verification.
app.use("/webhooks", webhooks)

app.use(express.json())
app.use(helmet())
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
)
app.use(compression())
app.use(cors())
app.use(morgan("common"))

// Body parsing (express.json is built-in, body-parser is redundant)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: false }))

// Cache static assets
app.use(express.static("public", { maxAge: "1y", immutable: true }))

// Caching headers for API responses
app.use((req, res, next) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=120")
  } else {
    res.setHeader("Cache-Control", "no-store")
  }
  next()
})

// Bootstrap admin user if none exists
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER!
void bootstrapAdmin(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE_NUMBER)

/* ROUTES */
app.get("/", (_req, res) => {
  res.send("<html><body><h1>Welcome to the Home Route</h1></body></html>")
})

app.use("/auth", auth)
app.use("/home", home)
app.use("/shops", shops)
app.use("/forms", forms)
app.use("/blogs", blogs)
app.use("/search", search)
app.use("/team", team)
app.use("/stats", stats)
app.use("/news", news)
app.use("/users", users)
app.use("/events", events)
app.use("/vacancies", vacancies)
app.use("/services", services)
app.use("/council-lists", councilLists)
app.use("/reports-publications", reportsPublications)
app.use("/admin/email", emailAdmin)
app.use("/admin/notifications", adminNotifications)
app.use("/admin/recipient-groups", recipientGroups)
app.use("/notifications", notifications)

/* SERVER */
const PORT = Number(process.env.PORT) || 8000
app.listen(PORT, async () => {
  console.log(`Server Listening on port ${PORT}`)
  startNotificationScheduler()
})
