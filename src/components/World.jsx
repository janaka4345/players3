import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights";
import { Physics } from "@react-three/rapier";

export default function World() {
  return (
    <>
      <OrbitControls makeDefault />
      <axesHelper args={[2]} />
      <color attach="background" args={["#000000"]} />
      <Physics>
        <Lights />
      </Physics>
    </>
  );
}
