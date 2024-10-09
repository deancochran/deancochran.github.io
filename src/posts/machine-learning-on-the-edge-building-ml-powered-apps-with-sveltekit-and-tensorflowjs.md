---
title: Machine Learning on the Edge Building ML powered Apps with SvelteKit and TensorFlowJS
slug: machine-learning-on-the-edge-building-ml-powered-apps-with-sveltekit-and-tensorflowjs
date: '2024-10-08'
image: /images/logo.png
description: Empowering mobile devices with Machine Learning has been a massive success lately. LLMs like ChatGPT are making headlines daily, and people everywhere are utilizing AI and Machine Learning with their mobile devices. For many, implementing machine learning on mobile applications is well beyond what the average user needs to know how to do in order to leverage the AI chat bot, image classifier, or recommendation system. However, in this guide I will be giving a guide and overview in what machine learning on the edge is, and how you can add it to your modern web application today.
published: false
---

## Contents

## Introduction

In this post I'll be covering a topic at the intersection of machine learning and edge computation, with a technical implementation guide using Sveltekit and TensorFlowJS. Since ML and AI started revolutionizing the way we analyze data and make decisions, enabling features like image recognition, natural language processing, and personalized recommendations.

## What is Machine Learning on the Edge

Not all machine learning applications demand heavy computational resources at the edge either. This is what allows us to use these powerful algorithms to run directly on mobile, camera, and other single board computer devices, rather than relying solely on remote cloud servers.

