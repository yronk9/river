let scene, camera, renderer, horse1, horse2, leftWing1, rightWing1, leftWing2, rightWing2;

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB); // Sky blue background

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 15;
            camera.position.y = 2;
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            horse1 = createHorse();
            horse2 = createHorse();
            horse2.position.z = -5; // Position the second horse behind the first one

            scene.add(horse1);
            scene.add(horse2);

            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            animate();
        }

        function createHorse() {
            const horse = new THREE.Group();
            const horseMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

            // Body
            const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
            const body = new THREE.Mesh(bodyGeometry, horseMaterial);
            body.rotation.z = Math.PI / 2;
            horse.add(body);

            // Neck
            const neckGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1, 8);
            const neck = new THREE.Mesh(neckGeometry, horseMaterial);
            neck.position.set(1, 0.5, 0);
            neck.rotation.z = -Math.PI / 4;
            horse.add(neck);

            // Head
            const headGeometry = new THREE.SphereGeometry(0.35, 8, 8);
            const head = new THREE.Mesh(headGeometry, horseMaterial);
            head.position.set(1.6, 0.9, 0);
            horse.add(head);

            // Snout
            const snoutGeometry = new THREE.BoxGeometry(0.5, 0.25, 0.3);
            const snout = new THREE.Mesh(snoutGeometry, horseMaterial);
            snout.position.set(1.9, 0.8, 0);
            horse.add(snout);

            // Legs
            const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2);
            for (let i = 0; i < 4; i++) {
                const leg = new THREE.Mesh(legGeometry, horseMaterial);
                leg.position.y = -1;
                leg.position.x = i < 2 ? 0.6 : -0.6;
                leg.position.z = i % 2 === 0 ? 0.3 : -0.3;
                horse.add(leg);
            }

            // Tail
            const tailGeometry = new THREE.CylinderGeometry(0.1, 0.02, 1.5, 8);
            const tail = new THREE.Mesh(tailGeometry, horseMaterial);
            tail.position.set(-1.2, -0.2, 0);
            tail.rotation.z = Math.PI / 3;
            horse.add(tail);

            // Wings (triangular shape facing back)
            const wingShape = new THREE.Shape();
            wingShape.moveTo(0, 0);
            wingShape.lineTo(1.5, 0);
            wingShape.lineTo(1.5, 1);
            wingShape.lineTo(0, 0);
            const wingGeometry = new THREE.ShapeGeometry(wingShape);
            const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });

            const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
            const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
            leftWing.position.set(-0.5, 0.5, 0.6);
            rightWing.position.set(-0.5, 0.5, -0.6);
            horse.add(leftWing, rightWing);

            // Store wing references
            horse.userData = { leftWing, rightWing };

            return horse;
        }

        function animate() {
            requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // Flap the wings up and down
            const wingAngle1 = Math.sin(time * 10) * Math.PI / 6;
            const wingAngle2 = Math.sin(time * 10 + Math.PI) * Math.PI / 6;

            horse1.userData.leftWing.rotation.x = wingAngle1;
            horse1.userData.rightWing.rotation.x = wingAngle1;
            horse2.userData.leftWing.rotation.x = wingAngle2;
            horse2.userData.rightWing.rotation.x = wingAngle2;

            // Move the horses up and down alternately
            horse1.position.y = Math.sin(time * 2) * 0.5;
            horse2.position.y = Math.sin(time * 2 + Math.PI) * 0.5;

            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize, false);
        init();