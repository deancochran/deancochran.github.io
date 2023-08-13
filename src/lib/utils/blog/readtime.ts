export async function readTime(pathname) {
    const res = await fetch(`/src/lib/blog/content/${pathname}.md`)
    const data = await res.text()
    const WPS = 275 / 60
  
    let images = 0
    const regex = /\w/
  
    const words = data.split(' ').filter((word) => {
      if (word.includes('<img')) {
        images += 1
      }
      return regex.test(word)
    }).length
  
    const imageAdjust = images * 4
    let imageSecs = 0
    let imageFactor = 12
  
    while (images) {
      imageSecs += imageFactor
      if (imageFactor > 3) {
        imageFactor -= 1
      }
      images -= 1
    }
  
    const minutes = Math.ceil(((words - imageAdjust) / WPS + imageSecs) / 60)
  
    return minutes
  }