> "Machine learning, particularly deep learning, is computationally heavy and requires servers with GPUs because **it often involves processing massive datasets with complex algorithms, which can only be done efficiently through parallel processing capabilities offered by GPUs, allowing for significantly faster calculations compared to traditional CPUs**; essentially, GPUs can handle many computations simultaneously, making them ideal for the demanding tasks of training and running machine learning models" - [Emmanuel Ohiri](https://www.cudocompute.com/blog/gpu-servers-for-ai-everything-you-need-to-know)

While training and perfecting machine learning models requires significant computational power, especially with deep learning, usage of optimized models can successfully occur on edge devices.

### Mobile Edge Computation: Why it Matters

By using ML models on you're phone, we can achieve quicker responses, minimize reliance on internet connectivity, and improve privacy by keeping sensitive information on the device.

## Building a Machine Learning Mobile Edge App with SvelteKit and TensorFlow.js

I’ll guide you through a real-world example that demonstrates how to use the power of TensorFlow.js within a SvelteKit app to create a machine learning-powered mobile application. You'll get to see how these technologies work together to deliver cutting-edge functionality right in your pocket!.

#### Introducing TensorFlow.js for Mobile Edge Applications

[TensorFlow.js](https://www.tensorflow.org/js) is an open-source library that enables developers to run machine learning models directly in the browser and on Node.js. It allows for seamless integration of ML capabilities into web apps, making it accessible for JavaScript developers. By performing computations on the client side, TensorFlow.js enhances mobile edge computation, reducing latency, improving user privacy, and enabling offline functionality. Its optimized performance makes it ideal for mobile devices.

#### Why SvelteKit? A Modern Approach to Building Web Apps

[SvelteKit](https://kit.svelte.dev/) is a modern framework for building fast, interactive web applications. By compiling components into optimized JavaScript, it offers excellent performance and minimal bundle sizes, making it a perfect fit for integrating TensorFlow.js. SvelteKit simplifies creating dynamic user interfaces, thanks to features like server-side rendering and built-in routing. Its reactivity model allows for real-time interactions, enabling developers to create sophisticated, ML-powered mobile apps with ease.

### Building an Image Classification Svelte component

The goal is to allow users to upload an image and classify it using a pre-trained machine learning model, like **[MobileNet](https://github.com/tensorflow/models/blob/master/research/slim/nets/mobilenet/README.md)**. We’ll leverage **SvelteKit** for the framework, style the component with **TailwindCSS**, and use TensorFlow.js for running the image classification model directly in the browser. This setup ensures fast, responsive, and lightweight image classification right from the user’s device.

**Note:** This guide won't cover setting up the routing or configuration for your SvelteKit application. If you're new to SvelteKit, refer to the official SvelteKit documentation for setup instructions.

#### 1. **Setting Up the Project**

If have never seen the MobileNet model in action, visit the [live demo](https://storage.googleapis.com/tfjs-models/demos/mobilenet/index.html) and view the console to see the results of the edge computations

- **Installing SvelteKit**: Instructions on initializing a new SvelteKit project can be found on the official documentation site [here](https://kit.svelte.dev/docs/introduction).
  - Head to **Skeleton UI** and follow their instructions on installing and initialization a svelte-kit application [here](https://www.skeleton.dev/docs/get-started)
- **Adding TensorFlow.js**: Installation of TensorFlow.js via npm.
  - Run `npm install @tensorflow/tfjs @tensorflow-models/mobilenet` .
  - Optionally, mention using a CDN for TensorFlow.js if the app will run directly in the browser.

#### 2. **Building the Image Classification Component**

After you've installed the necessary packages, you can then begin to setup the project to utilize machine learning on the edge. For each image you classify, you'll want to use the same Svelte component so that you don't have to rewrite / copy and paste code.

```ts
// $lib/components/ImageClassifier.svelte
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
// ...
// ...
```

#### 3. **Loading the Pre-Trained Model**

```ts
// $lib/components/ImageClassifier.svelte
// ...

// init a variable for the model
let model: mobilenet.MobileNet;

// function to load the pretrained MobileNet model
const loadModel = async () => {
	const version = 2;
	const alpha = 0.5;
	model = await mobilenet.load({ version, alpha });
	console.log('Model loaded successfully');
};
// ...
// ...
```

**Note:** The pre-trained model using `await mobilenet.load()` to asynchronously wait till the model has been successfully loaded until it proceeds

#### 4. **Handling Upload and Classification of the Image**

- **JavaScript for File Input Handling**:
  - Write a function to handle file uploads and convert the uploaded image into a format suitable for TensorFlow.js.
  - Use `FileReader` to read the image data and display the preview.

```ts
// $lib/components/ImageClassifier.svelte
// ...

// a variable to hold the predictions
let predictionsResult = [];

// a function handle an uploaded image
const predictionImage = async (imgDisplay: HTMLImageElement) => {
	const preprocessedImage = preprocessImage(imgDisplay);
	predictionsResult = await classifyImage(preprocessedImage);
};

// preprocessing the device's selected image
const preprocessImage = (imageElement: HTMLImageElement) => {
	// image -> 3D tensor  (height, width, color channels)
	const imageTensor = tf.browser.fromPixels(imageElement);
	// reshape tensor for bilinear polarization
	const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
	return resizedImageTensor;
};

// using the model and classify the image
const classifyImage = async (preprocessedImage: tf.Tensor3D) => {
	const predictions = await model.classify(preprocessedImage);
	return predictions;
};
```

#### 6. **Building the UI for Uploading an Image and viewing Classification Results**

- **Showing the Results in the UI**:
  - Bind the classification results (e.g., label and probability) to the component’s state.
  - Display the results in the result section of the component with basic styling for better readability.

```xml
<script lang="ts">
	// $lib/components/ImageClassifier.svelte
    // ...
    // import packages, load model, handle file uploads, classify image
    // ...
</script>

<section class="flex flex-col gap-8">
    <div class="ml-auto mr-auto block w-1/2">
        <Label class="pb-2 text-lg">Select an image to classify</Label>
        <CustomFileComponent
            {...fileuploadprops}
            bind:files
            on:change={handleImageChange}
        />
    </div>
    <CustomCardComponent
        size="md"
        padding="sm"
        class="ml-auto mr-auto "
    >
        <img
            hidden={!imgDisplay}
            src={imgDisplay}
            alt=""
            bind:this={imgtoprocess}
        />
        <div class="py-4">
            <Heading tag="h3">Predictions:</Heading>
            <List
                position="outside"
                class="p-4"
            >
                {#if predictionsLoading}
                    <span class="flex flex-col items-center"
                        ><Spinner color="blue" /></span
                    >
                {:else}
                    {#each predictionsResult as prediction}
                        <Li
                            >{prediction.className}: {Math.round(
                                prediction.probability * 100
                            )}%</Li
                        >
                    {/each}
                {/if}
            </List>
        </div>
    </Card>
</section>
```

## Conclusion

- Summarize the key takeaways, including the potential of using SvelteKit with TensorFlow.js for mobile edge computation.
- Encourage readers to experiment with their own mobile edge computation apps.

## Call to Action

- Invite readers to comment, share, or ask questions.
- Suggest further reading or resources for learning about TensorFlow.js, SvelteKit, or mobile edge computing.
