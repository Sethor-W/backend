export function template(code: string) {
  return ` <style amp4email-boilerplate>
    body {
      visibility: hidden;
    }
  </style>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script
    async
    custom-element="amp-anim"
    src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"
  ></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
      /* Estilos para el body */
      body {
          background-color: #2d323a !important;
          margin: 0; /* Evita el margen predeterminado del body */
          font-family: Arial, sans-serif; /* Establece una fuente de respaldo */
      }
      .body {
          background-color: #2d323a !important;
      }
      /* Estilos para el contenedor principal */
      .container-mail {
          width: 80%;
          margin: 0 auto;
          padding: 1.25rem;
          background-color: #f7f7f7;
          font-size: 1.125rem;
          color: #333;
      }

      /* Estilos para la imagen del logotipo */
      .logo {
          width: 20rem;
          display: block;
          margin: 0 auto 1rem;
      }

      /* Estilos para los párrafos */
      p {
          margin-bottom: 1rem;
      }

      /* Estilos para el enlace en el párrafo */
      p a {
          color: #47007d;
          text-decoration: underline;
      }
      .code {
          font-weight: 600;
      }

      /* Estilos para el footer */
      .footer {
          /* margin-top: 1.5rem; */
          background-image: url('https://res.cloudinary.com/dnnjctymr/image/upload/v1695413141/sethor/fondo-email-footer_e4rruu.png');
          background-repeat: no-repeat;
          background-size: cover;
          padding: 1.25rem; /* Agrega espacio de relleno */
          text-align: center; /* Centra el contenido en el footer */
          color: #47007d;
      }

      /* Estilos para el contenedor dentro del footer */
      .footer-container {
          background-color: rgba(255, 255, 255, 0.95) !important;
          border-radius: 10rem;
          padding: 2rem 2.5rem; 
          margin: 2.5rem auto;
          width: fit-content; 
          text-align: center;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
      }
      
      .footer-container-logo {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin-right: 3rem;
      }

      /* Estilos para el logotipo dentro del footer */
      .logo-footer {
          margin-right: 1rem;
          width: 3rem;
          display: inline-block;
          vertical-align: middle;
      }

      /* Estilos para el texto "Sethor" dentro del footer */
      .text-logo {
          font-weight: bold;
          font-size: 2rem; /* Ajusta el tamaño de fuente según tus necesidades */
      }

      /* Estilos para el texto en el footer */
      .text-footer {
          text-align: left;
          font-weight: 500;
          font-size: 0.875rem;
      }

      /* Estilos para el texto de contacto en el footer */
      .text-footer p {
          margin: 0.25rem 0;
      }

      div.url {
          margin-top: -2rem;
          background: rgba(0, 0, 0, 0.2);
      }
      a.url, div.url {
          border-radius: 12px;
          padding: .5rem;
          color: #f7f7f7;
          font-size: medium;
      }

      @media (max-width: 640px){
          .container-mail {
              max-width: 100vw;
              width: 100%;
              margin: 0;
          }
      }

  </style>
</head>
<body>
  <!-- Contenedor principal -->
  <div class="body">
      <div class="container-mail">
          <!-- Logotipo -->
          <img class="logo" src="https://res.cloudinary.com/dnnjctymr/image/upload/v1695483459/sethor/Logotipo_me7qhe_dclnec.png" alt="Sethor">
          <br>
          <h2>Tu codigo de verificacion es: ${code}</h2>
          <hr>
          <p>No dudes en contactarnos si tienes alguna duda o si quieres formar parte de nuestro equipo!</p>
      </div>
  </div>
  <!-- Footer -->
  <footer class="footer ">
      <div class="footer-container">
          <div class="footer-container-logo">
              <img class="logo-footer" src="https://res.cloudinary.com/dnnjctymr/image/upload/v1695483459/sethor/Isotipo_ylmhxz_qkdx8s.png" alt="Isotipo">
              <p class="text-logo">Sethor</p>
          </div>
          <div class="text-footer">
              <p class=".a">+1 (809) 324-0564</p>
              <p class=".a">info@sethor.com</p>
              <p class=".a">Latam</p>
          </div>
      </div>
      <div class="url">
          <a class="url" target="_blank" href="https://www.sethor.tech">https://www.sethor.tech/</a>
      </div>
  </footer>
</body>`;
}
