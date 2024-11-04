<script lang="ts">
	import { FileUpload, Progress } from '@skeletonlabs/skeleton-svelte'
	import * as mobilenet from '@tensorflow-models/mobilenet'
	import * as tf from '@tensorflow/tfjs'
	
	// init a element for the model reference
	let imgEl: HTMLImageElement | undefined = $state();
	// init a variable for the model
	let model: mobilenet.MobileNet;

	// a variable to hold the loading state
	let predictionsLoading = $state(false);
	// a variable to hold the predictions
	let predictions: any[] = $state([]);

	// function to load the pretrained MobileNet model
	const loadModel = async () => {
		const version = 2;
		const alpha = 0.5;
		model = await mobilenet.load({ version, alpha });
	};

	// handle file uploads from a custom component
	async function handleImageChange(details: any): Promise<void> {
		predictions = [];
		const reader = new FileReader();
		reader.onload = async (event) => {
			
			if (!imgEl) {throw new Error('imgEl is undefined')}
			imgEl.src = reader.result as string;
			imgEl.hidden = false;
		};
		reader.readAsDataURL(details.acceptedFiles[0]);
	}
	// handle preprocessing and classifying the device's selected image
	async function predict() {
		if (!imgEl) {throw new Error('imgEl is undefined')}
		predictionsLoading = true;
		// image -> 3D tensor  (height, width, color channels)
		const imageTensor = tf.browser.fromPixels(imgEl);
		// reshape tensor for bilinear polarization
		const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
		// using the model and classify the reshaped tensor
		predictions = await model.classify(resizedImageTensor);
		predictionsLoading = false;
	}
</script>

{#await loadModel()}
	<div class="flex w-full flex-col gap-4">
		<h3 class="h3">Image Classifier</h3>
		<Progress value={null} />
	</div>
{:then _}
	<section class="flex flex-col items-center justify-center gap-8 align-middle">
		<div class="flex w-full flex-col gap-4">
			<h3 class="h3">Image Classifier</h3>
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
		<img bind:this={imgEl} hidden onload={predict} width="300" height="300" alt="" />
			<div
			class="border-surface-200t-800 card w-full p-4 text-center preset-tonal"
			>
				
				{#if predictionsLoading}
					
					<h4 class="h4">Predictions:</h4>
					<div class="flex flex-col gap-2">
						<span>Loading...</span>
					</div>
				{:else}
					<h4 class="h4">Predictions:</h4>
					<div class="flex flex-col gap-2">
						{#each predictions as prediction}
							<span>{prediction.className}: {Math.round(100 * prediction.probability)}%</span>
						{/each}
					</div>
				{/if}
			</div>
	</section>
{/await}
