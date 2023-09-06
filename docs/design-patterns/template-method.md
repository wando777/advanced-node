=> Design pattern: Template method:
É um padrão comportamental que se concentra na definição de um esqueleto de algoritmo em uma classe base, enquanto permite que subclasses forneçam implementações específicas para partes desse algoritmo. Ele ajuda a organizar um algoritmo geral em uma estrutura fixa, enquanto permite que os detalhes específicos variem entre as subclasses.
Aqui estão os principais componentes do padrão Template Method:

- Classe Abstrata Base (Template): Esta classe define o esqueleto do algoritmo em um método chamado "template method". Ele geralmente é declarado como um método final para evitar que as subclasses o substituam, mas ele chama outros métodos (chamados "hooks" ou "métodos primitivos") que as subclasses devem implementar.

- Métodos Primitivos (Hooks): Estes são os métodos abstratos ou virtuais (dependendo da linguagem) que as subclasses devem implementar para fornecer as partes específicas do algoritmo.

- Classe Concreta: Essas são as subclasses que estendem a classe base e fornecem as implementações concretas para os métodos primitivos. Elas também podem optar por sobrepor o método template se necessário.

:::mermaid
classDiagram
    class AbstractClass {
        + templateMethod()
        + abstract primitiveOperation1()
        + abstract primitiveOperation2()
    }

    class ConcreteClass1 {
        + primitiveOperation1()
        + primitiveOperation2()
    }

    class ConcreteClass2 {
        + primitiveOperation1()
        + primitiveOperation2()
    }

    AbstractClass <|-- ConcreteClass1
    AbstractClass <|-- ConcreteClass2
:::

Neste diagrama UML, temos:

- AbstractClass: Uma classe abstrata que define o método templateMethod(). Este método contém uma estrutura algorítmica geral, chamando operações primitivas abstratas.
- ConcreteClass1 e ConcreteClass2: São classes concretas que herdam de AbstractClass e implementam as operações primitivas específicas.


:::mermaid
sequenceDiagram
    participant AbstractClass as Document
    participant ConcreteClass1 as TextDocument
    participant ConcreteClass2 as PDFDocument

    Note over Document: templateMethod()
    Document->>Document: Initialize()
    Document->>Document: Open()
    Document->>Document: Edit()
    Document->>Document: Save()
    Document-->>ConcreteClass1: Display Text
    Document-->>ConcreteClass2: Export to PDF

    ConcreteClass1->>ConcreteClass1: Edit Text
    ConcreteClass1->>ConcreteClass1: Save as .txt
    ConcreteClass1-->>Document: Text displayed

    ConcreteClass2->>ConcreteClass2: Edit Content
    ConcreteClass2->>ConcreteClass2: Export as PDF
    ConcreteClass2-->>Document: PDF exported
:::

Neste exemplo:

AbstractClass representa a classe Document, que define um template method para operações comuns em documentos, como inicialização, abertura, edição e salvamento.
ConcreteClass1 é a classe TextDocument, que herda de Document e implementa as operações específicas para documentos de texto.
ConcreteClass2 é a classe PDFDocument, que herda de Document e implementa as operações específicas para documentos PDF.
