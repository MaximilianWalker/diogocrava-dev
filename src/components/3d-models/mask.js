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

function Model(props) {
    const { nodes, materials } = useGLTF('/3d-models/basic_face_mask/scene.gltf');

    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.face_mask__0.geometry}
                material={materials['Scene_-_Root']}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={10}
            />
        </group>
    );
};

const Mask = ({ }) => (
    <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {/* <Box position={[0, 0, 0]}>
            <meshStandardMaterial color="yellow" />
        </Box> */}
        <Model />
        <OrbitControls />
    </Canvas>
);

export default Mask;
