import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights";
import { Physics } from "@react-three/rapier";
import Plane from "./Plane";
import Player from "./Player";
import { useKeyboard } from "./useKeyboard";
import { useMouseCapture } from "./useMouseCapture";
function getInput(keyboard, mouse) {
  // console.log("y");
  let [x, y, z] = [0, 0, 0];
  if (keyboard["s"]) z += 1.0;
  if (keyboard["w"]) z -= 1.0;
  if (keyboard["d"]) x += 1.0;
  if (keyboard["a"]) x -= 1.0;
  if (keyboard[" "]) y += 1.0;

  return {
    move: [x, y, z],
    look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight],
    running: keyboard["Shift"],
  };
}
export default function World() {
  const keyboard = useKeyboard();
  const mouse = useMouseCapture();

  return (
    <>
      <OrbitControls makeDefault />
      <axesHelper args={[2]} />
      <color attach="background" args={["#000000"]} />
      <Lights />
      <Physics>
        <Plane />
        <Player walk={5} jump={5} input={() => getInput(keyboard, mouse)} />
      </Physics>
    </>
  );
}
