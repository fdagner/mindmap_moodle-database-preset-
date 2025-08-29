// Globale Variablen und Konstanten
let nodeCounter = 0;
let mindmapData = [];
let draggedNode = null;
let nodeToDelete = null;
let currentZoom = 1;
let warningShown = false;
let hasInteractedWithRoot = false; // Track interaction with root node
const MAX_LEVEL = 8;
const MAX_CHILDREN_PER_NODE = 100;
const MAX_TEXT_LENGTH = 150;
const BRANCH_COLORS_SCHEMES = {
    'Standard': {
        level0: '#667eea',
        colors: ['#00BFFF', '#2ecc71', '#f39c12', '#ec5353', '#e84393', '#1abc9c', '#9b59b6', '#e67e22', '#3498db']
    },
    'Hell': {
        level0: '#f5f5f5',
        colors: ['#f0f8ff', '#f4d9cc', '#fffacd', '#ffe4e1', '#f5f5f5', '#f0e6ff', '#f0fff0', '#f5fffa', '#fff5ee', '#f5f5dc', '#fffaf0', '#f8f8ff', '#f0e68c', '#e6e6fa', '#fff0f5', '#e0ffff', '#f0ffff', '#faebd7']
    },
    'Dunkel': {
        level0: '#000',
        colors: ['#2f3d06', '#4b0082', '#800000', '#414141', '#2e2e2e', '#483d8b', '#653b37', '#00008b', '#003366', '#004d00', '#660000', '#333333', '#4d4d4d']
    },
    'Winter': {
        level0: '#add8e6',
        colors: ['#add8e6', '#87ceeb', '#4682b4', '#5f9ea0', '#b0c4de', '#000', '#00bfff', '#1e90ff', '#6495ed', '#4169e1', '#0000ff', '#0000cd', '#00008b', '#191970', '#f0f8ff', '#e6e6fa', '#d3d3d3', '#c0c0c0', '#a9a9a9', '#808080']
    },
    'Herbst': {
        level0: '#8b4513',
        colors: ['#8b4513', '#a0522d', '#cd853f', '#d2691e', '#b8860b', '#daa520', '#f4a460', '#e9967a', '#fa8072', '#ff8c00', '#ff7f50', '#ff6347', '#ff4500', '#ff4040', '#cd5c5c', '#b22222', '#a52a2a', '#800000', '#8b0000']
    },
    'Sommer': {
        level0: '#ffd700',
        colors: ['#ffd700', '#ffff00', '#fffacd', '#fafad2', '#f0e68c', '#eee8aa', '#f08080', '#ffa07a', '#ff7f50', '#ff6347', '#ff4500', '#ff1493', '#ff00ff', '#ff69b4', '#ffc0cb', '#ffb6c1', '#db7093', '#c71585', '#ff00ff', '#da70d6']
    },
    'Kontrast': {
        level0: '#FF0000',
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00', '#FF6600', '#0066FF', '#66FF00', '#CC00FF', '#00CC66', '#FF0099', '#99FF00', '#3300FF', '#FFCC33', '#00FF99']
    }
};


// Modal-Funktionen
const showModal = (id, message, buttons = '') => {
    const modal = document.getElementById(id);
    if (!modal) {
        console.error(`Modal with ID ${id} not found.`);
        return;
    }
    const messageElement = document.getElementById(`${id}Message`);
    const buttonsElement = document.getElementById(`${id}Buttons`);
    if (messageElement) messageElement.textContent = message;
    if (buttons && buttonsElement) buttonsElement.innerHTML = buttons;
    modal.style.display = 'flex';
};

const closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
    if (id === 'deleteModal') nodeToDelete = null;
    if (id === 'warningModal') warningShown = false;
};

const showErrorModal = (message) => showModal('errorModal', message);
const closeErrorModal = () => closeModal('errorModal');
const showSuccessModal = (message) => showModal('successModal', message);
const closeSuccessModal = () => closeModal('successModal');
const showWarningModal = (message) => !warningShown && showModal('warningModal', message);


