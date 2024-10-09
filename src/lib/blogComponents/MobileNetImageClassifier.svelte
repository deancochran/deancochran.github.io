<script lang="ts">
	import { FileUpload, Progress } from '@skeletonlabs/skeleton-svelte';
	import * as mobilenet from '@tensorflow-models/mobilenet';
	import * as tf from '@tensorflow/tfjs';

	let imgEl: HTMLImageElement;

	// init a variable for the model
	let model: mobilenet.MobileNet;

	// a variable to hold the loading state
	let predictionsLoading = false;
	// a variable to hold the predictions
	let predictions: any[] = [];

	// function to load the pretrained MobileNet model
	const loadModel = async () => {
		const version = 2;
		const alpha = 0.5;
		model = await mobilenet.load({ version, alpha });
	};

	// handle file uploads from a custom component
	async function handleImageChange(details: any): Promise<void> {
		predictions = [];
		imgEl.src = '';
		const reader = new FileReader();
		reader.onload = async (event) => {
			// set the image as the src of an image element
		imgEl.src = reader.result as string;
		await imagePrediction(imgEl);
		};
		reader.readAsDataURL(details.acceptedFiles[0]);
		
	}

	// a function handle an uploaded image
	const imagePrediction = async (el: HTMLImageElement) => {
		predictionsLoading = true;
		// image -> 3D tensor  (height, width, color channels)
		const imageTensor = tf.browser.fromPixels(el);
		// reshape tensor for bilinear polarization
		const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
		// using the model and classify the reshaped tensor
		predictions = await model.classify(resizedImageTensor);
		predictionsLoading = false;
	};
</script>

{#await loadModel()}
	<Progress value={null} />
{:then _}
	<section class="flex flex-col gap-8">
		<div class="flex w-full flex-col gap-4">
			<p class="text-lg">Select an image</p>
			<FileUpload
				name="example"
				accept="image/*"
				maxFiles={1}
				maxFileSize={1024 * 1024 * 10}
				onFileChange={handleImageChange}
				classes="w-full"
				filesListClasses="hidden"
			/>
		</div>
		<img bind:this={imgEl} hidden={!imgEl?.src} width="300" height="300" alt="" />
		<div class="card w-full p-4 text-center border-surface-200-800 preset-filled-surface-100-900">
			<h4 class="h4">Predictions:</h4>
			<ul>
				{#if predictionsLoading}
					<li>Loading...</li>
				{:else}
					{#each predictions as prediction}
						<li>{prediction.className}: {Math.round(100 * prediction.probability)}%</li>
					{/each}
				{/if}
			</ul>
		</div>
	</section>
{/await}
