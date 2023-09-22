=> Design patter: Adapter
O padrão de design Adapter é um padrão estrutural que permite que objetos com interfaces incompatíveis trabalhem juntos. Ele atua como um intermediário entre duas classes que de outra forma não poderiam colaborar devido a diferenças em suas interfaces.

O Adapter converte a interface de uma classe em outra interface que o cliente espera. Isso permite que objetos com diferentes interfaces possam colaborar sem modificar seu código original.

::: mermaid
classDiagram
  class Target {
    +request(): void
  }

  class Adaptee {
    +specificRequest(): void
  }

  class Adapter {
    -adaptee: Adaptee
    +request(): void
  }

  class Client {
    +makeRequest(target: Target): void
  }

  Target <|.. Adapter
  Target <|.. Client
  Adaptee <|.. Adapter
  Client --> Target
  Client --> Adapter
:::
