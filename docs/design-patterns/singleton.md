=> Design patter: Singleton
O padrão de design Singleton é um padrão de criação que garante que uma classe tenha apenas uma instância e fornece um ponto global para acessá-la. Isso é útil quando você deseja ter apenas uma única instância de uma classe controlando determinado recurso ou quando deseja compartilhar uma única instância de um objeto em todo o seu programa.

- Construtor Privado: A classe Singleton tem um construtor privado, o que significa que não pode ser instanciada externamente.
- Instância Única: A classe mantém uma única instância privada de si mesma.
- Método Estático de Acesso: A classe fornece um método estático público que permite que os clientes obtenham a instância única. Esse método cria a instância se ela ainda não existir ou retorna a instância já existente.

:::mermaid
classDiagram
    class Singleton {
        - instance: Singleton
        + getInstance(): Singleton
        - Singleton()
    }

    Singleton --> "1 instance" Singleton : <<Singleton>>
:::
