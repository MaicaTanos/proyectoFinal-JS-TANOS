document.querySelector("#login-form").addEventListener("submit", function(event) {
    event.preventDefault()
    const usuario = document.querySelector("#usuario").value.toLowerCase()
    const contraseña = document.querySelector("#password").value
    
    fetch('users.json')
    .then(response => response.json())
    .then(data => {
      const usuarios = data.usuarios
      let usuarioValido = false
      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].usuario === usuario && usuarios[i].contraseña === contraseña) {
          usuarioValido = true
          break;
        }
      }
      
      if (usuarioValido) {
       window.location.href = "./pages/eventos.html"
      } else {
        document.querySelector("#error").innerText = "Datos invalidos, intente nuevamente por favor"
      }
    })
    .catch(error => {
      console.error('Error al cargar', error);
    })
})