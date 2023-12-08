import { useTexture } from "@react-three/drei";
import { HeightfieldCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import { PlaneGeometry } from "three";

export default function Terrain(params) {
  const texture = useTexture("./Heightmap.png");
  const heightFieldHeight = 10;
  const heightFieldWidth = 10;

  const { heightField, heightFieldGeometry } = useMemo(() => {
    const heightField = Array.from({
      length: heightFieldHeight * heightFieldWidth,
    }).map((_, index) => {
      return Math.random();
    });

    const heightFieldGeometry = new PlaneGeometry(
      heightFieldWidth,
      heightFieldHeight,
      heightFieldWidth - 1,
      heightFieldHeight - 1,
    );

    heightField.forEach((v, index) => {
      heightFieldGeometry.attributes.position.array[index * 3 + 2] = v;
    });
    heightFieldGeometry.scale(1, -1, 1);
    heightFieldGeometry.rotateX(-Math.PI / 2);
    heightFieldGeometry.rotateY(-Math.PI / 2);
    heightFieldGeometry.computeVertexNormals();
    return { heightField, heightFieldGeometry };
  }, []);
  // const rapier = useRapier();
  // let heights = [];
  // const verteces = planeRef.currrent.attributes.array;

  // console.log(verteces);

  // const positions = useMemo(() => {
  //   const geo = new PlaneGeometry(10, 10, 9, 9);
  //   const vertices = geo.attributes.position.array;
  //   for (var j = 0; j < vertices.length / 3; j++) {
  //     const height = Math.random() * 2;
  //     heights.push(height);
  //     geo.attributes.position.array[j * 3 + 2] = height;
  //   }
  //   return geo;
  // }, []);
  useEffect(() => {
    // console.log(texture);
    // console.log(positions);
    // console.log(heights);
    // for (let i = 0; i < 363 / 3; i++) {
    //   position[i * 3 + 0] = planeRef.current.attributes.position.array[i * 3];
    //   position[i * 3 + 1] = (Math.random() - 0.5) * 5;
    //   position[i * 3 + 2] =
    //     planeRef.current.attributes.position.array[i * 3 + 2];
    // }
    // console.log("bg", bufferGeometryRef.current);
    // console.log("ba", bufferAttributeRef.current);
    // console.log("pl", planeRef.current);
    // planeRef.current.attributes.position.array[5] = 10;
    // let example5 = rapier.rapier.ColliderDesc.heightfield(heights, 1);
    // let handle = rapier.world.createCollider(example5);
  }, []);
  return (
    <RigidBody type="fixed" colliders={false} position={[0, -1, 0]}>
      <mesh
        // rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        geometry={heightFieldGeometry}
      >
        <meshPhysicalMaterial color="yellowgreen" map={texture} side={2} />
      </mesh>
      <HeightfieldCollider
        args={[
          heightFieldWidth - 1,
          heightFieldHeight - 1,
          heightField,
          { x: heightFieldWidth, y: 1, z: heightFieldHeight },
        ]}
      />
    </RigidBody>
  );
}
