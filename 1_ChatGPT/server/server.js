import express from 'express' //es un framework de Node.js para construir aplicaciones web.
import * as dotenv from 'dotenv' // se utiliza para cargar variables de entorno desde un archivo .env.
import cors from 'cors' // que se utiliza para habilitar el acceso a recursos de origen cruzado (CORS) en la aplicación.
import { Configuration, OpenAIApi } from 'openai' //Estas clases se utilizan para configurar y utilizar la API de OpenAI.

dotenv.config() //Carga las variables de entorno desde el archivo .env en el entorno de la aplicación.

console.log(process.env.OPENAI_API_KEY)

//Crea una instancia de la clase Configuration con la clave de API de OpenAI obtenida de las variables de entorno.
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

//Crea una instancia de la clase OpenAIApi utilizando la configuración creada anteriormente.
const openai = new OpenAIApi(configuration);

//Crea una instancia de la aplicación Express.
const app = express()
//Habilita el middleware cors para permitir solicitudes de origen cruzado en la aplicación.
app.use(cors())
app.use(express.json())

//Cuando se accede a esta ruta, se envía una respuesta con un estado 200 y un objeto JSON que contiene un mensaje de saludo.
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX JJC!'
  })
})

app.post('/', async (req, res) => { //Esta función maneja la solicitud y la respuesta.
  try {
    const prompt = req.body.prompt; //El cuerpo de la solicitud se espera que esté en formato JSON.
//Este método crea una solicitud de completado de texto utilizando los parámetros especificados, como el modelo, el texto de inicio (prompt), la temperatura, el número máximo de tokens, etc. El resultado se guarda en la variable response.
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Los valores más altos significan que el modelo asumirá más riesgos.
      max_tokens: 3000, // El número máximo de tokens a generar en la finalización. La mayoría de los modelos tienen una longitud de contexto de 2048 tokens (excepto los modelos más nuevos, que admiten 4096).
      top_p: 1, // alternativa al muestreo con temperatura, llamado muestreo de núcleo
      frequency_penalty: 0.5, // Número entre -2.0 y 2.0. Los valores positivos penalizan los tokens nuevos en función de su frecuencia existente en el texto hasta el momento, lo que reduce la probabilidad de que el modelo repita la misma línea palabra por palabra.
      presence_penalty: 0, // Número entre -2.0 y 2.0. Los valores positivos penalizan los nuevos tokens en función de si aparecen en el texto hasta el momento, lo que aumenta la probabilidad de que el modelo hable sobre nuevos temas.
    });

//Envía una respuesta con un estado 200 y un objeto JSON que contiene el texto generado por el modelo de OpenAI
    res.status(200).send({
      bot: response.data.choices[0].text
    });

//Si ocurre un error durante el procesamiento de la solicitud, se envía una respuesta con un estado 500 y el mensaje de error.
  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})
//Inicia el servidor Express en el puerto 5000 y muestra un mensaje en la consola indicando que el servidor se ha iniciado correctamente.
app.listen(5000, () => console.log('AI server started on http://localhost:5000'))

//En resumen, este código define una ruta POST en el servidor Express que recibe una solicitud con un campo 
//prompt, utiliza la API de OpenAI para generar una respuesta basada en el prompt y envía la
// respuesta generada como una respuesta JSON al cliente. También maneja errores y muestra mensajes 
//en la consola al iniciar el servidor.