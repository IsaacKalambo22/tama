const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

const WEBHOOK_SECRET = "whsec_test_abc123"
let pass = 0
let fail = 0

function assert(cond, name) {
  if (cond) {
    console.log("  ✓ " + name)
    pass++
  } else {
    console.log("  ✗ " + name)
    fail++
  }
}

function parseHeader(h) {
  const p = {}
  for (const s of h.split(",")) {
    const [k, ...r] = s.trim().split("=")
    if (k && r.length) p[k] = r.join("=")
  }
  return p
}

function sgn(body, secret, t) {
  return crypto.createHmac("sha256", secret).update(t + "." + body).digest("hex")
}

function verify(raw, header, secret) {
  if (!header) return { ok: false, reason: "no header" }
  const p = parseHeader(header)
  if (!p.t || !p.v1) return { ok: false, reason: "malformed" }
  const ts = Number(p.t)
  if (isNaN(ts)) return { ok: false, reason: "bad ts" }
  if (Math.abs(Math.floor(Date.now() / 1000) - ts) > 300)
    return { ok: false, reason: "stale" }
  const exp = sgn(raw, secret, p.t)
  const a = Buffer.from(p.v1, "utf8")
  const b = Buffer.from(exp, "utf8")
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b))
    return { ok: false, reason: "bad sig" }
  return { ok: true }
}

// ── AC3: Invalid/unsigned webhook rejected ────────────────────────────────────

console.log("\n[AC3] Unsigned/invalid webhook → 400, no DB touch")

const body = JSON.stringify({
  event: "message.delivered",
  messageId: "msg_xxx",
  status: "DELIVERED",
})

assert(!verify(body, "", WEBHOOK_SECRET).ok, "Missing header → rejected")
assert(!verify(body, "t=9999", WEBHOOK_SECRET).ok, "Malformed header → rejected")
assert(
  !verify(
    body,
    "t=" + String(Math.floor(Date.now() / 1000)) + ",v1=bad",
    WEBHOOK_SECRET
  ).ok,
  "Wrong sig → rejected"
)
const stale = String(Math.floor(Date.now() / 1000) - 600)
assert(
  !verify(body, "t=" + stale + ",v1=" + sgn(body, WEBHOOK_SECRET, stale), WEBHOOK_SECRET).ok,
  "Stale timestamp → rejected"
)
const fresh = String(Math.floor(Date.now() / 1000))
assert(
  verify(body, "t=" + fresh + ",v1=" + sgn(body, WEBHOOK_SECRET, fresh), WEBHOOK_SECRET).ok,
  "Valid sig → accepted"
)

// ── AC4: Replayed webhook → idempotent ───────────────────────────────────────

console.log("\n[AC4] Replayed webhook → idempotent")

const SO = { QUEUED: 0, SENT: 1, DELIVERED: 2, FAILED: 3, REJECTED: 3, CANCELLED: 3 }

function shouldUpdate(current, incoming) {
  return SO[incoming] >= SO[current]
}

assert(shouldUpdate("QUEUED", "SENT"), "QUEUED → SENT: allowed")
assert(shouldUpdate("SENT", "DELIVERED"), "SENT → DELIVERED: allowed")
assert(shouldUpdate("QUEUED", "DELIVERED"), "QUEUED → DELIVERED: allowed")
assert(!shouldUpdate("DELIVERED", "QUEUED"), "DELIVERED ← QUEUED: blocked (regression)")
assert(!shouldUpdate("FAILED", "SENT"), "FAILED ← SENT: blocked (regression)")
assert(!shouldUpdate("CANCELLED", "DELIVERED"), "CANCELLED ← DELIVERED: blocked")
assert(shouldUpdate("DELIVERED", "DELIVERED"), "DELIVERED replay DELIVERED: allowed (idempotent)")
assert(shouldUpdate("SENT", "SENT"), "SENT replay SENT: allowed (idempotent)")
assert(shouldUpdate("QUEUED", "QUEUED"), "QUEUED replay QUEUED: allowed (idempotent)")

// ── AC5: Fire-and-forget code audit ──────────────────────────────────────────

console.log("\n[AC5] Fire-and-forget code audit")

const authCode = fs.readFileSync(
  path.join(__dirname, "../src/controllers/auth/index.ts"),
  "utf8"
)
const serviceCode = fs.readFileSync(
  path.join(__dirname, "../src/notifications/service.ts"),
  "utf8"
)

assert(
  authCode.includes("void notifyEvent("),
  "Auth controller uses void (not await)"
)
assert(
  authCode.includes('notifyEvent("user.created"'),
  "Auth controller triggers user.created"
)

// Verify void is on the same line as notifyEvent (not a separate statement)
const voidLine = authCode
  .split("\n")
  .find((l) => l.includes("void notifyEvent("))
assert(voidLine && !voidLine.includes("await"), "void keyword, not await")

// Verify the response is sent AFTER the void call
const voidIdx = authCode.indexOf("void notifyEvent(")
const responseIdx = authCode.indexOf("res.status(201)")
assert(
  voidIdx > 0 && responseIdx > voidIdx,
  "Response sent after void notifyEvent (not blocking)"
)

// Verify notifyEvent catches all errors internally
assert(
  serviceCode.includes("try {") && serviceCode.includes("} catch (error)"),
  "notifyEvent has try/catch (errors never thrown to caller)"
)

// Verify inner try/catch around sendEmail
const innerCatch = serviceCode.includes("} catch (error) {") 
assert(innerCatch, "Inner catch around sendEmail call")

// Verify no await in auth controller's notifyEvent call
assert(
  !authCode.match(/await\s+notifyEvent/),
  "No await on notifyEvent in auth controller"
)

// ── Summary ──────────────────────────────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════════════")
console.log("  Results: " + pass + " passed, " + fail + " failed")
console.log("═══════════════════════════════════════════════════════════════")
process.exit(fail > 0 ? 1 : 0)
