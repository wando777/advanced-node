O padrão de design Decorator é um padrão estrutural que permite adicionar comportamento extras a objetos individuais, dinamicamente, sem alterar a estrutura da classe. Isso é alcançado por meio da criação de uma série de classes decoradoras que são usadas para envolver o objeto original.

Principais componentes do padrão Decorator:

- Componente: Define a interface para objetos que podem ser decorados.

- Componente Concreto: Implementa a interface Componente e é o objeto original ao qual queremos adicionar funcionalidades extras.

Decorador: É uma classe abstrata que também implementa a interface Componente e contém uma referência a um objeto Componente. Ele atua como uma classe base para os decoradores concretos.

Decorador Concreto: São as classes que estendem o Decorador abstrato e adicionam funcionalidades específicas ao objeto Componente original.

:::mermaid
classDiagram
    class Coffee {
        + cost(): int
    }

    class SimpleCoffee {
        + cost(): int
    }

    class CoffeeDecorator {
        - decorated_coffee: Coffee
        + cost(): int
    }

    class MilkDecorator {
        + cost(): int
    }

    class SugarDecorator {
        + cost(): int
    }

    Coffee <|-- SimpleCoffee
    Coffee <|-- CoffeeDecorator
    CoffeeDecorator <|-- MilkDecorator
    CoffeeDecorator <|-- SugarDecorator
:::
