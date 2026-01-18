#!/usr/bin/env python3
"""
Simple HTTP server for SnuggleNest frontend
Serves static HTML/CSS/JS files
"""

import http.server
import socketserver
import os
import sys

PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    # Server is already in public directory when run from there
    Handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print("=" * 50)
            print(f"Frontend server running at http://localhost:{PORT}")
            print(f"Serving files from: {os.getcwd()}")
            print("=" * 50)
            print("Press Ctrl+C to stop")
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e) or "Only one usage" in str(e):
            print(f"ERROR: Port {PORT} is already in use!")
            print("Try a different port or kill the process using port 3000")
            sys.exit(1)
        else:
            raise
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)

