// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
    interface MdsvexFile {
        default: SvelteComponent
        metadata: unknown
    }

    interface BlogPost {
        title: string
        image: string
        description: string
        date: string
        published: boolean
    }
}

export {}
