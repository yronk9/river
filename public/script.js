let scene, camera, renderer, text;
let isSpinning = true;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00ff00);  // Set green background

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create text
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const geometry = new THREE.TextGeometry('brat', {
            font: font,
            size: 0.5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.005,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const material = new THREE.MeshPhongMaterial({ color: 0x000000 });  // Set text color to black
        text = new THREE.Mesh(geometry, material);

        // Center the text
        geometry.computeBoundingBox();
        const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        text.position.x = centerOffset;

        scene.add(text);

        // Add lighting
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 0, 10);
        scene.add(light);

        // Start animation
        animate();
    });

    // Add click event listener to the renderer's DOM element
    renderer.domElement.addEventListener('click', onTextClick);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate text
    if (text && isSpinning) {
        text.rotation.x += 0.01;
        text.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// Handle window resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onTextClick() {
    if (isSpinning) {
        isSpinning = false;
        blurAnimation().then(() => {
            showModal();
        });
    } else {
        isSpinning = true;
        hideModal();
    }
}

function blurAnimation() {
    return new Promise((resolve) => {
        let blur = 0;
        const blurInterval = setInterval(() => {
            blur += 0.1;
            if (blur >= 5) {
                clearInterval(blurInterval);
                resolve();
            }
            text.material.userData.blurRadius = blur;
            text.material.needsUpdate = true;
        }, 20);
    });
}

function showModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('active');
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

window.addEventListener('resize', onWindowResize, false);

// Initialize the scene
init();
