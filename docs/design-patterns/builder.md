=> Design patter: Builder
É utilizado para construir objetos complexos passo a passo. Ele separa a construção de um objeto complexo da sua representação, permitindo que o mesmo processo de construção possa criar diferentes representações.
O diagrama UML para o exemplo do padrão Builder consistiria em quatro principais componentes:
- Interface Builder: Uma interface que define os métodos para construir as partes do produto.
- ConcreteBuilder: Uma ou mais classes que implementam a interface Builder e fornecem a implementação específica para construir as partes do produto.
- Director (opcional): Uma classe que controla a sequência de passos para construir o objeto complexo, utilizando o Builder para fazê-lo.
- Product: A classe que representa o produto final construído.

:::mermaid
sequenceDiagram
    participant Client as Cliente
    participant Director as Diretor
    participant Builder as Construtor
    participant Product as Produto

    Cliente->>Diretor: Solicita a criação do objeto complexo
    Diretor->>Construtor: Inicia a construção
    Construtor-->>Produto: Cria uma parte do objeto

    loop Construção passo a passo
        Diretor->>Construtor: Próximo passo
        Construtor-->>Produto: Constrói a próxima parte
    end

    Cliente-->>Produto: Recebe o objeto complexo
:::

Neste exemplo, o Cliente solicita a criação de um objeto complexo ao Diretor, que, por sua vez, utiliza o Construtor para construir o objeto passo a passo. O Construtor cria uma parte do objeto a cada passo, e o Diretor controla o processo de construção, chamando o Construtor para cada etapa.

:::mermaid
classDiagram
    class Client {
        + construct()
        + setBuilder(builder)
    }

    class Director {
        - builder: Builder
        + construct()
    }

    class Builder {
        + buildPart1()
        + buildPart2()
        + getResult()
    }

    class ConcreteBuilder {
        - product: Product
        + buildPart1()
        + buildPart2()
        + getResult()
    }

    class Product {
        + part1
        + part2
    }

    Client -- Director : Construct
    Director --> Builder : Uses
    Director --> Product : Uses
    Builder <|.. ConcreteBuilder : Implements
    ConcreteBuilder --> Product : Uses
:::
