# Circuit.IO

Este projeto foi desenvolvido como parte da **Disciplina Certificadora 2** na **Universidade Tecnológica Federal do Paraná (UTFPR) - Campus Cornelio Procópio**. O objetivo é promover o aprendizado de eletrônica de forma lúdica para adolescentes, utilizando uma abordagem interativa e gamificada para ensinar conceitos e combinações de componentes e circuitos eletrônicos.

Embora inicialmente direcionado para adolescentes, o projeto também é adequado para estudantes universitários e pode ser utilizado como ferramenta de apoio por professores em sala de aula.

## Autores

Este projeto foi desenvolvido por:

- **José Victor Piccin** - [GitHub](https://github.com/Josevpc)
- **Alessandro Marcondes M. Silva** - [GitHub](https://github.com/Alessandro-Marcondes)
- **Tom Outsuki** - [GitHub](https://github.com/tomoutsuki)

## Funcionalidades

- **Sistema de Combinações**: Permite que os jogadores combinem diferentes componentes eletrônicos para criar novos circuitos.
- **Barra de Progresso**: Exibe o avanço do usuário ao longo dos desafios, incentivando o engajamento contínuo. A cada combinação correta, a barra de progresso é preenchida, permitindo que os usuários acompanhem seu desenvolvimento e motivando-os a continuar.
- **Elementos Cômicos**: Algumas combinações de componentes resultam em efeitos inesperados, como circuitos que "não funcionam".
- **Efeitos Sonoros e Visuais**: Cada ação do usuário, como uma combinação de componentes, é acompanhada por efeitos sonoros e visuais que tornam a experiência mais imersiva.
- **Simplicidade de Edição**: Para adicionar novos componentes ou combinações, basta inserir o componente ou receita dentro de `"combinations": {}`, seguindo obrigatoriamente o mesmo padrão dos demais componentes. Abaixo, insira a descrição do componente em `"descriptions": {}`.

- **Exemplo**:
  ```data.json
  "combinations": {
      "Resistor": {
          "name": "Resistor",
          "initial_state": 1
      },
      "Novo Componente": { -> Aqui você coloca o nome ou a receita, por exemplo: Resistor + Novo Componente
          "name": "Novo Componente", -> Nome do Componente
          "initial_state": 1 -> 1 significa que o componente está disponível desde o início; 0 indica que ele deve ser descoberto por meio de combinações
      }
  },
  
  "descriptions": {
      "Resistor": {
          "short": "Limita a corrente, transformando energia elétrica em energia térmica.",
          "long": "Reduz o fluxo de corrente em um circuito, dissipando energia na forma de calor. Essencial para controlar níveis de tensão e corrente.",
          "image": "Assets/components/resistor.png"
      },
      "Novo Componente": {
          "short": "Descrição curta do novo componente", -> Descrição curta, com até 100 caracteres (pode passar disso)
          "long": "Descrição longa do novo componente", -> Descrição longa, com até 300 caracteres (pode passar disso)
          "image": "Assets/components/novo_componente.png" -> Local onde a imagem do componente está armazenada
      }
  }

## Tecnologias Utilizadas

- HTML
- CSS
- Javascript

## Como Usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/Josevpc/Certificadora-02

  Ou acesse a aplicação por meio do Github Pages:
  https://josevpc.github.io/Certificadora-02/
