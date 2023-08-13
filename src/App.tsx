import { useMemo, useRef, useState } from 'react'
import { Mesh, Vector3 } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewport, Sky, Environment } from "@react-three/drei";
import './App.css'

const CustomBox = (
  {
    position = [0, 0, 0],
    color = 'hotpink',
    castShadow = true,
  }:
  {
    position?: [number, number, number] | Vector3,
    color?: string,
    castShadow?: boolean,
  }
) => {
  const ref = useRef<Mesh>(null);
  // [number, number, number] => Vector3を変換
  const pos = useMemo(() => {
    if (Array.isArray(position)) {
      return new Vector3(...position)
    }
    return position
  }, [position])
  const [initPos, setInitPos] = useState<Vector3>(pos);

  useFrame((state, _) => {
    if (ref.current){
      const time = state.clock.getElapsedTime();
      ref.current.position.x = Math.sin(time);
    }
  })

  return (
    <mesh
      ref={ref}
      position={initPos}
      onClick={(e) => {
        setInitPos(
          // 現在座標にY方向に1を足して更新
          initPos.clone().add(new Vector3(0, 1, 0))
        )
      }}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}



function App() {
  return (
    <Canvas 
      shadows
      camera={{
        position: [3, 2, 5],
        fov: 75,
        near: 0.1,
        far: 1000
      }}
    >
      <color attach="background" args={['#c2c2c2']} />
      <ambientLight intensity={0.5} />
      <pointLight 
        position={[-2, 3, -2]} 
        intensity={10}
        color={'#ffffe0'}
        castShadow
      />
      <CustomBox position={[0, 1, 0]} />
      <CustomBox position={[0, -1, 0]} color="orange" />
      <mesh
        castShadow
      >
        <capsuleGeometry args={[0.5, 0.25, 32, 20]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <mesh 
        rotation={[-Math.PI/2, 0, 0]}
        position={[0, -1.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#e2e2e2" roughness={0.25} metalness={0.65} />
      </mesh>
      <Environment preset='city' blur={0.5} background />
      <OrbitControls />
      <GizmoHelper>
        <GizmoViewport 
          labelColor="white" 
        />
      </GizmoHelper>
    </Canvas>
  )
}

export default App
