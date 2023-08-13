<script type="ts">
    export let title
    export let description
    export let date
    export let categories
    export let published
    export let img_url
</script>
<div id="content">
    <slot/>
</div>
<style lang="scss">
    #content :global(h1){
           @apply font-bold text-5xl pb-4; 
    }
    #content :global(h2){
           @apply font-bold text-4xl pb-4 ; 
    }
    #content :global(h3){
           @apply font-bold text-3xl pb-4 ; 
    }
    #content :global(h4){
           @apply font-bold text-2xl pb-4 ; 
    }
    #content :global(h5){
           @apply font-bold text-xl pb-4 ; 
    }

    #content :global(p){
        @apply text-xl pb-4 ; 
    } 
    #content :global(ul){
        @apply pb-4 ; 
    }  
    #content :global(ol){
        @apply pb-4 ; 
    }  
    #content :global(ol){
        @apply pb-4 ; 
    }  
    #content :global(pre){
        @apply my-4 mb-8 rounded-lg p-4 shadow-secondary-500 shadow-md overflow-auto hide-scrollbar; 
    }        
    #content :global(code){
        @apply text-primary-500; 
    } 
    #content :global(em){
        @apply w-full h-full flex p-12 text-center text-primary-500 align-middle; 
    } 
</style>	