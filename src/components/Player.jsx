import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useRef } from "react";
import { Raycaster, Quaternion, Vector3 } from "three";
import quaternionFromNormal from "three-quaternion-from-normal";
import { clamp, lerp } from "three/src/math/MathUtils";
import Soldier from "./Soldier";

export default function Player({
  walk = 3,
  jump = 4,
  input = () => ({ move: [0, 0, 0], look: [0, 0] }),
}) {
  console.log("player renderd");
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
  const down = new Vector3(0, -1, 0);
  const yAxis = new Vector3(0, 1, 0);
  const xAxis = new Vector3(1, 0, 0);
  const raycaster = new Raycaster(new Vector3(0, 0, 0), down, 0, 2);
  const slope = new Vector3(0, 1, 0);
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
    // const moveVec = { x: move[0], y: move[1], z: move[2] };
    // console.log(api.current);
    updateOrientation(look);
    // console.log(yaw);
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
    const v = velocity.multiply(drag).add(offset);
    // const v = velocity.add(offset);
    api.current.setLinvel(v, true);
    mesh.current.setRotationFromQuaternion(yaw);
    // }
    camera.position.lerp(
      position.add(cameraOffset.clone().applyQuaternion(yaw)),
      0.25,
    );
    camera.quaternion.copy(gaze);
    // console.log(offset.fromArray(move));
    // console.log(new Vector3(5, 10, 2).normalize());
    // console.log(mesh.current);
  });

  return (
    <RigidBody
      ref={api}
      colliders={false}
      lockRotations
      position={[0, 2, 0]}
      friction={0}
      restitution={0}
      scale={0.5}
    >
      {/* <mesh ref={mesh} userData={{ tag: "player" }}>
        <meshStandardMaterial transparent opacity={1} />
        <boxGeometry args={[1, 1, 1]} />
      </mesh> */}
      <group ref={mesh}>
        <Soldier position={[0, -1, 0]} />
        <CapsuleCollider args={[0.5, 0.5]} />
      </group>
    </RigidBody>
  );
}
