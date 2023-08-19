::: mermaid
graph TD
    A[server] --> B[./config/app]
    A --> C[./config/env]
    B --> D[Aplicativo<br>Express]
    B --> E[Third-party<br>Middlewares]
    E --> F[CORS]
    E --> J[BodyParser]
    B --> H[Routers]
    H --> I[../routes/ROTAS]
:::
