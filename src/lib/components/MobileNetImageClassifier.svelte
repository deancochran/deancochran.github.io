<script lang="ts">
    import * as mobilenet from '@tensorflow-models/mobilenet'
    import * as tf from '@tensorflow/tfjs'

    // init a element for the model reference
    let imgEl: HTMLImageElement | undefined = $state()
    // init a variable for the model
    let model: mobilenet.MobileNet

    // a variable to hold the loading state
    let predictionsLoading = $state(false)
    // a variable to hold the predictions
    let predictions: any[] = $state([])

    // function to load the pretrained MobileNet model
    const loadModel = async () => {
        const version = 2
        const alpha = 0.5
        model = await mobilenet.load({ version, alpha })
    }

    // handle file uploads from a custom component
    async function handleImageChange(event: Event): Promise<void> {
        const input = event.currentTarget as HTMLInputElement
        const file = input.files?.[0]
        if (!file) return

        predictions = []
        const reader = new FileReader()
        reader.onload = async (event) => {
            if (!imgEl) {
                throw new Error('imgEl is undefined')
            }
            imgEl.src = reader.result as string
            imgEl.hidden = false
        }
        reader.readAsDataURL(file)
    }
    // handle preprocessing and classifying the device's selected image
    async function predict() {
        if (!imgEl) {
            throw new Error('imgEl is undefined')
        }
        predictionsLoading = true
        // image -> 3D tensor  (height, width, color channels)
        const imageTensor = tf.browser.fromPixels(imgEl)
        // reshape tensor for bilinear polarization
        const resizedImageTensor = tf.image.resizeBilinear(
            imageTensor,
            [224, 224]
        )
        // using the model and classify the reshaped tensor
        try {
            predictions = await model.classify(resizedImageTensor)
        } finally {
            imageTensor.dispose()
            resizedImageTensor.dispose()
            predictionsLoading = false
        }
    }
</script>

{#await loadModel()}
    <div class="not-prose ui-card my-8 flex w-full flex-col gap-4 p-5">
        <h3 class="font-semibold tracking-tight">Loading image classifier</h3>
        <progress aria-label="Loading image classifier"></progress>
    </div>
{:then _}
    <section
        class="not-prose ui-card my-8 flex flex-col items-center justify-center gap-6 p-5 sm:p-6"
    >
        <div class="w-full space-y-2">
            <h3 class="font-semibold tracking-tight">Image classifier</h3>
            <p class="ui-muted text-sm">
                Choose an image to classify locally in your browser.
            </p>
            <input
                class="ui-input h-auto file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                name="image"
                type="file"
                accept="image/*"
                onchange={handleImageChange}
            />
        </div>
        <img
            bind:this={imgEl}
            hidden
            onload={predict}
            width="300"
            height="300"
            alt=""
        />
        <div
            class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)] p-4 text-center"
        >
            {#if predictionsLoading}
                <h4 class="font-medium">Predictions</h4>
                <div class="flex flex-col gap-2">
                    <span>Loading...</span>
                </div>
            {:else}
                <h4 class="font-medium">Predictions</h4>
                <div class="flex flex-col gap-2">
                    {#each predictions as prediction}
                        <span
                            >{prediction.className}: {Math.round(
                                100 * prediction.probability
                            )}%</span
                        >
                    {/each}
                </div>
            {/if}
        </div>
    </section>
{/await}
