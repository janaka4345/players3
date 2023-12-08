import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights";
import { Physics } from "@react-three/rapier";
import Plane from "./Plane";
import Player from "./Player";
import { useKeyboard } from "./useKeyboard";
import { useMouseCapture } from "./useMouseCapture";
import Terrain from "./Terrain";
function getInput(keyboard, mouse) {
  // console.log("y");
  let [x, y, z] = [0, 0, 0];
  if (keyboard["s"]) z += 0.5;
  if (keyboard["w"]) z -= 0.5;
  if (keyboard["d"]) x += 0.5;
  if (keyboard["a"]) x -= 0.5;
  if (keyboard[" "]) y += 0.5;

  return {
    move: [x, y, z],
    look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight],
    running: keyboard["Shift"],
  };
}
export default function World() {
  const keyboard = useKeyboard();
  // const mouse = useMouseCapture();

  return (
    <>
      <OrbitControls makeDefault />
      <axesHelper args={[2]} />
      <color attach="background" args={["#000000"]} />
      <Lights />
      <Physics debug>
        {/* <Plane /> */}
        <Terrain />
        <Player walk={2} jump={2} input={() => getInput(keyboard, [0, 0])} />
      </Physics>
    </>
  );
}
