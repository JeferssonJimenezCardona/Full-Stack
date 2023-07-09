//Let:Declarar variable en bloque, es decir, solo estara disponible en el bloque que lo declaro.
//----------------------------------------------------------------
//Paso1:Crear Iconos de Usuario
import bot from './assets/user.svg';
import user  from './assets/bog.svg';
//----------------------------------------------------------------
//Paso2:Estas dos líneas de código son para seleccionar elementos HTML en el documento
const form=document.querySelector('form'); // selecciona el primer elemento 'form' que encuentra en el documento y lo guarda en la variable 'form'
const chatcontainer=document.querySelector('#chatcontainer'); //selecciona el elemento con el id 'chatcontainer' y lo guarda en la variable 'chatcontainer'.
//----------------------------------------------------------------
//Paso3:La función loader es una función que muestra un efecto de carga en un elemento HTML.
let loadInterval;
function loader(element){ //que es el elemento HTML en el que se mostrará el efecto de carga
  element.textContent =''; //se establece el contenido del elemento a una cadena vacía utilizando
  loadInterval = setInterval(()=>{ // se utiliza setInterval para ejecutar una función cada 300 milisegundos.
    element.textContent += '.'; //Se restablece a una cadena vacía utilizando element.textContent = ''.
    if(element.textContent === '....'){ //se restablece a una cadena vacía utilizando element.textContent = ''.
      element.textContent = '';
    }
  }, 300)
}
//----------------------------------------------------------------
//Paso4:simula la escritura de texto en un elemento HTML al agregar gradualmente los caracteres del texto uno por uno en intervalos de 20 milisegundos. Una vez que se ha escrito todo el texto, el intervalo se detiene.
function typeText(element,text){
  let index = 0;
  let interval =setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    } else{
      clearInterval(interval);
    }
  },20)
}
//----------------------------------------------------------------
//Paso5:es una función que genera un identificador único utilizando la marca de tiempo actual y un número aleatorio
function generateUniqueId(){
  const timestamp =Date.now();
  const randomNumber =Math.random();
  const hexadecimalString=randomNumber.toString(16);
  return 'id-${timestamp}-${hexadecimalString}';
}
//----------------------------------------------------------------
//Paso6:es una función que genera una cadena de texto que representa un mensaje de chat.
//Esta función es útil para generar el HTML necesario para mostrar mensajes de chat en una interfaz de usuario.
function chatStripe(isAi, value, uniqueId) {
  return (
      `
      <div class="wrapper ${isAi && 'ai'}"> 
          <div class="chat">
              <div class="profile">
                  <img 
                    src=${isAi ? bot : user} 
                    alt="${isAi ? 'bot' : 'user'}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `
  )
}
//----------------------------------------------------------------
//Paso7:
//es una función asíncrona que se utiliza para manejar el envío de un formulario
const handleSubmit = async (e) => {
  e.preventDefault() //para evitar que el formulario se envíe de forma predeterminada, lo que permite controlar el envío del formulario mediante JavaScript.
  const data = new FormData(form) //se puede utilizar para realizar diversas operaciones, como enviar los datos del formulario a un servidor utilizando una solicitud HTTP o manipular los datos antes de enviarlos.

  // esta línea de código agrega un nuevo mensaje de chat al contenedor de chat en la interfaz de usuario utilizando el contenido HTML generado por la función chatStripe.
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  // se utiliza para restablecer los campos de un formulario a sus valores predeterminados.
  form.reset()

  // Este identificador se utilizará para identificar el mensaje de chat en el DOM.
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  // El mensaje de chat se agrega al contenido HTML existente en el contenedor utilizando +=.
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Esto se logra estableciendo la propiedad scrollTop del contenedor en el valor de scrollHeight, que representa la altura total del contenido desplazable.
  const messageDiv = document.getElementById(uniqueId)

  // Esta función muestra un efecto de carga en el elemento
  loader(messageDiv)

  //utiliza la función fetch para realizar una solicitud HTTP a una URL específica.
  const response = await fetch('https://localhost:5000/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', //Esto indica que el cuerpo de la solicitud se enviará en formato JSON.
      },
      body: JSON.stringify({
          prompt: data.get('prompt')
      })
  })

  //se utilizan para detener un intervalo de tiempo y borrar el contenido de un elemento del DOM.
  clearInterval(loadInterval)
  messageDiv.innerHTML = " "

  //este código maneja la respuesta de la solicitud HTTP y realiza diferentes acciones dependiendo de si la respuesta fue exitosa o no
  if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

      typeText(messageDiv, parsedData)
  }   else {
      const err = await response.text()

      messageDiv.innerHTML = "Something went wrong"
      alert(err)
  }
}
//estas líneas de código agregan event listeners al formulario para manejar el envío del formulario tanto al hacer clic en el botón de enviar como al pulsar la tecla Enter
form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) { //Dentro de la función de callback, se verifica si el código de la tecla (e.keyCode) es igual a 13, que es el código de la tecla Enter
      handleSubmit(e)
  }
})
