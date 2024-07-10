/*4 Componentes:
    - Fonte
    - Terra
    - Cabo de Conexão 
    - Resistor

    
Combinações:
    Fonte + Terra || Terra + Fonte = Circuito Aterrado
    Circuito Aterrado + Cabo = Circuito
    Circuito + Resistor = Circuito Resistivo
    Resistor + Resistor = Resistores em Serie
    Resistor + Cabo = Paralelo
    Circuito Resistivo + Resistores em Serie = Circuito Resistivo em Série
    Circuito Resistivo + Paralelo = Circuito Resistivo em Paralelo
*/

// Criação da Classe dos componentes
class Item {
    constructor(name, description, id, recipe, discovered) {
        this.name = name;
        this.description = description;
        this.id = id;
        this.recipe = recipe;
        this.discovered = discovered;
    }
}

// Lista que vai conter todos os objetos Items (são todos os componentes)
let ItemList = [];

// Criação Artificial das receitas e inclusão dos componentes em ItemList
// OBS: Items que já são disponibilizados não tem receitas logo a criação dos mesmos depende dele mesmo, simplificando Item Resistor possui Receita Resistor.

ItemList.push(new Item('Fonte', 'Descrição Foda!', 'fonte', 'fonte', true));
ItemList.push(new Item('Terra', 'Descrição Foda!', 'terra', 'terra', true));
ItemList.push(new Item('Conexão', 'Descrição Foda!', 'conexao', 'conexao', true));
ItemList.push(new Item('Resistor', 'Descrição Foda!', 'resistor', 'resistor', true));

ItemList.push(new Item('Circuito Aterrado', 'Descrição Foda!', 'circ_aterrado', 'fonteterra', false));

// Dicionário que vai conter as receitas. Exemplo de receita = resistorresistor = resistores_serie
// A concatenação dos nomes do componentes é utilizado como chave e vai ser responsável pela procura e devolução do dado da Classe Item

let recipes = {};

function AddRecipes(itemlist) {
    for (let item of itemlist) {
        if (!recipes[item.recipe]) {
            recipes[item.recipe] = item;
        }
    }
}

AddRecipes(ItemList);

// Criação da Função de Combinação

function CombineItems(item1, item2) {
    let combined_item

    if (item1.valueOf() == item2.valueOf()) {
        combined_item = recipes[item1];
    }
    else {
        combined_item = recipes[item1 + item2];
        if (!combined_item) {
            combined_item = recipes[item2 + item1];
            if (!combined_item) {
                // Mensagem ou Caixa de Erro
            }
        }
    }

    if (!combined_item.discovered) {
        combined_item.discovered = true;
    }
    return combined_item;
}

// Função que Retorna os Objetos dos Itens que foram Descobertos

function PrintItemListDiscovered(itemList) {
    let discovered = []

    for (let item of itemList) {
        if (item.discovered) {
            discovered.push(item);
        }
    }

    return discovered;
}

// Função para mostrar os todos os Itens no Console

function PrintItemListAll(itemList) {
    for (let item of itemList) {
        console.log(item.name);
    }
}


// Exemplo de Funcionamento ?
function teste() {
    document.getElementById('resultado').innerText = CombineItems(document.getElementById('input1').value, document.getElementById('input2').value).name;
}

function descobertos() {
    document.getElementById('descobertos').innterText = PrintItemListDiscovered(ItemList);
}

// Exemplo de utilização direta das funções

//PrintItemListDiscovered(ItemList)

//CombineItems("fonte", "terra")

//PrintItemListDiscovered(ItemList)