import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Set background color to white
    renderer.setClearColor(0xffffff);

    // Load STL model
    const loader = new STLLoader();
    loader.load('c.stl', (geometry) => {
      const color = new THREE.Color(0xff0000); // Red color
      const material = new THREE.MeshStandardMaterial({ color }); // Use MeshStandardMaterial
      const mesh = new THREE.Mesh(geometry, material);

      // Compute the center of the model's bounding box
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);

      // Move the model to be centered at (0, 0, 0)
      mesh.position.sub(center);

      scene.add(mesh);
    });

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      // Rotate the model
      scene.rotation.x += 0.001;
      scene.rotation.y += 0.001;

      controls.update();

      render();

      stats.update();
    }

    function render() {
      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default App;
