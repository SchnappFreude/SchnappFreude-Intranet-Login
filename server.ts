import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API route for Google OAuth URL
  app.get("/api/auth/google/url", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: "GOOGLE_CLIENT_ID is not configured" });
    }

    // Construct the Google OAuth URL
    // Use the App URL from runtime context as the base for redirect_uri
    const appUrl = "https://ais-dev-7u5sxfoyqbxvgx67fl3dbc-466116734628.europe-west2.run.app";
    const redirectUri = `${appUrl}/auth/google/callback`;
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    res.json({ url: googleAuthUrl });
  });

  // Google OAuth Callback Handler
  app.get("/auth/google/callback", (req, res) => {
    const { code } = req.query;
    
    // In a real app, you'd exchange the code for tokens here.
    // For this demo, we'll just send a success message to the opener.
    
    res.send(`
      <html>
        <body style="background: #040D0A; color: #2D6A4F; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; gap: 20px;">
          <div style="padding: 40px; border: 1px solid #2D6A4F; border-radius: 12px; background: rgba(0,0,0,0.5); text-align: center;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">AUTHENTICATION SUCCESSFUL</h1>
            <p style="opacity: 0.6; margin-top: 10px;">Partner identity verified via Google Workspace.</p>
            <div style="margin-top: 30px; font-size: 12px; opacity: 0.4;">This window will close automatically...</div>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'google' }, '*');
              setTimeout(() => window.close(), 2000);
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
