# Dexter

This project aims at building a much-needed solution for referencing and for creating analytical annotations around heterogeneous source material (speech data, survey data, audiovisual recordings, photographs, diaries etc.).

## Development

- Start database:
```shell
docker-compose up -d postgres
```

- Start backend:
```shell
cd backend
make build
export DEX_DATABASE_URL=jdbc:postgresql://0.0.0.0:5432/dexter 
make run-server
```

- Add user:
```shell
curl -X 'POST' 'http://localhost:3001/api/admin/users' \
  -H 'Authorization: Basic cm9vdDpkMzNkMzM=' \
  -H 'Content-Type: application/json' \
  -d '["dexter"]'
```

- Start frontend:
```shell
cd frontend
npm i
npm start
```

- Open http://localhost:3001
- Login with dexter:dexter
- Swagger: http://localhost:3001/api/swagger

## Workflow diagram

```mermaid
graph TD
    START((start))

    START-->|login|HOME[home]

%% virtual collection items:
    HOME --> |create virtual collection|VC[virtual collection]
    VC --> |populate|S{search}
    S -->|in collection website| CW[collection url?]
    S -->|where?| IIIF["(text) iiif link"]
    S -->|in micro archive| MA[micro archive item]
    CW-->|import?|VCI[virtual collection item]
    IIIF-->|paste in form?|VCI
    MA-->|fill out form|VCI
    VCI-->|add dublin core metadata|VCI

%% tag:
    HOME --> |create tag|TAG[tag]
    TAG-->|add tag|VCI

%% index:
    HOME --> |view virtual collection|VCIX[virtual collection index]
    VCIX --> |sort by tags|VCIX
    VCIX --> |view item|VCI

%% annotation:
    ANN[web annotation]
    VCI --> |annotate|MT{media type}
    MT --> |text-iiif|RJS[recogito-js]
    MT --> |iiif|ANT[annotorious]
    MT --> |micro archive item|WAF[web annotation form]
    RJS --> |create annotation|ANN
    ANT --> |create annotation|ANN
    WAF --> |create annotation|ANN

%% sharing:
    VC-->|share|LN[link/peristent ID]
    VCI-->|share|LN[link/peristent ID]
    ANN-->|share|LN[link/peristent ID]

```