const select = new Audio('./Assets/sound/select.mp3');
const correct = new Audio('./Assets/sound/correct.mp3');
const wrong = new Audio('./Assets/sound/wrong.mp3');

document.addEventListener('DOMContentLoaded', () => {

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // 'data' agora contém as combinações e resultados
            const combinations = data.combinations

            const descriptions = data.descriptions

            // Inicializa uma lista para armazenar os componentes iniciais
            let activeComponents = [];

            // Itera sobre as combinações para verificar o estado inicial
            for (let key in combinations) {
                if (combinations[key].initial_state == 1) {
                    activeComponents.push(combinations[key].name);
                }
            }

            const modal = document.getElementById('componentModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalImage = document.getElementById('modalImage');
            const modalDescription = document.getElementById('modalDescription');
            const span = document.getElementsByClassName('close')[0];
            const confettiContainer = document.getElementsByClassName("js-container");

            confettiContainer[1].style.display = "none";

            const availableComponents = new Set(['Resistor', 'Diodo', 'Fonte de Tensão', 'Capacitor']);
            const totalCombinations = Object.keys(combinations).length;
            let discoveredComponents = new Set();

            const componentsDiv = document.querySelector('.components');
            // --- Div com as combinações resultantes
            //const combinationsDiv = document.querySelector('.combinations');

            activeComponents.forEach(component => {
                addNewComponent(component);
            })

            const combineButton = document.getElementById('combineButton');

            const box1 = document.getElementById('box1');
            const title1 = document.getElementById('title1');
            const img1 = document.getElementById('img1');
            const removeButton1 = document.getElementById('removeButton1');

            const box2 = document.getElementById('box2');
            const title2 = document.getElementById('title2');
            const img2 = document.getElementById('img2');
            const removeButton2 = document.getElementById('removeButton2');

            const resultDiv = document.getElementById('result');

            let firstComponent = null;
            let secondComponent = null;

            function updateProgressBar() {
                const discoveredCount = discoveredComponents.size;
                const progressPercentage = (discoveredCount / totalCombinations) * 100;

                // Atualiza a barra de progresso
                const progressBar = document.getElementById('progressBar');
                const progressText = document.getElementById('progressText');

                progressBar.style.width = `${progressPercentage}%`;
                progressBar.textContent = `${Math.round(progressPercentage)}%`;
                progressText.textContent = `${discoveredCount}/${totalCombinations} componentes descobertos`;
            }

            function showComponentModal(name) {
                modalTitle.textContent = name;
                modalImage.src = descriptions[name].image; // Adicione a URL da imagem correspondente ao novo componente
                modalDescription.textContent = descriptions[name].long || 'Descrição não disponível';
                modal.style.display = 'block';
            }

            function hideComponentModal() {
                modal.style.display = 'none';
            }

            // Fecha o modal quando o usuário clica em qualquer lugar fora do modal
            window.onclick = function (event) {
                if (event.target === modal) {
                    hideComponentModal();
                    confettiContainer[1].style.display = "none";
                }
            }

            // Fecha o modal quando o usuário clica no botão de fechar
            span.onclick = function () {
                hideComponentModal();
                confettiContainer[1].style.display = "none";
            }

            function updateResultDiv() {
                if (firstComponent && secondComponent) {
                    const combinationKey = `${firstComponent}+${secondComponent}`;
                    const reverseCombinationKey = `${secondComponent}+${firstComponent}`;

                    let resultComponent = combinations[combinationKey] || combinations[reverseCombinationKey];


                    if (resultComponent) {
                        if (availableComponents.has(resultComponent.name)) {
                            resultDiv.textContent = 'Componente já descoberto';
                            resultDiv.style.fontSize = '24px'; // Ajusta o tamanho da fonte
                            resultDiv.style.textAlign = 'center'; // Centraliza o texto
                        } else {
                            resultDiv.textContent = '?';
                            resultDiv.style.fontSize = '100px'; // Ajusta o tamanho da interrogação
                            resultDiv.style.textAlign = 'center'; // Centraliza o texto
                        }
                    } else {
                        resultDiv.textContent = 'Sem combinação';
                        resultDiv.style.fontSize = '24px'; // Ajusta o tamanho da fonte
                        resultDiv.style.textAlign = 'center'; // Centraliza o texto
                    }
                } else {
                    resultDiv.textContent = ''; // Limpa a div 3 se não houver seleção completa
                }
            }

            componentsDiv.addEventListener('click', (event) => {
                select.play();
                if (event.target.classList.contains('component')) {
                    const selectedComponent = event.target.dataset.component;
                    if (!firstComponent) {
                        firstComponent = selectedComponent;
                        title1.textContent = firstComponent;
                        img1.style.display = "flex";
                        img1.src = descriptions[firstComponent].image; // Adicione a URL da imagem correspondente, se necessário
                        removeButton1.disabled = false;
                        event.target.classList.add('selected');
                    } else if (!secondComponent) {
                        secondComponent = selectedComponent;
                        title2.textContent = secondComponent;
                        img2.style.display = "flex";
                        img2.src = descriptions[secondComponent].image; // Adicione a URL da imagem correspondente, se necessário
                        removeButton2.disabled = false;
                        event.target.classList.add('selected');
                        combineButton.disabled = false;
                    }
                    updateResultDiv(); // Atualiza a visualização do resultado sempre que a seleção muda
                }
            });

            combineButton.addEventListener('click', () => {
                const combinationKey = `${firstComponent}+${secondComponent}`;
                const reverseCombinationKey = `${secondComponent}+${firstComponent}`;
                let resultComponent = combinations[combinationKey] || combinations[reverseCombinationKey];

                if (resultComponent && !availableComponents.has(resultComponent.name)) {
                    addNewComponent(resultComponent.name);
                    addCombinationDescription(resultComponent.name);
                    availableComponents.add(resultComponent.name);
                    discoveredComponents.add(resultComponent.name); // Marca o componente como descoberto
                    showComponentModal(resultComponent.name);
                    updateProgressBar();
                    confettiContainer[1].style.display = "block";
                    confettiContainer[1].style.animation = "confetti-fadeout 3s forwards";
                    correct.play();
                } else {
                    wrong.play();
                }

                clearSelections();
            });

            removeButton1.addEventListener('click', () => {
                clearSelection1();
                updateSelectedComponents();
                updateResultDiv(); // Atualiza a visualização do resultado após remover a seleção
            });

            removeButton2.addEventListener('click', () => {
                clearSelection2();
                updateSelectedComponents();
                updateResultDiv(); // Atualiza a visualização do resultado após remover a seleção
            });

            function addNewComponent(name) {
                const newComponentDiv = document.createElement('div');
                newComponentDiv.classList.add('component');
                newComponentDiv.dataset.component = name;
                newComponentDiv.textContent = name;

                /*const newHiddenContentDiv = document.createElement('div');
                newHiddenContentDiv.classList.add('hidden-content');
                newHiddenContentDiv.dataset.component = name;
                newHiddenContentDiv.textContent = `${descriptions[name].short}`;

                newComponentDiv.appendChild(newHiddenContentDiv);
*/
                componentsDiv.appendChild(newComponentDiv);
            }

            function addCombinationDescription(name) {
                const descriptionDiv = document.createElement('div');
                descriptionDiv.classList.add('combination');
                descriptionDiv.textContent = `${name}: ${descriptions[name].short}`;
                // --- Comentei isso enquanto não pensamos em uma boa ideia para a div de combinações.
                //combinationsDiv.appendChild(descriptionDiv);
            }

            function clearSelections() {
                firstComponent = null;
                secondComponent = null;
                combineButton.disabled = true;

                clearSelection1();
                clearSelection2();
            }

            function clearSelection1() {
                title1.textContent = 'Componente 1';
                img1.src = '';
                removeButton1.disabled = true;

                // Remove a seleção do componente
                document.querySelectorAll('.component').forEach(component => {
                    if (component.dataset.component === firstComponent) {
                        component.classList.remove('selected');
                    }
                });
                firstComponent = null;
                checkCombineButton();
                img1.style.display = "none";

            }

            function clearSelection2() {
                title2.textContent = 'Componente 2';
                img2.src = '';
                removeButton2.disabled = true;

                // Remove a seleção do componente
                document.querySelectorAll('.component').forEach(component => {
                    if (component.dataset.component === secondComponent) {
                        component.classList.remove('selected');
                    }
                });

                secondComponent = null;
                checkCombineButton();
                img2.style.display = "none";
            }

            function checkCombineButton() {
                combineButton.disabled = !firstComponent || !secondComponent;
            }

            function updateSelectedComponents() {
                document.querySelectorAll('.component').forEach(component => {
                    const componentName = component.dataset.component;
                    if (componentName !== firstComponent && componentName !== secondComponent) {
                        component.classList.remove('selected');
                    }
                });
            }


            // Mostra o modal quando o usuário clica e segura um componente
            document.querySelectorAll('.components').forEach(component => {
                component.addEventListener('mousedown', (event) => {
                    const target = event.target;
                    target.dataset.longpress = Date.now(); // Armazena o momento em que o botão foi pressionado

                    // Define o tempo mínimo para considerar como "segurar"
                    const longpressTime = 500;

                    // Cria um temporizador para executar a ação após o tempo de "segurar"
                    target.longpressTimeout = setTimeout(() => {
                        showComponentModal(target.dataset.component);
                    }, longpressTime);
                });

                component.addEventListener('mouseup', (event) => {
                    clearTimeout(event.target.longpressTimeout); // Limpa o temporizador se o mouse for solto antes do tempo
                });

                component.addEventListener('mouseleave', (event) => {
                    clearTimeout(event.target.longpressTimeout); // Limpa o temporizador se o mouse sair do elemento
                });
            });
        }).catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
});

//Função de Busca da Barra Leteral
function search() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.component');

    items.forEach(item => {
        if (item.textContent.toLowerCase().startsWith(input)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}