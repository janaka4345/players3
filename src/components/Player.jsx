import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, vec3 } from "@react-three/rapier";
import { useRef } from "react";
import { Raycaster, Quaternion, Vector3 } from "three";
import quaternionFromNormal from "three-quaternion-from-normal";
import { clamp, lerp } from "three/src/math/MathUtils";

export default function Player({
  walk = 3,
  jump = 4,
  input = () => ({ move: [0, 0, 0], look: [0, 0] }),
}) {
  console.log("renderd");
  const api = useRef(null);
  const mesh = useRef();
  const { scene, camera } = useThree();

  let phi = 0;
  let theta = 0;

  // declare reusable, non persistant variables, just dont need these being recreated every frame
  const speed = new Vector3(walk / 2, jump, walk);
  const offset = new Vector3(0, 0, 0);
  const gaze = new Quaternion();
  const yaw = new Quaternion();
  const pitch = new Quaternion();
  const cameraOffset = new Vector3(0, 3, 5);
  // const down = new Vector3(0, -1, 0);
  const yAxis = new Vector3(0, 1, 0);
  const xAxis = new Vector3(1, 0, 0);
  // const raycaster = new Raycaster(new Vector3(0, 0, 0), down, 0, 2);
  // const slope = new Vector3(0, 1, 0);
  const drag = new Vector3(0.85, 1, 0.85);

  const updateOrientation = ([x, y]) => {
    const cameraSpeed = 3;
    const step = 0.3;
    phi = lerp(phi, -x * cameraSpeed, step);
    theta = lerp(theta, -y * cameraSpeed, step);
    theta = clamp(theta, -Math.PI / 3, Math.PI / 3);

    yaw.setFromAxisAngle(yAxis, phi);
    pitch.setFromAxisAngle(xAxis, theta);
    gaze.multiplyQuaternions(yaw, pitch).normalize();
  };

  // const getSlope = (ground) => {
  //   slope.set(0, 1, 0);
  //   if (ground && ground.face) {
  //     slope.copy(ground.face.normal.normalize());
  //     slope.applyQuaternion(ground.object.quaternion);
  //   }
  //   return quaternionFromNormal(slope);
  // };

  useFrame(() => {
    // if (!api.current || !mesh.current) return;
    const velocity = vec3(api.current.linvel());
    const position = vec3(api.current.translation());
    const { move, look, running } = input();
    const moveVec = { x: move[0], y: move[1], z: move[2] };
    // console.log(api.current);
    updateOrientation(look);
    // // not ideal to filter here on every frame
    // const walkable = scene.children.filter(
    //   (o) => o.children[0]?.uuid !== mesh?.current?.uuid,
    // );
    // raycaster.set(position, down);
    // const ground = raycaster.intersectObjects(walkable)[0];
    // // only allow movement input on ground
    // if (ground) {
    offset
      .fromArray(move)
      .normalize()
      .multiply(running ? speed.clone().multiplyScalar(2.5) : speed)
      .applyQuaternion(yaw);
    // .applyQuaternion(getSlope(ground));
    const v = velocity.multiply(drag).add(moveVec);
    // const v = velocity.add(offset);
    api.current.setLinvel(v, true);
    // }
    camera.position.lerp(
      position.add(cameraOffset.clone().applyQuaternion(yaw)),
      0.25,
    );
    camera.quaternion.copy(gaze);
    // console.log(offset.fromArray(move));
    // console.log(vec3(0, 0, 0));
  });

  return (
    <RigidBody
      ref={api}
      colliders="hull"
      lockRotations
      position={[0, 20, 0]}
      friction={0}
      restitution={0}
    >
      <mesh ref={mesh} userData={{ tag: "player" }}>
        <meshStandardMaterial transparent opacity={1} />
        <capsuleGeometry />
      </mesh>
    </RigidBody>
  );
}
