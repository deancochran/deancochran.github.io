export async function handleError({ error, event }) {
    // you can capture the `error` and `event` from the client
    // but it only runs if the unexpected error comes from `+page.ts`
    // console.log(error)
  
    return {
      // don't show sensitive data to the user
      message: 'Yikes! 💩',
    }
  }
  