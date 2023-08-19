Uma classe abstrata Creator, duas subclasses concretas ConcreteCreatorA e ConcreteCreatorB, uma classe abstrata Product e duas subclasses concretas ConcreteProductA e ConcreteProductB.

O método factoryMethod() na classe Creator é abstrato, o que significa que suas subclasses concretas devem implementar esse método para criar instâncias de produtos específicos. Cada uma das subclasses concretas de Creator retorna um tipo específico de Product.

As setas indicam a relação de herança e a dependência entre as classes. O método operation() é apenas um exemplo de um método que pode estar presente nas classes de produto.

::: mermaid
classDiagram
  class Creator {
    +factoryMethod(): Product
  }

  class ConcreteCreatorA {
    +factoryMethod(): Product
  }

  class ConcreteCreatorB {
    +factoryMethod(): Product
  }

  class Product {
    +operation(): string
  }

  class ConcreteProductA {
    +operation(): string
  }

  class ConcreteProductB {
    +operation(): string
  }

  Creator <|-- ConcreteCreatorA
  Creator <|-- ConcreteCreatorB
  ConcreteCreatorA ..> ConcreteProductA
  ConcreteCreatorB ..> ConcreteProductB
  Product <|-- ConcreteProductA
  Product <|-- ConcreteProductB
:::
