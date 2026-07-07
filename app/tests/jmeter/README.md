# JMeter Test Plan

## Purpose
This folder contains the JMeter testing plan and instructions for load testing the Next.js app.

## Target endpoints
- `GET http://localhost:3000/`
- `POST http://localhost:3000/api/auth/login`
- Optional: `POST http://localhost:3000/api/auth/register`
- Optional: `POST http://localhost:3000/api/auth/forgot-password`

## Recommended configuration
1. Open JMeter.
2. Create a new Test Plan.
3. Add HTTP Request Defaults:
   - Server Name or IP: `localhost`
   - Port Number: `3000`
   - Protocol: `http`
4. Add a Thread Group with:
   - Number of Threads (users): `10`
   - Ramp-Up Period: `10`
   - Loop Count: `3`
5. Add HTTP Request samplers for the target endpoints.
6. Add an HTTP Header Manager with `Content-Type: application/json`.
7. Add listeners: Summary Report, Aggregate Report, View Results Tree.

## Example login request body
```json
{
  "email": "invalid@example.com",
  "password": "wrongpassword"
}
```

## Running JMeter
- GUI mode for development: `jmeter`
- Non-GUI mode for load testing and report generation:
  ```powershell
  jmeter -n -t tests/jmeter/nextjs-load-test.jmx -l tests/jmeter/results.jtl
  ```

## Expected result metrics
- Response time (mean, 90th percentile)
- Throughput
- Error count / error percentage
- Success status for HTTP 200 responses
