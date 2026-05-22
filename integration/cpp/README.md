# C++ Integration Example

This example shows how to securely connect a C++ application to the **mrcClient** authentication API.

## Requirements
- `libcurl` (for HTTP requests)
- `nlohmann/json` (for JSON parsing)
- `OpenSSL` (for HMAC-SHA256 signature verification)

## Security Features Implemented
1. **HMAC-SHA256 Signature:** The server signs the response with a `SECRET_KEY`. The C++ client recalculates this signature and compares it. If they don't match, the response was tampered with (e.g., using Fiddler, Charles, or local host redirects).
2. **HWID Binding:** Automatically handled by the API.
3. **Server Time:** The response includes `server_time` to prevent users from bypassing expiration by changing their local PC clock.

## Compilation (Linux/Mingw)
```bash
g++ main.cpp -o auth_client -lcurl -lssl -lcrypto
```

## Setup
1. Make sure your `.env` file in the web panel has a strong `AUTH_SECRET_KEY`.
2. Update the `SECRET_KEY` in `main.cpp` to match your `.env`.
3. Change the `API_URL` if you are hosting the panel online.
