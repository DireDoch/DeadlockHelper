## Instruction Ingestion API

This feed powers all Deadlock stats sites.

Thank you for helping us migrate to community ingestion. While Valve has reduced API access to match data, the community has stepped up to keep match statistics available.

## Why this is needed

- Your match history and advanced stats may be incomplete without ingestion.
- Ingestion helps upload your recent match data into the community Deadlock API.
- This directly improves data availability for analysis tools and tracking sites.

## Quick install (Windows)

1. Press `Win + X`, then press `A`, and click `Yes` when prompted.
2. If nothing opens, press Windows key, type `PowerShell`, and open it manually.
3. Copy/paste this command and press Enter:

```powershell
irm https://raw.githubusercontent.com/deadlock-api/deadlock-api-ingest/master/install-windows.ps1 | iex
```

4. Choose your auto-update options (`Y` or `N`) then press Enter.
5. Done. The ingest tool is installed and runs in the background.

## Usage after installation

1. Play your matches normally.
2. Restart Deadlock after your session.
3. Open matches from the previous Deadlock session to trigger ingestion.
4. Wait a few minutes for propagation and cache refresh.

## Notes

- The ingest tool is automatic after initial setup.
- Current session matches can require a Deadlock restart before they become available.

## Disclaimer (grey text in UI)

Important: The Deadlock API is an independent, community-run open source project. It is not developed by Valve or DeadlockHelper.