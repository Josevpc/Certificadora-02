document.addEventListener('DOMContentLoaded', () => {

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // 'data' agora contém as combinações e resultados
            const combinations = data.combinations

            const descriptions = data.descriptions

            const modal = document.getElementById('componentModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalImage = document.getElementById('modalImage');
            const modalDescription = document.getElementById('modalDescription');
            const span = document.getElementsByClassName('close')[0];

            const availableComponents = new Set(['Resistor', 'Diodo', 'Fonte de Tensão', 'Capacitor']);
            const totalCombinations = Object.keys(combinations).length;
            let discoveredComponents = new Set();

            const componentsDiv = document.querySelector('.components');
            // --- Div com as combinações resultantes
            //const combinationsDiv = document.querySelector('.combinations');
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
                modalImage.src = ''; // Adicione a URL da imagem correspondente ao novo componente
                modalDescription.textContent = descriptions[name] || 'Descrição não disponível';
                modal.style.display = 'block';
            }

            function hideComponentModal() {
                modal.style.display = 'none';
            }

            // Fecha o modal quando o usuário clica em qualquer lugar fora do modal
            window.onclick = function (event) {
                if (event.target === modal) {
                    hideComponentModal();
                }
            }

            // Fecha o modal quando o usuário clica no botão de fechar
            span.onclick = function () {
                hideComponentModal();
            }

            function updateResultDiv() {
                if (firstComponent && secondComponent) {
                    const combinationKey = `${firstComponent}+${secondComponent}`;
                    const reverseCombinationKey = `${secondComponent}+${firstComponent}`;
                    let resultComponent = combinations[combinationKey] || combinations[reverseCombinationKey];

                    if (resultComponent) {
                        if (availableComponents.has(resultComponent)) {
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
                if (event.target.classList.contains('component')) {
                    const selectedComponent = event.target.dataset.component;
                    if (!firstComponent) {
                        firstComponent = selectedComponent;
                        title1.textContent = firstComponent;
                        img1.src = ''; // Adicione a URL da imagem correspondente, se necessário
                        removeButton1.disabled = false;
                        event.target.classList.add('selected');
                    } else if (!secondComponent) {
                        secondComponent = selectedComponent;
                        title2.textContent = secondComponent;
                        img2.src = ''; // Adicione a URL da imagem correspondente, se necessário
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

                if (resultComponent && !availableComponents.has(resultComponent)) {
                    addNewComponent(resultComponent);
                    addCombinationDescription(resultComponent);
                    availableComponents.add(resultComponent);
                    discoveredComponents.add(resultComponent); // Marca o componente como descoberto
                    showComponentModal(resultComponent);
                    updateProgressBar();
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

                const newHiddenContentDiv = document.createElement('div');
                newHiddenContentDiv.classList.add('hidden-content');
                newHiddenContentDiv.dataset.component = name;
                newHiddenContentDiv.textContent = `${descriptions[name]}`;

                newComponentDiv.appendChild(newHiddenContentDiv);

                componentsDiv.appendChild(newComponentDiv);
            }

            function addCombinationDescription(name) {
                const descriptionDiv = document.createElement('div');
                descriptionDiv.classList.add('combination');
                descriptionDiv.textContent = `${name}: ${descriptions[name]}`;
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
                title1.textContent = 'Título 1';
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
            }

            function clearSelection2() {
                title2.textContent = 'Título 2';
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
            document.querySelectorAll('.component').forEach(component => {
                component.addEventListener('mousedown', (event) => {
                    event.target.dataset.longpress = Date.now();
                });

                component.addEventListener('mouseup', (event) => {
                    const longpressTime = 500; // Tempo mínimo para considerar como "segurar"
                    const pressedTime = event.target.dataset.longpress;

                    if (pressedTime && (Date.now() - pressedTime > longpressTime)) {
                        showComponentModal(event.target.dataset.component);
                    }
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