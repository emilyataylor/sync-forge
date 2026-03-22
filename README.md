# SyncForge

A full-stack platform for managing third-party API integrations with asynchronous job processing.

## Tech Stack

- React (TypeScript)
- Node.js (API)
- Go (worker)
- Redis (queue)
- PostgreSQL

## Architecture (WIP)

```mermaid
flowchart LR
    subgraph Frontend
        A[React UI]
    end

    subgraph Backend
        B[Node.js API]
        C[PostgreSQL]
    end

    subgraph Queue
        D[Redis / BullMQ]
    end

    subgraph Worker
        E[Go Worker Service]
    end

    subgraph External
        F[Third-Party API]
    end

    A -->|HTTP Request| B
    B -->|Create Integration / Trigger Job| C
    B -->|Enqueue Job| D

    D -->|Consume Job| E
    E -->|Update Status & Logs| C
    E -->|API Calls| F
```
