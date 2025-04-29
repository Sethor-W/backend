# Guía para Documentar API con Swagger

## Introducción

Este proyecto utiliza Swagger para documentar la API. La documentación se genera automáticamente a partir de comentarios JSDoc en el código.

## Acceso a la documentación

La documentación está disponible en:
- Desarrollo local: http://localhost:3000/api-docs

## Cómo documentar endpoints

### Ejemplo básico

```javascript
/**
 * @swagger
 * /api/v1/resource:
 *   get:
 *     summary: Breve descripción del endpoint
 *     tags: [Categoría]
 *     parameters:
 *       - in: query
 *         name: param1
 *         schema:
 *           type: string
 *         description: Descripción del parámetro
 *     responses:
 *       200:
 *         description: Operación exitosa
 *       404:
 *         description: Recurso no encontrado
 */
router.get('/resource', controller.getResource);
```

### Documentar un endpoint POST con body

```javascript
/**
 * @swagger
 * /api/v1/resource:
 *   post:
 *     summary: Crea un nuevo recurso
 *     tags: [Categoría]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del recurso
 *     responses:
 *       201:
 *         description: Recurso creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/resource', controller.createResource);
```

### Documentar endpoints protegidos

```javascript
/**
 * @swagger
 * /api/v1/resource:
 *   put:
 *     summary: Actualiza un recurso existente
 *     tags: [Categoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del recurso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recurso actualizado
 *       401:
 *         description: No autorizado
 */
router.put('/resource/:id', authMiddleware, controller.updateResource);
```

## Definición de modelos

También puedes definir modelos para reutilizarlos:

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         createdAt:
 *           type: string
 *           format: date-time
 */
```

## Referencia a modelos

```javascript
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 */
``` 