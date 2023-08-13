export async function handle({ event, resolve }) {
    // if (event.url.pathname.startsWith('/banana')) {
    //     return new Response('🍌')
    //   }
    const route = event.url

    const start = performance.now()
    const response = await resolve(event)
    const end = performance.now()

    const responseTime = end - start

    if (responseTime > 2000) {
        console.log(`🐢 ${response.status} @ ${route} took ${responseTime.toFixed(2)} ms`)
    }

    if (responseTime < 1000) {
        console.log(`🚀 ${response.status} @ ${route} took ${responseTime.toFixed(2)} ms`)
    }

     // this cookie would be set inside a login route
    // const session = event.cookies.get('session')

    // you can get the user data from a database
    // const user = await getUser(session)
    // event.locals.user = user
    return response
  }
  