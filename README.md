# Dexter

This project aims at building a much-needed solution for referencing and for creating analytical annotations around heterogeneous source material (speech data, survey data, audiovisual recordings, photographs, diaries etc.).

## Local setup

- Download frontend dependencies:
```shell
cd frontend
npm i
```

- Build backend:
```shell
cd backend
make build
make docker-image
```

- Start frontend, backend and database:
```shell
docker-compose up
```

- Open http://localhost:8000 
- Login with dexter:dexter