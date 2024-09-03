<script>
	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { spring } from 'svelte/motion';

	interactivity();
	const scale = spring(1);

	let shouldRotate = false;
	let rotation = 0;
	useTask((delta) => {
		if (!shouldRotate) return;
		rotation += delta;
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[5, 5, 5]}
	on:create={(reference) => {
		console.log(reference);
		reference.ref.lookAt(0, 0, 0);
	}}
/>

<T.DirectionalLight position={[0, 10, 10]} />

<T.Mesh
	rotation.y={rotation}
	position.y={1}
	scale={$scale}
	on:pointerenter={() => {
		shouldRotate = true;
		scale.set(1.5);
	}}
	on:pointerleave={() => {
		shouldRotate = false;
		scale.set(1);
	}}
>
	<T.BoxGeometry attach="geometry" args={[1, 2, 1]} />
	<T.MeshBasicMaterial attach="material" color="hotpink" />
</T.Mesh>
