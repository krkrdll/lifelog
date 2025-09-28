import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const VIEWER_ELEMENT_ID = "viewer";

let camera, scene, renderer;

const init = () => {
    const container = document.querySelector(`#${VIEWER_ELEMENT_ID}`);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
    camera.position.set(0, 1.5, 2);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x404040);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    renderer = new THREE.WebGPURenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.addEventListener("change", render);

    window.addEventListener("resize", onWindowResize);
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
};

const render = () => {
    renderer.renderAsync(scene, camera);
}

const loadGLTF = (model) => {
    const loader = new GLTFLoader();
    loader.load("models/" + model, (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        render();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const model = urlParams.get("model");

    if (!model) {
        return;
    }

    init();
    loadGLTF(model);
});
