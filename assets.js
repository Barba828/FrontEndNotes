let num = 0
const app = window.document.getElementById('app')
app.addEventListener('click', () => {
  console.log(num)
  num += 1
  app.innerHTML = `num = ${num}`
})