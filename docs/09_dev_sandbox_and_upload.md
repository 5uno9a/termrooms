# 09 — Dev Sandbox & Uploads

## Creator Workflow
1) Build locally in `/dev-sandbox` (editor + preview).  
2) Validate schema (zod).  
3) Export JSON.  
4) (Later) Upload to private library.

## Upload Safety
- Size limit (e.g., ≤ 500 KB per file)
- Count and total storage quotas
- Strict schema validation
- Private by default; publish toggle later

## Quotas (example)
- Free: 5 games, 500 KB each, 3 MB total
- Verified (future): 20 games, 1 MB each

## Firebase Fit
- Storage: `/users/{uid}/games/{gameId}/model.json`
- Firestore: metadata & quotas
- Cloud Function: validate on upload
