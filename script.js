// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Number counting animation
const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        if (!target) return;

        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                number.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target + '+';
            }
        };

        updateNumber();
    });
};

// Intersection Observer for number animation
const statCards = document.querySelectorAll('.stat-card');
let animated = false;

if (statCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateNumbers();
                animated = true;
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => observer.observe(card));
}

// Publication filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const pubItems = document.querySelectorAll('.pub-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        pubItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'flex';
            } else {
                const type = item.getAttribute('data-type');
                if (type === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Geotechnical Animation for Hero Section =====
class GeotechnicalAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.seismicWaves = [];
        this.soilLayers = [];
        this.buildings = [];
        this.tunnels = [];
        this.neuralNetwork = { nodes: [], connections: [] };
        this.dataFlows = [];
        this.time = 0;
        this.mouse = { x: null, y: null };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.createSoilLayers();
        this.createBuildings();
        this.createTunnels();
        this.createParticles();
        this.createNeuralNetwork();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // ===== 반응형 스케일 시스템 (1024px 기준) =====
        // 최소 1024px을 기준으로 설계, 화면이 커지면 비례해서 커짐
        const BASE_WIDTH = 1024;
        const BASE_HEIGHT = 600;

        const w = window.innerWidth;
        const h = window.innerHeight;

        // 스케일 계산: 1024px에서 1.0, 1920px에서 약 1.87, 2560px에서 2.5
        // 최소 1.0 (1024px 이하에서도 1.0 유지), 최대 2.0 제한
        const widthScale = w / BASE_WIDTH;
        const heightScale = h / BASE_HEIGHT;
        this.scale = Math.min(2.0, Math.max(1.0, Math.min(widthScale, heightScale)));

        // 화면 정보 저장
        this.screenWidth = w;
        this.screenHeight = h;

        // 레이아웃 계산을 위한 기준점 (픽셀 단위로 계산)
        // 전체 컨텐츠 영역을 3등분: Input(25%) | Network(50%) | Output(25%)
        this.layout = {
            // 상단 애니메이션 영역 높이 (화면의 55%)
            contentHeight: h * 0.55,
            contentTop: h * 0.05,

            // 3개 섹션의 중심 X좌표
            inputCenterX: w * 0.18,
            networkCenterX: w * 0.5,
            outputCenterX: w * 0.82,

            // 각 섹션의 사용 가능 너비
            sectionWidth: w * 0.28
        };

        // Debug info
        console.log(`Screen: ${w}x${h} | Scale: ${this.scale.toFixed(2)} | Base: ${BASE_WIDTH}px`);
    }

    // Create soil layers (geological strata) - reduced height
    createSoilLayers() {
        this.soilLayers = [
            { y: this.canvas.height * 0.65, color: 'rgba(60, 100, 140, 0.3)', name: 'Surface Layer' },
            { y: this.canvas.height * 0.75, color: 'rgba(50, 80, 120, 0.35)', name: 'Clay' },
            { y: this.canvas.height * 0.85, color: 'rgba(40, 70, 110, 0.4)', name: 'Sand' },
            { y: this.canvas.height * 0.95, color: 'rgba(30, 60, 100, 0.45)', name: 'Gravel' },
            { y: this.canvas.height, color: 'rgba(20, 50, 90, 0.5)', name: 'Bedrock' }
        ];
    }

    // Create buildings on surface
    createBuildings() {
        const buildingCount = Math.floor(this.canvas.width / 250);
        this.buildings = [];

        for (let i = 0; i < buildingCount; i++) {
            const x = 100 + i * 250 + Math.random() * 50;
            const width = 40 + Math.random() * 30;
            const height = 60 + Math.random() * 80;

            this.buildings.push({
                x: x,
                y: this.canvas.height * 0.65 - height,
                width: width,
                height: height,
                sway: 0,
                swaySpeed: 0.02 + Math.random() * 0.01
            });
        }
    }

    // Create underground tunnels
    createTunnels() {
        this.tunnels = [
            {
                x: this.canvas.width * 0.3,
                y: this.canvas.height * 0.78,
                radius: 35,
                type: 'circular'
            },
            {
                x: this.canvas.width * 0.7,
                y: this.canvas.height * 0.74,
                width: 60,
                height: 45,
                type: 'box'
            }
        ];
    }

    // Create neural network for ML visualization - enlarged and more complex
    createNeuralNetwork() {
        const scale = this.scale || 1;
        const layout = this.layout;

        // 레이어 구성 (7개 레이어)
        const layers = [4, 6, 10, 12, 10, 6, 4];

        // Neural Network 위치 및 크기 (1024px 기준값 * scale * 0.9 축소)
        const sizeMultiplier = 0.9;  // 0.9배 축소
        const baseNetworkWidth = 280 * sizeMultiplier;  // 1024px에서의 네트워크 너비
        const baseNodeRadius = 10 * sizeMultiplier;     // 1024px에서의 노드 반지름
        const baseLayerHeight = 300 * sizeMultiplier;   // 1024px에서의 레이어 높이

        const networkWidth = baseNetworkWidth * scale;
        const nodeRadius = baseNodeRadius * scale;
        const layerHeight = Math.min(baseLayerHeight * scale, layout.contentHeight * 0.85);

        const centerX = layout.networkCenterX;
        const startX = centerX - networkWidth / 2;
        const endX = centerX + networkWidth / 2;
        // 세로 중앙 정렬 - 다른 섹션과 같은 centerY 사용
        const centerY = layout.contentTop + layout.contentHeight * 0.45;
        const startY = centerY - layerHeight / 2;

        this.neuralNetwork.nodes = [];
        this.neuralNetwork.connections = [];
        this.neuralNetwork.layerHeight = layerHeight;
        this.neuralNetwork.centerY = centerY; // 세로 중앙 위치 저장 (다른 섹션과 정렬용)

        // Create nodes for each layer
        layers.forEach((nodeCount, layerIndex) => {
            const x = startX + (endX - startX) * (layerIndex / (layers.length - 1));
            const layerNodes = [];

            for (let i = 0; i < nodeCount; i++) {
                const spacing = layerHeight / (nodeCount + 1);
                const y = startY + spacing * (i + 1);
                layerNodes.push({
                    x: x,
                    y: y,
                    radius: nodeRadius,
                    activation: Math.random(),
                    layer: layerIndex
                });
            }
            this.neuralNetwork.nodes.push(layerNodes);
        });

        // Create connections between layers (skip connections for complexity)
        for (let l = 0; l < this.neuralNetwork.nodes.length - 1; l++) {
            const currentLayer = this.neuralNetwork.nodes[l];
            const nextLayer = this.neuralNetwork.nodes[l + 1];

            currentLayer.forEach(node => {
                nextLayer.forEach(nextNode => {
                    this.neuralNetwork.connections.push({
                        from: node,
                        to: nextNode,
                        weight: Math.random(),
                        signal: Math.random()
                    });
                });
            });
        }

        // Add skip connections (residual connections) for more complexity
        for (let l = 0; l < this.neuralNetwork.nodes.length - 2; l++) {
            const currentLayer = this.neuralNetwork.nodes[l];
            const skipLayer = this.neuralNetwork.nodes[l + 2];

            // Connect some nodes with skip connections
            for (let i = 0; i < Math.min(currentLayer.length, skipLayer.length); i++) {
                this.neuralNetwork.connections.push({
                    from: currentLayer[i],
                    to: skipLayer[i],
                    weight: Math.random(),
                    signal: Math.random(),
                    isSkip: true
                });
            }
        }
    }

    // Draw neural network
    drawNeuralNetwork() {
        const ctx = this.ctx;

        // Draw connections with signal animation
        this.neuralNetwork.connections.forEach(conn => {
            // Animate signals through connections
            conn.signal += 0.015;
            if (conn.signal > 1) conn.signal = 0;

            const gradient = ctx.createLinearGradient(conn.from.x, conn.from.y, conn.to.x, conn.to.y);
            const signalPos = conn.signal;

            if (conn.isSkip) {
                // Skip connections with different color (purple/magenta)
                gradient.addColorStop(0, 'rgba(180, 100, 255, 0.1)');
                gradient.addColorStop(Math.max(0, signalPos - 0.15), 'rgba(180, 100, 255, 0.1)');
                gradient.addColorStop(signalPos, 'rgba(255, 150, 255, 0.8)');
                gradient.addColorStop(Math.min(1, signalPos + 0.15), 'rgba(180, 100, 255, 0.1)');
                gradient.addColorStop(1, 'rgba(180, 100, 255, 0.1)');
                ctx.beginPath();
                ctx.moveTo(conn.from.x, conn.from.y);
                // Draw curved skip connection
                const midX = (conn.from.x + conn.to.x) / 2;
                const midY = (conn.from.y + conn.to.y) / 2 - 30;
                ctx.quadraticCurveTo(midX, midY, conn.to.x, conn.to.y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            } else {
                // Regular connections
                gradient.addColorStop(0, 'rgba(0, 150, 255, 0.12)');
                gradient.addColorStop(Math.max(0, signalPos - 0.15), 'rgba(0, 150, 255, 0.12)');
                gradient.addColorStop(signalPos, 'rgba(0, 255, 200, 1)');
                gradient.addColorStop(Math.min(1, signalPos + 0.15), 'rgba(0, 150, 255, 0.12)');
                gradient.addColorStop(1, 'rgba(0, 150, 255, 0.12)');

                ctx.beginPath();
                ctx.moveTo(conn.from.x, conn.from.y);
                ctx.lineTo(conn.to.x, conn.to.y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        // Draw nodes with pulsing effect - removed orange, using blue/cyan
        this.neuralNetwork.nodes.forEach((layer, layerIndex) => {
            layer.forEach(node => {
                // Update activation with sine wave
                node.activation = 0.5 + 0.5 * Math.sin(this.time * 0.05 + node.x * 0.1 + node.y * 0.1);

                // Outer glow
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 200, 255, ${node.activation * 0.4})`;
                ctx.fill();

                // Main node - all blue/cyan/green colors (no orange)
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                const nodeColor = layerIndex === 0 ? 'rgba(100, 180, 255, 0.95)' :
                                  layerIndex === this.neuralNetwork.nodes.length - 1 ? 'rgba(50, 255, 150, 0.95)' :
                                  'rgba(0, 200, 255, 0.95)';
                ctx.fillStyle = nodeColor;
                ctx.fill();

                // Inner highlight
                ctx.beginPath();
                ctx.arc(node.x - 3, node.y - 3, node.radius * 0.35, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
            });
        });

        // Draw 4-quadrant input visualization on the left
        this.drawInputQuadrants();

        // Draw accurate prediction output on the right
        this.drawOutputPrediction();
    }

    // Draw 4-quadrant input visualization
    drawInputQuadrants() {
        const ctx = this.ctx;
        const scale = this.scale || 1;
        const layout = this.layout;

        // 1024px 기준 크기
        const baseQuadrantSize = 100;  // 1024px에서 각 quadrant 크기
        const baseGap = 6;             // 1024px에서 간격

        // 스케일 적용
        const quadrantSize = baseQuadrantSize * scale;
        const gap = baseGap * scale;

        // 위치 계산 - layout 시스템 사용
        const centerX = layout.inputCenterX;
        const centerY = layout.contentTop + layout.contentHeight * 0.45;

        // 4 quadrants: 1-structural response, 2-response spectrum, 3-ground properties, 4-hazard curve
        const quadrants = [
            { dx: -1, dy: -1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: 1, dy: 1 }
        ];

        quadrants.forEach((quad, i) => {
            const qx = centerX + quad.dx * (quadrantSize / 2 + gap / 2);
            const qy = centerY + quad.dy * (quadrantSize / 2 + gap / 2);

            // Quadrant background
            ctx.fillStyle = 'rgba(0, 50, 100, 0.6)';
            ctx.fillRect(qx - quadrantSize / 2, qy - quadrantSize / 2, quadrantSize, quadrantSize);

            // Quadrant border with glow
            ctx.strokeStyle = 'rgba(0, 191, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(qx - quadrantSize / 2, qy - quadrantSize / 2, quadrantSize, quadrantSize);

            // Draw different visualizations for each quadrant
            if (i === 0) {
                // Structural Response - Building with vibration lines
                this.drawStructuralResponse(ctx, qx, qy, quadrantSize);
            } else if (i === 1) {
                // Response Spectrum - Curve graph
                this.drawResponseSpectrum(ctx, qx, qy, quadrantSize);
            } else if (i === 2) {
                // Ground Properties - Soil layers
                this.drawGroundProperties(ctx, qx, qy, quadrantSize);
            } else if (i === 3) {
                // Hazard Curve - Probability curve
                this.drawHazardCurve(ctx, qx, qy, quadrantSize);
            }
        });

        // Draw data flow lines to neural network
        this.drawDataFlowToNetwork(centerX + quadrantSize + 20 * scale, centerY);
    }

    // Draw structural response visualization
    drawStructuralResponse(ctx, x, y, size) {
        const scale = this.scale || 1;
        const sizeScale = size / 210; // Scale based on quadrant size
        const buildingWidth = 60 * sizeScale;
        const buildingHeight = 110 * sizeScale;
        const sway = Math.sin(this.time * 0.08) * 12 * sizeScale;

        ctx.save();
        ctx.translate(x, y + 20 * sizeScale);
        ctx.transform(1, 0, sway / buildingHeight, 1, 0, 0);
        ctx.translate(-x, -(y + 20 * sizeScale));

        // Building
        ctx.fillStyle = 'rgba(100, 180, 255, 0.8)';
        ctx.fillRect(x - buildingWidth / 2, y - buildingHeight / 2, buildingWidth, buildingHeight);

        // Windows
        ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 4; c++) {
                ctx.fillRect(x - 24 * sizeScale + c * 14 * sizeScale, y - 48 * sizeScale + r * 15 * sizeScale, 10 * sizeScale, 11 * sizeScale);
            }
        }
        ctx.restore();

        // Vibration lines
        for (let i = 0; i < 6; i++) {
            const lineY = y - 50 * sizeScale + i * 20 * sizeScale;
            const wave = Math.sin(this.time * 0.1 + i) * 7 * sizeScale;
            ctx.beginPath();
            ctx.moveTo(x - 85 * sizeScale, lineY + wave);
            ctx.lineTo(x - 45 * sizeScale, lineY - wave);
            ctx.moveTo(x + 45 * sizeScale, lineY + wave);
            ctx.lineTo(x + 85 * sizeScale, lineY - wave);
            ctx.strokeStyle = 'rgba(0, 255, 200, 0.6)';
            ctx.lineWidth = Math.max(1, 3 * scale);
            ctx.stroke();
        }
    }

    // Draw response spectrum visualization
    drawResponseSpectrum(ctx, x, y, size) {
        const scale = this.scale || 1;
        const sizeScale = size / 210;

        // 축을 중앙에 배치
        const axisY = y + 5 * sizeScale;

        // Draw spectrum curve - 크기를 키워서 박스를 더 채움
        ctx.beginPath();
        ctx.moveTo(x - 75 * sizeScale, axisY);

        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const curveX = x - 75 * sizeScale + t * 150 * sizeScale;
            // 감쇠 진동 - 크기를 키움
            const amplitude = Math.exp(-t * 2) * Math.sin(t * 10 + this.time * 0.05) * 60 * sizeScale;
            const curveY = axisY - amplitude;
            ctx.lineTo(curveX, curveY);
        }

        ctx.strokeStyle = 'rgba(0, 255, 200, 0.9)';
        ctx.lineWidth = Math.max(2, 2.5 * scale);
        ctx.stroke();

        // Axes - 중앙에 배치, 크기 키움
        ctx.beginPath();
        // X축 (중앙)
        ctx.moveTo(x - 78 * sizeScale, axisY);
        ctx.lineTo(x + 78 * sizeScale, axisY);
        // Y축
        ctx.moveTo(x - 78 * sizeScale, y + 70 * sizeScale);
        ctx.lineTo(x - 78 * sizeScale, y - 70 * sizeScale);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = Math.max(1, 1.5 * scale);
        ctx.stroke();
    }

    // Draw ground properties visualization
    drawGroundProperties(ctx, x, y, size) {
        const scale = this.scale || 1;
        const sizeScale = size / 210;
        const layerColors = [
            'rgba(100, 150, 200, 0.7)',
            'rgba(80, 130, 180, 0.7)',
            'rgba(60, 110, 160, 0.7)',
            'rgba(40, 90, 140, 0.7)'
        ];

        const layerHeight = 42 * sizeScale;
        for (let i = 0; i < 4; i++) {
            // Wave effect for each layer
            ctx.beginPath();
            ctx.moveTo(x - 85 * sizeScale, y - 70 * sizeScale + i * layerHeight);
            for (let px = 0; px <= 170 * sizeScale; px += 4) {
                const waveY = Math.sin((px + this.time * 2 + i * 20) * 0.1) * 5 * sizeScale;
                ctx.lineTo(x - 85 * sizeScale + px, y - 70 * sizeScale + i * layerHeight + waveY);
            }
            ctx.lineTo(x + 85 * sizeScale, y - 70 * sizeScale + (i + 1) * layerHeight);
            ctx.lineTo(x - 85 * sizeScale, y - 70 * sizeScale + (i + 1) * layerHeight);
            ctx.closePath();
            ctx.fillStyle = layerColors[i];
            ctx.fill();
        }

        // Soil particles
        for (let i = 0; i < 25; i++) {
            const px = x - 75 * sizeScale + Math.random() * 150 * sizeScale;
            const py = y - 60 * sizeScale + Math.random() * 145 * sizeScale;
            ctx.beginPath();
            ctx.arc(px, py, Math.max(1.5, 3 * scale), 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(150, 200, 255, 0.5)';
            ctx.fill();
        }
    }

    // Draw hazard curve visualization
    drawHazardCurve(ctx, x, y, size) {
        const scale = this.scale || 1;
        const sizeScale = size / 210;
        ctx.beginPath();
        ctx.moveTo(x - 85 * sizeScale, y - 75 * sizeScale);

        // Draw hazard curve (exponential decay)
        for (let i = 0; i <= 120; i++) {
            const t = i / 120;
            const curveX = x - 85 * sizeScale + t * 170 * sizeScale;
            const curveY = y - 75 * sizeScale + Math.pow(t, 0.5) * 125 * sizeScale + Math.sin(this.time * 0.05 + t * 5) * 5 * sizeScale;
            ctx.lineTo(curveX, curveY);
        }

        ctx.strokeStyle = 'rgba(100, 200, 255, 0.9)';
        ctx.lineWidth = Math.max(2, 3.5 * scale);
        ctx.stroke();

        // Fill under curve
        ctx.lineTo(x + 85 * sizeScale, y + 70 * sizeScale);
        ctx.lineTo(x - 85 * sizeScale, y + 70 * sizeScale);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 150, 255, 0.2)';
        ctx.fill();

        // Axes
        ctx.beginPath();
        ctx.moveTo(x - 88 * sizeScale, y + 75 * sizeScale);
        ctx.lineTo(x + 88 * sizeScale, y + 75 * sizeScale);
        ctx.moveTo(x - 88 * sizeScale, y + 75 * sizeScale);
        ctx.lineTo(x - 88 * sizeScale, y - 85 * sizeScale);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.stroke();
    }

    // Draw data flow from quadrants to neural network
    drawDataFlowToNetwork(startX, startY) {
        const ctx = this.ctx;
        const scale = this.scale || 1;
        const inputNodes = this.neuralNetwork.nodes[0];
        if (!inputNodes || inputNodes.length === 0) return;

        // Draw flowing particles from input visualization to neural network
        const particleRadius = 2 * scale;
        const particleCount = 4;

        inputNodes.forEach((node, i) => {
            for (let p = 0; p < particleCount; p++) {
                const t = ((this.time * 0.02 + p / particleCount + i * 0.1) % 1);
                const px = startX + (node.x - startX) * t;
                const py = startY + (node.y - startY) * t;

                ctx.beginPath();
                ctx.arc(px, py, particleRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 200, 255, ${1 - t * 0.7})`;
                ctx.fill();
            }

            // Connection line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = 'rgba(0, 150, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    // Draw accurate prediction output visualization
    drawOutputPrediction() {
        const ctx = this.ctx;
        const scale = this.scale || 1;
        const layout = this.layout;

        // 1024px 기준 크기
        const baseOuterRadius = 45;    // 1024px에서의 외부 반지름
        const baseInnerRadius = 32;    // 1024px에서의 내부 반지름

        // 스케일 적용
        const outerRadius = baseOuterRadius * scale;
        const innerRadius = baseInnerRadius * scale;

        // 위치 계산 - layout 시스템 사용
        // Output 영역의 왼쪽 1/3에 Accuracy 원 배치
        const centerX = layout.outputCenterX - layout.sectionWidth * 0.2;
        const centerY = layout.contentTop + layout.contentHeight * 0.45;
        const size = 80 * scale;

        // Outer ring with pulse
        const pulse = Math.sin(this.time * 0.05) * 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(50, 255, 150, 0.3)';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Progress arc (accuracy indicator)
        const accuracy = 0.95 + Math.sin(this.time * 0.02) * 0.03;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, -Math.PI / 2, -Math.PI / 2 + accuracy * Math.PI * 2);
        ctx.strokeStyle = 'rgba(50, 255, 150, 0.9)';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Inner circle background
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 50, 80, 0.8)';
        ctx.fill();

        // Accuracy percentage text - 1.5배 키움
        const mainFontSize = Math.min(42, Math.max(24, Math.round(30 * scale)));
        ctx.fillStyle = 'rgba(50, 255, 150, 1)';
        ctx.font = `bold ${mainFontSize}px Orbitron`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(accuracy * 100) + '%', centerX, centerY);

        // "Accuracy" label below the circle - 2배 키움
        const labelFontSize = Math.min(28, Math.max(20, Math.round(24 * scale)));
        ctx.fillStyle = 'rgba(50, 255, 150, 0.9)';
        ctx.font = `bold ${labelFontSize}px Orbitron`;
        ctx.fillText('Accuracy', centerX, centerY + outerRadius + 20 * scale);
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'left';

        // Draw data flow from neural network to output
        this.drawOutputFlowLines(centerX - size / 2, centerY);

        // Draw LLM text writing animation to the right
        // Output 영역의 오른쪽 부분에 LLM 박스 배치
        const llmBoxX = layout.outputCenterX + layout.sectionWidth * 0.15;
        const llmBoxY = centerY - 80 * scale;

        // 화면 오른쪽 경계 체크 후 그리기
        const boxWidth = 140 * scale;
        if (llmBoxX + boxWidth / 2 < this.canvas.width - 10) {
            this.drawLLMTextAnimation(llmBoxX, llmBoxY, scale);
        }
    }

    // Draw LLM-style text writing animation
    drawLLMTextAnimation(centerX, startY, scale) {
        const ctx = this.ctx;
        scale = scale || this.scale || 1;
        const lines = [
            'Analyzing seismic data...',
            'Processing ground response...',
            'Computing structural safety...',
            'Evaluating soil properties...',
            'Running ML prediction...',
            'Validating results...',
            'Optimizing parameters...',
            'Generating report...'
        ];

        // Calculate which line and character to show
        const cycleTime = 500; // frames per full cycle
        const lineTime = cycleTime / lines.length;
        const timeInCycle = this.time % cycleTime;
        const currentLineIndex = Math.floor(timeInCycle / lineTime);
        const timeInLine = timeInCycle % lineTime;

        // 1024px 기준 크기
        const baseBoxWidth = 140;
        const baseBoxHeight = 160;

        // Text box background - 스케일 적용
        const boxWidth = baseBoxWidth * scale;
        const boxHeight = baseBoxHeight * scale;
        ctx.fillStyle = 'rgba(0, 40, 70, 0.7)';
        ctx.strokeStyle = 'rgba(0, 191, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(centerX - boxWidth / 2, startY, boxWidth, boxHeight, 10);
        ctx.fill();
        ctx.stroke();

        // Draw text lines - 글자 크기를 박스에 맞게 조정
        // 살짝 키움
        const fontSize = Math.min(16, Math.max(11, Math.round(12 * scale)));
        ctx.font = `${fontSize}px Roboto`;
        ctx.textAlign = 'left';
        const lineHeight = Math.min(22, Math.max(16, 18 * scale));
        // 텍스트 시작 위치 - 박스 내부에 여백을 두고 시작
        const textStartX = centerX - boxWidth / 2 + 12;
        const textStartY = startY + 22;

        for (let i = 0; i <= currentLineIndex && i < lines.length; i++) {
            const line = lines[i];
            let displayText = line;

            if (i === currentLineIndex) {
                // Animate current line character by character
                const charsToShow = Math.floor((timeInLine / lineTime) * (line.length + 10));
                displayText = line.substring(0, Math.min(charsToShow, line.length));

                // Blinking cursor
                if (Math.floor(this.time / 15) % 2 === 0 && charsToShow <= line.length) {
                    displayText += '|';
                }
                ctx.fillStyle = 'rgba(0, 255, 200, 1)';
            } else {
                ctx.fillStyle = 'rgba(150, 200, 230, 0.8)';
            }

            ctx.fillText(displayText, textStartX, textStartY + i * lineHeight);
        }

        // Small AI icon - responsive
        const aiFontSize = Math.max(9, Math.round(14 * scale));
        ctx.fillStyle = 'rgba(0, 191, 255, 0.9)';
        ctx.font = `bold ${aiFontSize}px Orbitron`;
        ctx.textAlign = 'right';
        ctx.fillText('AI', centerX + boxWidth / 2 - 10 * scale, startY + boxHeight - 10 * scale);
        ctx.textAlign = 'left';
    }

    // Draw flow lines from neural network output to prediction
    drawOutputFlowLines(endX, endY) {
        const ctx = this.ctx;
        const scale = this.scale || 1;
        const outputNodes = this.neuralNetwork.nodes[this.neuralNetwork.nodes.length - 1];
        if (!outputNodes || outputNodes.length === 0) return;

        const particleRadius = 2 * scale;
        const particleCount = 4;

        outputNodes.forEach((node, i) => {
            for (let p = 0; p < particleCount; p++) {
                const t = ((this.time * 0.02 + p / particleCount + i * 0.1) % 1);
                const px = node.x + (endX - node.x) * t;
                const py = node.y + (endY - node.y) * t;

                ctx.beginPath();
                ctx.arc(px, py, particleRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(50, 255, 150, ${1 - t * 0.7})`;
                ctx.fill();
            }

            // Connection line
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'rgba(50, 255, 150, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    // Create soil particles
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            const y = this.canvas.height * 0.65 + Math.random() * (this.canvas.height * 0.35);
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: y,
                baseY: y,
                radius: Math.random() * 2 + 0.5,
                color: this.getParticleColor(y),
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    getParticleColor(y) {
        const ratio = (y - this.canvas.height * 0.65) / (this.canvas.height * 0.35);
        const brightness = 150 - ratio * 50;
        return `rgba(${brightness}, ${brightness + 30}, ${brightness + 60}, ${0.4 + Math.random() * 0.3})`;
    }

    // Draw soil layers with wave effect
    drawSoilLayers() {
        for (let i = 0; i < this.soilLayers.length; i++) {
            const layer = this.soilLayers[i];
            const prevY = i === 0 ? this.canvas.height * 0.65 : this.soilLayers[i - 1].y;

            this.ctx.beginPath();
            this.ctx.moveTo(0, prevY);

            // Create wavy top edge
            for (let x = 0; x <= this.canvas.width; x += 20) {
                const waveY = prevY + Math.sin((x + this.time * 30) * 0.01) * 3;
                this.ctx.lineTo(x, waveY);
            }

            this.ctx.lineTo(this.canvas.width, layer.y);
            this.ctx.lineTo(0, layer.y);
            this.ctx.closePath();

            this.ctx.fillStyle = layer.color;
            this.ctx.fill();
        }
    }

    // Draw seismic waves propagating through soil
    drawSeismicWaves() {
        // Generate new wave periodically
        if (Math.random() < 0.02) {
            this.seismicWaves.push({
                x: 0,
                y: this.canvas.height * 0.82,
                amplitude: 15 + Math.random() * 10,
                wavelength: 80 + Math.random() * 40,
                speed: 3 + Math.random() * 2,
                opacity: 1
            });
        }

        // Draw and update waves
        this.seismicWaves.forEach((wave, index) => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(0, 200, 255, ${wave.opacity * 0.6})`;
            this.ctx.lineWidth = 2;

            for (let i = 0; i < wave.x; i += 5) {
                const waveY = wave.y + Math.sin((i - wave.x) / wave.wavelength * Math.PI * 2) * wave.amplitude;
                if (i === 0) {
                    this.ctx.moveTo(i, waveY);
                } else {
                    this.ctx.lineTo(i, waveY);
                }
            }
            this.ctx.stroke();

            // Update wave position
            wave.x += wave.speed;
            wave.opacity -= 0.002;

            // Remove faded waves
            if (wave.opacity <= 0 || wave.x > this.canvas.width + 100) {
                this.seismicWaves.splice(index, 1);
            }
        });
    }

    // Draw buildings with seismic sway effect
    drawBuildings() {
        this.buildings.forEach(building => {
            // Calculate sway based on seismic activity - increased sway amount
            building.sway = Math.sin(this.time * building.swaySpeed) * 8;

            this.ctx.save();
            this.ctx.translate(building.x + building.width / 2, building.y + building.height);

            // Apply sway transformation
            this.ctx.transform(1, 0, building.sway / building.height, 1, 0, 0);
            this.ctx.translate(-(building.x + building.width / 2), -(building.y + building.height));

            // Building body
            const gradient = this.ctx.createLinearGradient(building.x, building.y, building.x + building.width, building.y);
            gradient.addColorStop(0, 'rgba(100, 150, 200, 0.7)');
            gradient.addColorStop(1, 'rgba(70, 120, 170, 0.7)');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(building.x, building.y, building.width, building.height);

            // Windows
            this.ctx.fillStyle = 'rgba(200, 230, 255, 0.5)';
            const windowRows = Math.floor(building.height / 20);
            const windowCols = Math.floor(building.width / 15);

            for (let row = 0; row < windowRows; row++) {
                for (let col = 0; col < windowCols; col++) {
                    const wx = building.x + 5 + col * 15;
                    const wy = building.y + 10 + row * 20;
                    this.ctx.fillRect(wx, wy, 8, 12);
                }
            }

            // Building outline
            this.ctx.strokeStyle = 'rgba(150, 200, 255, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(building.x, building.y, building.width, building.height);

            this.ctx.restore();
        });
    }

    // Draw underground tunnels
    drawTunnels() {
        this.tunnels.forEach(tunnel => {
            if (tunnel.type === 'circular') {
                // Circular tunnel (shield tunnel)
                this.ctx.beginPath();
                this.ctx.arc(tunnel.x, tunnel.y, tunnel.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(30, 50, 80, 0.9)';
                this.ctx.fill();

                // Tunnel lining
                this.ctx.beginPath();
                this.ctx.arc(tunnel.x, tunnel.y, tunnel.radius - 5, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(100, 150, 200, 0.8)';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();

                // Inner space
                this.ctx.beginPath();
                this.ctx.arc(tunnel.x, tunnel.y, tunnel.radius - 8, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(20, 40, 70, 0.95)';
                this.ctx.fill();

                // Segment lines
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(
                        tunnel.x + Math.cos(angle) * (tunnel.radius - 8),
                        tunnel.y + Math.sin(angle) * (tunnel.radius - 8)
                    );
                    this.ctx.lineTo(
                        tunnel.x + Math.cos(angle) * tunnel.radius,
                        tunnel.y + Math.sin(angle) * tunnel.radius
                    );
                    this.ctx.strokeStyle = 'rgba(80, 130, 180, 0.6)';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            } else {
                // Box tunnel (cut and cover)
                this.ctx.fillStyle = 'rgba(30, 50, 80, 0.9)';
                this.ctx.fillRect(tunnel.x - tunnel.width/2, tunnel.y - tunnel.height/2, tunnel.width, tunnel.height);

                // Walls
                this.ctx.strokeStyle = 'rgba(100, 150, 200, 0.8)';
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(tunnel.x - tunnel.width/2, tunnel.y - tunnel.height/2, tunnel.width, tunnel.height);

                // Inner space
                this.ctx.fillStyle = 'rgba(20, 40, 70, 0.95)';
                this.ctx.fillRect(tunnel.x - tunnel.width/2 + 5, tunnel.y - tunnel.height/2 + 5, tunnel.width - 10, tunnel.height - 10);
            }
        });
    }

    // Draw soil particles
    drawParticles() {
        this.particles.forEach(particle => {
            // Apply wave motion to particles
            const waveOffset = Math.sin(this.time * 0.05 + particle.phase) * 2;
            const drawY = particle.baseY + waveOffset;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, drawY, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
    }

    // Draw grid lines (like FEM mesh)
    drawMeshGrid() {
        this.ctx.strokeStyle = 'rgba(0, 150, 255, 0.08)';
        this.ctx.lineWidth = 1;

        const gridSize = 50;
        const startY = this.canvas.height * 0.65;

        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = startY; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    // Draw data visualization elements
    drawDataVisualization() {
        // Accelerometer readings simulation
        const centerX = this.canvas.width - 100;
        const centerY = 100;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Moving indicator
        const indicatorX = centerX + Math.sin(this.time * 0.1) * 20;
        const indicatorY = centerY + Math.cos(this.time * 0.15) * 15;

        this.ctx.beginPath();
        this.ctx.arc(indicatorX, indicatorY, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 255, 200, 0.8)';
        this.ctx.fill();

        // Cross hair
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 40, centerY);
        this.ctx.lineTo(centerX + 40, centerY);
        this.ctx.moveTo(centerX, centerY - 40);
        this.ctx.lineTo(centerX, centerY + 40);
        this.ctx.strokeStyle = 'rgba(0, 200, 255, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    // Draw mouse interaction effect (soil displacement)
    drawMouseEffect() {
        if (this.mouse.x && this.mouse.y && this.mouse.y > this.canvas.height * 0.65) {
            // Displacement circles
            for (let r = 20; r < 100; r += 20) {
                this.ctx.beginPath();
                this.ctx.arc(this.mouse.x, this.mouse.y, r, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(0, 200, 255, ${0.3 - r * 0.003})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }

            // Displacement arrows
            const arrowCount = 8;
            for (let i = 0; i < arrowCount; i++) {
                const angle = (i / arrowCount) * Math.PI * 2;
                const length = 30 + Math.sin(this.time * 0.1) * 10;

                this.ctx.beginPath();
                this.ctx.moveTo(
                    this.mouse.x + Math.cos(angle) * 20,
                    this.mouse.y + Math.sin(angle) * 20
                );
                this.ctx.lineTo(
                    this.mouse.x + Math.cos(angle) * length,
                    this.mouse.y + Math.sin(angle) * length
                );
                this.ctx.strokeStyle = 'rgba(0, 200, 255, 0.4)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background gradient
        const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        bgGradient.addColorStop(0, 'rgba(10, 22, 40, 1)');
        bgGradient.addColorStop(0.65, 'rgba(15, 30, 50, 1)');
        bgGradient.addColorStop(1, 'rgba(5, 15, 30, 1)');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all elements
        this.drawMeshGrid();
        this.drawSoilLayers();
        this.drawParticles();
        this.drawSeismicWaves();
        this.drawTunnels();
        this.drawBuildings();
        this.drawNeuralNetwork();
        this.drawMouseEffect();

        this.time++;
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // 전체 재초기화
                this.resize();
                this.createSoilLayers();
                this.createBuildings();
                this.createTunnels();
                this.createNeuralNetwork();
                this.particles = [];
                this.createParticles();
            }, 150);
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// Initialize geotechnical animation
const networkCanvas = document.getElementById('networkCanvas');
if (networkCanvas) {
    new GeotechnicalAnimation(networkCanvas);
}

// Fetch and display Google Scholar data from JSON
async function loadScholarData() {
    // Default fallback data
    let data = {
        citations: 5890,
        hIndex: 31,
        lastUpdated: new Date().toISOString()
    };

    try {
        const response = await fetch('scholar-data.json');
        if (response.ok) {
            data = await response.json();
        }
    } catch (error) {
        console.log('Using default scholar data (local file access)');
    }

    // Update data-target attributes with live data
    const citationsEl = document.querySelector('.scholar-stat-number[data-target]');
    const hIndexEl = document.querySelectorAll('.scholar-stat-number')[1];

    if (citationsEl && data.citations) {
        citationsEl.setAttribute('data-target', data.citations);
    }
    if (hIndexEl && data.hIndex) {
        hIndexEl.setAttribute('data-target', data.hIndex);
    }

    // Update last updated text if element exists
    const lastUpdatedEl = document.querySelector('.scholar-last-updated');
    if (lastUpdatedEl && data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        lastUpdatedEl.textContent = `Last updated: ${date.toLocaleDateString('ko-KR')}`;
    }

    // Trigger animation
    animateScholarStats();
}

// Animate scholar stats on professor page
function animateScholarStats() {
    const scholarStatNumbers = document.querySelectorAll('.scholar-stat-number');
    if (scholarStatNumbers.length > 0) {
        const scholarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scholarStatNumbers.forEach(number => {
                        const target = parseInt(number.getAttribute('data-target'));
                        const duration = 2000;
                        const increment = target / (duration / 16);
                        let current = 0;

                        const updateNumber = () => {
                            current += increment;
                            if (current < target) {
                                number.textContent = Math.floor(current).toLocaleString();
                                requestAnimationFrame(updateNumber);
                            } else {
                                number.textContent = target.toLocaleString();
                            }
                        };

                        updateNumber();
                    });
                    scholarObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        scholarStatNumbers.forEach(el => scholarObserver.observe(el));
    }
}

// Load scholar data if on professor page
const scholarStatNumbers = document.querySelectorAll('.scholar-stat-number');
if (scholarStatNumbers.length > 0) {
    loadScholarData();
}

// Fade in animations on scroll
const observeElements = document.querySelectorAll('.stat-card, .research-highlight-card, .news-card, .member-card-new, .pub-item, .topic-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

observeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    fadeObserver.observe(el);
});
