# Cafe V Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    CATEGORIES ||--o{ MENU : contains

    RESERVATIONS ||--o{ RESERVATION_TABLES : has
    TABLES ||--o{ RESERVATION_TABLES : assigned_to

    RESERVATION_HOLDS ||--o{ RESERVATION_HOLD_TABLES : locks
    TABLES ||--o{ RESERVATION_HOLD_TABLES : temporarily_locked

    TABLES ||--o{ TABLE_NEIGHBORS : base_table
    TABLES ||--o{ TABLE_NEIGHBORS : neighbor_table

    CATEGORIES {
      bigint id PK
      string type UK
      datetime created_at
      datetime updated_at
    }

    MENU {
      bigint id PK
      int number
      string name
      text description
      int price
      bigint category_id FK
      datetime created_at
      datetime updated_at
    }

    RESERVATIONS {
      bigint id PK
      int guests_amount
      datetime date
      datetime start_time
      datetime end_time
      string reservation_name
      string reservation_number
      datetime created_at
      datetime updated_at
    }

    TABLES {
      bigint id PK
      int number UK
      int seats
      datetime created_at
      datetime updated_at
    }

    RESERVATION_TABLES {
      bigint id PK
      bigint reservation_id FK
      bigint table_id FK
      datetime created_at
      datetime updated_at
    }

    RESERVATION_HOLDS {
      bigint id PK
      datetime start_time
      datetime end_time
      int guests_amount
      datetime expires_at
      datetime created_at
      datetime updated_at
    }

    RESERVATION_HOLD_TABLES {
      bigint id PK
      bigint hold_id FK
      bigint table_id FK
      datetime created_at
      datetime updated_at
    }

    TABLE_NEIGHBORS {
      bigint id PK
      bigint table_id FK
      bigint neighbor_table_id FK
      datetime created_at
      datetime updated_at
    }
```

## Notes

- `reservation_tables` is the many-to-many bridge between `reservations` and `tables`.
- `reservation_hold_tables` is the temporary hold bridge used before final reservation creation.
- `table_neighbors` is a self-referencing relation on `tables` for adjacency/combination logic.
- `sp_create_hold` (stored procedure) populates `reservation_holds` and `reservation_hold_tables` as part of the temporary table-lock/hold flow.
