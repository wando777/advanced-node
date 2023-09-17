O padrão de projeto "Facade" é um padrão estrutural que fornece uma interface simplificada para um conjunto mais amplo de interfaces em um subsistema. Ele oculta a complexidade do sistema subjacente, tornando-o mais fácil de usar e reduzindo o acoplamento entre componentes. O padrão de projeto Facade é frequentemente usado quando você precisa simplificar uma interface complexa ou quando deseja fornecer uma interface única para interagir com várias partes de um sistema.

Aqui está uma explicação do padrão Facade:

Facade: Essa é a classe que atua como uma interface simplificada para o subsistema mais complexo. Ele fornece métodos simples que encapsulam a lógica de interação com as várias classes do subsistema.

Subsistema: O subsistema é composto por várias classes que realizam tarefas específicas e complexas. Essas classes podem ser interdependentes e formar um sistema maior. O Facade encapsula a complexidade dessas classes e fornece uma interface unificada para o cliente.

O objetivo principal do padrão Facade é fornecer uma camada de abstração que torna mais fácil para os clientes interagirem com o sistema, evitando que eles lidem diretamente com a complexidade interna do subsistema.

:::mermaid
classDiagram
  class Cliente {
    + operacaoSimples(): void
  }
  
  class SubsistemaA {
    + operacaoA(): void
  }
  
  class SubsistemaB {
    + operacaoB(): void
  }
  
  class SubsistemaC {
    + operacaoC(): void
  }
  
  class Facade {
    - subsistemaA: SubsistemaA
    - subsistemaB: SubsistemaB
    - subsistemaC: SubsistemaC
    + operacaoSimplificada(): void
  }
  
  Cliente --> Facade: Usa
  Facade --> SubsistemaA: Usa
  Facade --> SubsistemaB: Usa
  Facade --> SubsistemaC: Usa
:::

- Cliente é a classe que interage com o sistema por meio da interface fornecida pelo Facade.
- Facade é a classe que fornece uma interface simplificada para o subsistema complexo.
- SubsistemaA, SubsistemaB e SubsistemaC são classes que compõem o subsistema complexo.
- O Cliente utiliza o Facade para interagir com o subsistema, chamando operacaoSimplificada().
- O Facade lida com a complexidade interna chamando métodos nos diferentes componentes do subsistema (SubsistemaA, SubsistemaB e SubsistemaC) e fornece uma interface mais simples para o cliente.
