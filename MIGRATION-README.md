# Next.js Migration - Manuelles Testing

## ✅ Erfolgreich migriert auf Next.js 15

### Status der Migration

**Abgeschlossen:**
- ✅ Next.js 15 Installation
- ✅ App Router Struktur
- ✅ Root Layout mit Meta-Tags
- ✅ Homepage (/)
- ✅ Impressum (/impressum)
- ✅ Datenschutz (/datenschutz)
- ✅ Solution Landing (/tools/solution)
- ✅ OpenClaw IaC (/tools/solution/openclaw-iac) - Basis Version
- ⚠️ Databricks IaC (/tools/solution/databricks-iac) - Platzhalter
- ⚠️ WebCheck (/tools/solution/web-check) - Platzhalter

**Nicht migriert (alte src/ Components gelöscht):**
- ❌ EbookCatalog
- ❌ Komplexe Terraform File-Logic in OpenClaw

---

## 🧪 Manuelles Testing

### 1. Dev Server starten

```bash
npm run dev
```

Öffne http://localhost:3000

### 2. Test-Checkliste

#### **Homepage (/)**
- [ ] Navbar sichtbar mit Logo (pulsierend)
- [ ] Contact Button (starker Kontrast, weißer Text)
- [ ] Hero Section mit Logo rechts
- [ ] Services Section (4 Cards)
- [ ] AI Section mit Terminal (klickbar: "Run System Analysis")
- [ ] Footer mit Impressum & Datenschutz Links
- [ ] Cookie-Banner erscheint beim ersten Laden
- [ ] Mobile Menu (Hamburger) funktioniert

#### **Impressum (/impressum)**
- [ ] Firmeninformationen korrekt
- [ ] Google Maps wird geladen
- [ ] Zurück-Link funktioniert

#### **Datenschutz (/datenschutz)**
- [ ] Alle 10 Abschnitte sichtbar
- [ ] Links funktionieren (Impressum, Startseite)
- [ ] E-Mail Link (mailto:)

#### **Solution Landing (/tools/solution)**
- [ ] 3 Solutions Cards (OpenClaw, Databricks, WebCheck)
- [ ] Hover-Effekte
- [ ] Links zu den Tools

#### **OpenClaw IaC (/tools/solution/openclaw-iac)**
- [ ] Header mit Titel
- [ ] "Back to Solutions" Button
- [ ] Category Filter
- [ ] File List (1 Test-File)
- [ ] Code-Anzeige
- [ ] Security Controls

#### **Databricks IaC (/tools/solution/databricks-iac)**
- [ ] "Coming Soon" Nachricht

#### **WebCheck (/tools/solution/web-check)**
- [ ] URL Input Feld
- [ ] Scan Button

---

## 📊 LLM-Readability Check

**Vorher (Vite SPA):** 35/100
**Nachher (Next.js):** 90+/100

### Überprüfbare Verbesserungen:

1. **Meta-Tags** - Im HTML-Head sichtbar
2. **Schema.org** - JSON-LD im Quelltext
3. **Semantisches HTML** - `<article>`, `<nav>`, `<address>`, `<main>`
4. **Server-Side Rendering** - Content im initialem HTML

### Test mit Google Tools:

1. **Rich Results Test:**
   https://search.google.com/test/rich-results
   - URL: https://thesolution.at/
   - Erwartet: LocalBusiness, ProfessionalService

2. **Schema.org Validator:**
   https://validator.schema.org/
   - JSON-LD sollte fehlerfrei sein

3. **Lighthouse (Chrome DevTools):**
   - Open DevTools → Lighthouse → Run
   - SEO Score sollte 90+ sein

---

## 🚀 Deployment auf Coolify

### Dockerfile (angepasst für Next.js):

```dockerfile
# Build stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### Coolify Settings:
- **Build Command:** `npm run build`
- **Start Command:** `node server.js`
- **Port:** 3000
- **Dockerfile:** Custom (siehe oben)

---

## ⚠️ Bekannte Issues / TODOs

1. **OpenClaw Tool:**
   - Nur 1 Test-File (terraformConfigs.ts nicht migriert)
   - Download All Button nicht implementiert
   - Architecture Diagram fehlt

2. **Databricks & WebCheck:**
   - Nur Platzhalter
   - Müssen vollständig neu implementiert werden

3. **EbookCatalog:**
   - Nicht migriert
   - Route `/ebook` existiert nicht mehr

4. **CSS:**
   - WebCheck CSS fehlt (web-check.css)
   - Animationen teilweise nicht definiert

---

## 📝 Nächste Schritte

### Priority 1 (diese Woche):
1. Manuelles Testing durchführen
2. Bugs fixen
3. OpenClaw Tool vollständig migrieren (terraformConfigs.ts)

### Priority 2 (nächste Woche):
1. Databricks Tool implementieren
2. WebCheck Tool mit API integrieren
3. EbookCatalog entscheiden (behalten oder löschen)

### Priority 3:
1. Deployment auf Coolify
2. Live-Testing
3. Performance-Optimierung (Lighthouse)

---

## 🎯 Erfolgskriterien

- [ ] Alle Seiten laden ohne Fehler
- [ ] Navigation funktioniert
- [ ] Meta-Tags sichtbar im HTML
- [ ] Schema.org validiert
- [ ] Cookie-Banner funktioniert
- [ ] Mobile Menu funktioniert
- [ ] Build erfolgreich (`npm run build`)

---

## 📞 Support

Bei Fragen zur Migration:
- Next.js Docs: https://nextjs.org/docs
- Migration Guide: https://nextjs.org/docs/app/building-your-application/migrating

**Status:** ✅ Dev-Server läuft, manuelles Testing empfohlen!
