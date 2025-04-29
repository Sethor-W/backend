# Implementación de Swagger en Sethor Backend

## Introducción

Este proyecto ha sido actualizado para incluir documentación de API mediante Swagger. Esto permite tener una documentación interactiva y actualizada de todos los endpoints disponibles en la aplicación.

## Acceso a Swagger UI

Una vez iniciado el servidor, puedes acceder a la documentación en:

```
http://localhost:3000/api-docs
```

## Cómo se implementó

1. Se instalaron los paquetes necesarios:
   ```
   npm install swagger-jsdoc swagger-ui-express
   ```

2. Se creó el archivo de configuración en `src/config/swagger.config.js`

3. Se integró Swagger en el servidor en `src/server/index.js`

4. Se creó una guía de documentación en `src/docs/swagger-guide.md`

5. Se documentaron las rutas de autenticación como ejemplo

## Cómo documentar nuevos endpoints

Para agregar documentación a nuevos endpoints, sigue el formato JSDoc con la anotación `@swagger` como se muestra en los ejemplos de `src/routes/client/auth.router.js`.

Consulta la guía completa en `src/docs/swagger-guide.md` para ver ejemplos de diferentes tipos de endpoints.

## Beneficios

- Documentación interactiva y actualizada
- Prueba de endpoints directamente desde la interfaz
- Mejor comprensión de la API para desarrolladores frontend
- Facilita el onboarding de nuevos desarrolladores

## Recursos adicionales

- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)
- [Swagger JSDoc](https://www.npmjs.com/package/swagger-jsdoc)
- [OpenAPI Specification](https://swagger.io/specification/) 