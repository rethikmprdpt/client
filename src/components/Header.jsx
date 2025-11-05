import { useFrame, Canvas } from "@react-three/fiber";
import { LogIn, Info } from "lucide-react";
import { useRef } from "react";

function RotatingLogo() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.4, 0.15, 64, 16]} />
      <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <Canvas camera={{ position: [0, 0, 2.5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <RotatingLogo />
              </Canvas>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Inventory Manager
            </h1>
          </div>

          <nav className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Info size={18} />
              <span className="hidden md:inline">About</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <LogIn size={18} />
              <span className="hidden md:inline">Sign In</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
