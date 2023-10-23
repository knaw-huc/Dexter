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

    START-->LOGIN[login]-->HOME[view dashboard]

%% virtual collection items:
    HOME --> CVC[create virtual collection]
    CVC --> VC[/virtual collection/]
    VC --> S{search}
    
    S --> SI[search image]    
    S --> ST[search text]
    S --> SP[search micro-archive]    

%% Search
    SI-->SIL[/IIIF link/]
    SIL-->IMIL[paste link in form?]
    IMIL-->VCI[/virtual collection item/]
    
    ST-->STIL[/text-IIIF link/]
    STIL-->IMTIL[paste link in form?]
    MAI-->AMAI[add micro-archive item]-->VCI

    SP-->MAI[/micro-archive item/]
    
    VCI-->ADBM[add dublin core metadata]-->VCI

%% tag:
    HOME --> CTAG[create tag]
    CTAG-->TAG[/tag/]
    TAG-->ATAG[add tag]
    ATAG-->VCI

%% index:
    HOME --> VVC[view virtual collection]
    VVC-->VCIX[/virtual collection item index/]
    VCIX-->SBTAG[sort by tag]-->VCIX
    
    VCIX --> VI[view item]
    VI-->VCI

%% annotation:
    VCI --> ANN{annotate}
    ANN --> TIIIF[/text-IIIF/]-->RJS[recogito-js] --> CWANN[create web annotation]
    ANN --> IIIF[/IIIF/]-->ANT[annotorious]  --> CWANN
    ANN --> MAI2[/micro-archive item/]-->WANNF[web annotation form] --> CWANN
    CWANN --> WAN[/web annotation/]

%% sharing:
    WAN-->SHAREWAN[share] --> WANL[/web annotation url/]
    VCI-->SHAREVCI[share] --> VCIL[/stable id url/]
    
    process
    decision{decision}
    data[/data/]

%% micro-archive
    HOME-->CMA["create micro-archive (shoe box)"]
    CMA-->MA[/"micro-archive (shoe box)"/]
    MA-->CMAI[create micro-archive item]
    CMAI-->IMMAI[fill out form + TMS import magic?]
    IMMAI-->MAI[/micro-archive item/]

```