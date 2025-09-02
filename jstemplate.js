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
        level0: '#ccc',
        colors: ['#add8e6', '#87ceeb', '#4682b4', '#5f9ea0', '#b0c4de', '#000', '#00bfff', '#1e90ff', '#6495ed', '#4169e1', '#0000ff', '#0000cd', '#00008b', '#191970', '#f0f8ff', '#e6e6fa', '#d3d3d3', '#c0c0c0', '#a9a9a9', '#808080']
    },
    'Herbst': {
        level0: '#8b4000',
        colors: ['#8b4513', '#a0522d', '#cd853f', '#d2691e', '#b8860b', '#daa520', '#f4a460', '#e9967a', '#fa8072', '#ff8c00', '#ff7f50', '#ff6347', '#ff4500', '#ff4040', '#cd5c5c', '#b22222', '#a52a2a', '#800000', '#8b0000']
    },
    'Sommer': {
        level0: '#ffd000',
        colors: ['#ffd700', '#ffff00', '#fffacd', '#fafad2', '#f0e68c', '#eee8aa', '#f08080', '#ffa07a', '#ff7f50', '#ff6347', '#ff4500', '#ff1493', '#ff00ff', '#ff69b4', '#ffc0cb', '#ffb6c1', '#db7093', '#c71585', '#ff00ff', '#da70d6']
    },
    'Kontrast': {
        level0: '#FF0099',
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00', '#FF6600', '#0066FF', '#66FF00', '#CC00FF', '#00CC66', '#99FF00', '#3300FF', '#FFCC33', '#00FF99']
    },
    'Frühling': {
        level0: '#98FB98',
        colors: ['#adff2f', '#7fff00', '#32cd32', '#00fa9a', '#3cb371', '#90ee90', '#00ced1', '#20b2aa', '#afeeee', '#ffb6c1', '#ffc0cb', '#ff69b4', '#dda0dd']
    },
    'Retro': {
        level0: '#ffcc00',
        colors: ['#ff9966', '#ff6666', '#cc6699', '#9966cc', '#6699cc', '#66cccc', '#66cc99', '#99cc66', '#cccc66', '#ffcc66', '#ff9966']
    },
    'Pastell': {
        level0: '#ffe4e1',
        colors: ['#ffd1dc', '#ffe4b5', '#fafad2', '#e6e6fa', '#d8bfd8', '#dda0dd', '#b0e0e6', '#afeeee', '#98fb98', '#f5fffa', '#f0fff0', '#fffacd', '#ffe4e1']
    },
    'Neon': {
        level0: '#39ff14',
        colors: ['#39ff14', '#ff073a', '#fe019a', '#bc13fe', '#04d9ff', '#00ffff', '#ff6ec7', '#ff91a4', '#ffcc00', '#f5f547', '#ff5f1f', '#ff3131']
    },
    'Rams': {
        level0: '#000',
        colors: ['#e5e5e5', '#ff6900', '#ffd400', '#3fa535', '#0055a5', '#4f4f4f', '#7d7d7d']
    },
    'Monochrom': {
        level0: '#000',
        colors: ['#000']
    }

};


// Function for calculating the relative luminance of a color
function calculateLuminance(hex) {
    const rgb = hexToRgb(hex);
    const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Converts hex color to RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Selects text color based on background color
function getContrastTextColor(bgColor) {
    const luminance = calculateLuminance(bgColor);
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

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

// Measure text width
const measureTextWidth = (text, fontSize = 14, fontFamily = 'Inter, system-ui, sans-serif') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px ${fontFamily}`;
    return context.measureText(text).width;
};

// Lange Wörter aufteilen
const splitLongWord = (word, maxWidth, fontSize, fontFamily = 'Inter, system-ui, sans-serif') => {
    const chars = word.split('');
    const result = [];
    let current = '';

    for (let i = 0; i < chars.length; i++) {
        const test = current + chars[i];
        if (measureTextWidth(test, fontSize, fontFamily) <= maxWidth) {
            current += chars[i];
        } else {
            if (current.length > 0) {
                result.push(current + (i < chars.length - 1 ? '-' : ''));
                current = chars[i];
            } else {
                result.push(chars[i] + (i < chars.length - 1 ? '-' : ''));
                current = '';
            }
        }
    }
    if (current.length > 0) result.push(current);
    return result;
};


