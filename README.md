# Abdus Samad — Software Developer Portfolio

A refined, editorial-style developer portfolio inspired by the [Majd Framer](https://majd-portfolio.framer.website/) aesthetic.

---

## 🎨 Design System & Philosophy

- **Background Palette**: Warm off-white (`#F8F6F2`) with seamless Obsidian Dark Mode (`#0D0D0F`).
- **Typography**: Clean, bold **Archivo** display paired with **Inter** body text.
- **Accents**: Subtle pink/red (`#EB4D6D`) for labels and active highlights; emerald green (`#10B981`) availability indicator.
- **Micro-Interactions**: Custom magnetic cursor, floating pill navbar, smooth scroll spy, fullscreen image lightbox, and copy-to-clipboard toast notifications.
- **No Fluff**: No fabricated stats, no fake testimonials, no generic AI gradients. Focused strictly on genuine projects, transparent skills, and real contact channels.

---

## 🚀 Running Locally

1. **Start the local server**:
   ```bash
   node server.js
   ```
2. Open your browser at:
   ```
   http://localhost:3000/
   ```

---

## 📬 Contact Form & Real Email Setup (`abdussamad5826@gmail.com`)

All valid form submissions are configured to reach **`abdussamad5826@gmail.com`**.
The portfolio supports **three flexible delivery pathways**:

### Option 1: 1-Click Instant Activation (Zero API Keys Needed)
The backend is now wired to forward submissions via FormSubmit directly to `abdussamad5826@gmail.com`:
1. Check your Gmail inbox (`abdussamad5826@gmail.com`) for an email from **FormSubmit** with subject *"Action Required: Activate FormSubmit"*. (Check the Spam or Updates folder if not in Primary).
2. Click the **"Activate Form"** button in that email once.
3. Done! Every message submitted on your portfolio will instantly land directly in your Gmail inbox with the sender's name, email/phone, and project details.

### Option 2: EmailJS (Client-Side Direct Delivery)

1. **Create an EmailJS Account**: Sign up free at [EmailJS](https://www.emailjs.com/).
2. **Add an Email Service**:
   - Go to **Email Services** -> **Add New Service**.
   - Select **Gmail** and connect your address: `abdussamad5826@gmail.com`.
   - Copy your **Service ID** (e.g., `service_abc123`).
3. **Create an Email Template**:
   - Go to **Email Templates** -> **Create New Template**.
   - Set **To Email** to `abdussamad5826@gmail.com`.
   - In the Subject line: `New Portfolio Inquiry from {{from_name}}`.
   - In the Body:
     ```
     You have received a new message from your portfolio:

     Name: {{from_name}}
     Reply-To / Phone: {{reply_to}}

     Message:
     {{message}}
     ```
   - Copy your **Template ID** (e.g., `template_xyz789`).
4. **Get Public Key**:
   - Go to **Account** -> **API Keys** -> copy your **Public Key**.
5. **Add to `email-config.js` or `.env`**:
   Open `email-config.js` and set:
   ```javascript
   window.EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
   window.EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
   window.EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
   ```

### Option 2: Resend API (Server-Side Delivery)

1. Sign up at [Resend](https://resend.com/) and create an API key.
2. In your `.env` file (copied from `.env.example`):
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   ```
3. Restart `node server.js`. Every submission sent to `/api/contact` will be dispatched directly to `abdussamad5826@gmail.com`.

### 🛡️ Local Fallback & Data Safety
Even before adding live third-party keys, **no inquiry is ever lost**. All submissions are validated and automatically persisted securely to `inquiries.json` on the server with full timestamps, contact information, and messages.

---

## 🛠️ Tech Stack & Real Projects Featured

1. **FluxAI** — AI SaaS landing platform with interactive starfield canvas physics, GPT-4o feature showcase, and high-conversion pricing tiers.
   - Live URL: `https://temporary-fast-dune-r0j7496.vercel.app/`
   - Repo: `https://github.com/abdussamad567/Flux-AI-Landing-Page`
2. **Axiorai** — AI career & portfolio intelligence platform with resume scanner, job fit score gauge, portfolio critic, and interview simulator.
   - Repo: `https://github.com/abdussamad567/Axiorai`
3. **School Management System** — MERN-stack administrative portal featuring student management, attendance tracking, fee payment status, teacher roster, and analytics.
4. **GSoC Org Finder** — Open-source matching engine filtering 185+ organizations by tech stack, language, and domain.
   - Live URL: `https://findmygsoc.vercel.app/`
   - Repo: `https://github.com/abdussamad567/GSoC-Org-Finder-`
