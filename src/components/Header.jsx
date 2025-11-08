import { useFrame, Canvas } from "@react-three/fiber";
// Import the LogOut icon
import { LogIn, Info, LogOut } from "lucide-react";
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

// 1. Accept `user` and `onLogout` as props
export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
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

            {/* 2. Add conditional logic */}
            {user ? (
              // User is LOGGED IN
              <>
                <span className="text-gray-700 text-sm hidden lg:inline">
                  Welcome,{" "}
                  <span className="font-semibold">{user.username}</span>
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Log Out</span>
                </button>
              </>
            ) : (
              // User is LOGGED OUT
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <LogIn size={18} />
                <span className="hidden md:inline">Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
