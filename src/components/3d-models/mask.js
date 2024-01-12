'use client';

import { useState, useEffect, useRef, useDeferredValue } from "react";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, OrbitControls, Box } from '@react-three/drei';

// To convert a GLTF file into a JSX Component
// https://github.com/pmndrs/gltfjsx

// function Model({ }) {
//     const modelRef = useRef();
//     const { scene } = useGLTF('/3d-models/basic_face_mask/scene.gltf');

//     useFrame((state) => {
//         const { mouseX, mouseY } = state.mouse;
//         modelRef.current.rotation.x = mouseY * Math.PI * 0.5;
//         modelRef.current.rotation.y = mouseX * Math.PI * 0.5;
//     });

//     return <primitive object={scene} ref={modelRef} position={[0, 0, 0]} scale={[1, 1, 1]} color="white" />;
// }


// function Rig() {
//     const { camera, mouse } = useThree()
//     const vec = new Vector3()

//     return useFrame(() => {
//         camera.position.lerp(vec.set(mouse.x, mouse.y, camera.position.z), 0.05)
//         camera.lookAt(0, 0, 0)
//     })
// }

function Model(props) {
    const { nodes, materials } = useGLTF('/3d-models/basic_face_mask/scene.gltf');

    const ref = useRef();
    // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // const [hovered, setHovered] = useState(false)

    useFrame(({ mouse, viewport }) => {
        const x = (mouse.x * viewport.width) / 2.5
        const y = (mouse.y * viewport.height) / 2.5
        ref.current.lookAt(x, y, 1)
        // ref.current.material.color.lerp(hovered ? lime : black, 0.05)
    })

    // const updateMousePosition = (ev) => {
    //     setMousePosition({ x: ev.clientX, y: ev.clientY });
    // };

    // useEffect(() => {
    //     window.addEventListener('mousemove', updateMousePosition);
    //     return () => {
    //         window.removeEventListener('mousemove', updateMousePosition);
    //     };
    // }, []);

    return (
        <group {...props} dispose={null}>
            <mesh
                ref={ref}
                position={[0, -3, 0]}
                geometry={nodes.face_mask__0.geometry}
                material={materials['Scene_-_Root']}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={3}
            />
        </group>
    );
};

const Mask = ({ }) => (
    <Canvas>
        <ambientLight intensity={1} />
        <directionalLight position={[0, 4, 4]} intensity={3} />
        {/* <spotLight position={[0,4,4]} intensity={3} /> */}
        {/* <pointLight position={[10, 10, 10]} /> */}
        {/* <Box position={[0, 0, 0]}>
            <meshStandardMaterial color="yellow" />
        </Box> */}
        <Model />
        <OrbitControls enableZoom={false} />
        {/* <Rig /> */}
    </Canvas>
);

export default Mask;
