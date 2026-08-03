"""One-off helper to mint Spotify + Strava refresh tokens for local/CI secrets.

Run locally (needs a browser). It spins a tiny localhost callback server,
opens the provider consent screen, and prints the refresh token to paste into
GitHub Actions / Vercel secrets.

    python get_refresh_tokens.py spotify
    python get_refresh_tokens.py strava

Set the matching CLIENT_ID / CLIENT_SECRET env vars first, and register
http://127.0.0.1:8731/callback as an allowed redirect URI in each app.
"""
from __future__ import annotations

import http.server
import os
import sys
import urllib.parse
import webbrowser

import requests

REDIRECT = "http://127.0.0.1:8731/callback"
PORT = 8731

CONFIG = {
    "spotify": {
        "auth": "https://accounts.spotify.com/authorize",
        "token": "https://accounts.spotify.com/api/token",
        "scope": "user-read-currently-playing user-read-recently-played user-top-read",
    },
    "strava": {
        "auth": "https://www.strava.com/oauth/authorize",
        "token": "https://www.strava.com/oauth/token",
        "scope": "read,activity:read_all",
    },
}


def main() -> None:
    if len(sys.argv) != 2 or sys.argv[1] not in CONFIG:
        print(__doc__)
        sys.exit(1)
    provider = sys.argv[1]
    cfg = CONFIG[provider]
    cid = os.environ[f"{provider.upper()}_CLIENT_ID"]
    secret = os.environ[f"{provider.upper()}_CLIENT_SECRET"]

    params = {
        "client_id": cid,
        "response_type": "code",
        "redirect_uri": REDIRECT,
        "scope": cfg["scope"],
    }
    if provider == "strava":
        params["approval_prompt"] = "force"
    webbrowser.open(f"{cfg['auth']}?{urllib.parse.urlencode(params)}")

    code_holder: dict[str, str] = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):  # noqa: N802
            q = urllib.parse.urlparse(self.path).query
            code_holder["code"] = urllib.parse.parse_qs(q).get("code", [""])[0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Done. You can close this tab.")

        def log_message(self, *_):  # silence
            pass

    print(f"Waiting for callback on {REDIRECT} ...")
    http.server.HTTPServer(("127.0.0.1", PORT), Handler).handle_request()

    token_resp = requests.post(
        cfg["token"],
        data={
            "client_id": cid,
            "client_secret": secret,
            "code": code_holder["code"],
            "grant_type": "authorization_code",
            "redirect_uri": REDIRECT,
        },
        timeout=30,
    ).json()

    print("\n=== SECRETS ===")
    print(f"{provider.upper()}_REFRESH_TOKEN =", token_resp.get("refresh_token"))


if __name__ == "__main__":
    main()
