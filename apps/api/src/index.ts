import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import { bootstrapAdmin } from "./controllers/auth"

/* ROUTE IMPORTS */
import auth from "./routes/auth"
import blogs from "./routes/blog"
import councilLists from "./routes/council-list"
import events from "./routes/events"
import forms from "./routes/form"
import home from "./routes/home"
import news from "./routes/news"
import reportsPublications from "./routes/reports-publications"
import search from "./routes/search"
import services from "./routes/service"
import shops from "./routes/shop"
import stats from "./routes/stat"
import team from "./routes/team"
import users from "./routes/user"
import vacancies from "./routes/vacancy"

/* CONFIGURATIONS */
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
)
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

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

/* SERVER */
const PORT = Number(process.env.PORT) || 8000
app.listen(PORT, async () => {
  console.log(`Server Listening on port ${PORT}`)
})
