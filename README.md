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
export DEX_FLYWAY_LOCATIONS=['filesystem:db']
export DEX_DATABASE_URL=jdbc:postgresql://0.0.0.0:5432/dexter 
make run-server
```

- Start frontend:
```shell
cd frontend
npm i
npm start
```

## Demo
```shell
# Add user:
curl -X 'POST' 'http://localhost:8080/admin/users' \
  -H 'Authorization: Basic cm9vdDpkMzNkMzM=' \
  -H 'Content-Type: application/json' \
  -d '["dexter"]'

# Add corpus:
curl 'http://localhost:8080/api/corpora' -X POST \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic ZGV4dGVyOmRleHRlcg==' \
  --data-raw '{
    "title": "test",
    "description":"test",
    "rights":"test",
    "access":"Open",
    "location":"test",
    "earliest":"1990-01-30",
    "latest":"1990-01-31",
    "contributor":"test",
    "notes":"test"
  }'

# Add source:
curl 'http://localhost:8080/api/sources' -X POST  \
  -H 'Content-Type: application/json'  \
  -H 'Authorization: Basic ZGV4dGVyOmRleHRlcg=='  \
  --data-raw '{
    "externalRef":"test",
    "title":"test",
    "description":"test",
    "rights":"test",
    "access":"Open",
    "location":"test",
    "earliest":"1990-01-30",
    "latest":"1990-01-31",
    "notes":"test"
  }'
```

- Open http://localhost:3001
- Login with dexter:dexter
- Swagger: http://localhost:3001/api/swagger


## Workflow diagram

```mermaid
---
title: "Workflow of rolodex, 'minimal viable product'"
---
graph TD
    START((start))

    AU[action of user]
    AR[🤖 action of rolodex]
    EN[/entities/]
    
    START
    --> LOGIN[login@rolodex]
    --> HOME[view dashboard]
    
    START
    --> SEARCH[search@AAMU website]
    --> VIEWITEM[view specific source]
    --> COPYHANDLER[copy source handle]
    --> ADDHANDLER[add handle to corpus source]
    --> IMPORTHANDLER["🤖 import meta data"]
    --> ADDMETADATA["🤖 add meta data to corpus source"]
    --> VCI[/corpus source/]
    
    %% corpus sources:
    HOME
    --> CVC[create corpus]
    --> VC[/corpus/]
    
    VC
    --> AVC[add corpus source]
    --> VCI
    
    %% tag:
    HOME
    --> CTAG[create tag]
    --> TAG[/tag/]
    --> ATAG[add tag]
    --> VCI
    
    TAG-->SORTVC
    
    HOME
    --> VIEWVC[view corpus]
    --> SORTVC[sort/filter corpus]
    --> VIEWVCI[view corpus source]
    --> VCI
    
    VCI
    -.-> |"(must have, possibly after demo)"|ANN[annotate]
    --> ANNT[annotate text in recogito-js]
    --> WANN[/web annotation/]
```

## Workflow including search and multimedia annotating
```mermaid
graph TD
    START((start))

    process
    decision{decision}
    data[/data/]

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
    
%% micro-archive
    HOME-->CMA["create micro-archive (shoe box)"]
    CMA-->MA[/"micro-archive (shoe box)"/]
    MA-->CMAI[create micro-archive item]
    CMAI-->IMMAI[fill out form + TMS import magic?]
    IMMAI-->MAI[/micro-archive item/]

```
