import { sendResponse, validateRequiredFields } from "../../helpers/utils.js";

export class SdkController {
    /**
     * @swagger
     * /api/v1/sdk/validate-finger:
     *   post:
     *     summary: Validate fingerprint against a RUT
     *     tags: [SDK]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - scanResult
     *               - rut
     *             properties:
     *               scanResult:
     *                 type: object
     *                 description: Fingerprint scan result data
     *               rut:
     *                 type: string
     *                 description: RUT to validate against the fingerprint
     *     responses:
     *       200:
     *         description: Validation successful
     *       400:
     *         description: Invalid input or ABIS error
     *       500:
     *         description: Server error
     */
    static async validateFinger(req, res) {
        const { scanResult, rut } = req.body;
        console.log('***rut:',rut)
        const url = "https://abis.tech5.tech/T5CloudService/1.0/processRequest";
        const username = "jeycoradames@gmail.com";
        const password = "j@yc0r@d@#T5";
    
        try {
            // Extraer datos de la huella => pos - image64
            const extractedData = SdkController.processScanResult(scanResult);
            if (!extractedData || extractedData.length === 0) {
                return sendResponse(res, 400, true, "No se pudieron extraer datos válidos de la huella");
            }
    
            // Autenticación en Base64
            const authHeader = Buffer.from(`${username}:${password}`).toString("base64");
    
            // Body de la consulta al abis
            const body = {
                "tid": "sethorPrueba1-daniel",
                "request_type": "Identification",
                "finger_data": {
                    "live_scan_plain": extractedData
                },
                "fingerThreshold": 0.5,
                "maxResults": 10
            };
    
            // Llamado al abis
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${authHeader}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            
            // TODAS LAS RESPUESTAS DEL ABIS SON BAJO EL CONTEXTO DE 200 OK
            // POR LO TANTO LAS RESPUESTAS AL FRONT, VARIARAN DEPENDIENDO DE UN MENSAJE DETALLADO
            
            // SI LA RESPUESTA NO ES OK, ES PORQUE HAY UN ERROR EN EL FORMATO O ABIS DIRECTAMENTE
            if (!response.ok) {
                return sendResponse(res, response.status, true, `Error en la solicitud: ${response.statusText}`, {
                    status_code: `HTTP_${response.status}`
                });
            }
    
            // DE ESTAR TODO BIEN, ADAPTO EL FORMATO DE LA RESPUESTA
            const data = await response.json();
    
            // 1. Verificar si hay error explícito en la respuesta
            if (data.error) {
                return sendResponse(res, 400, true, `Error del ABIS: ${data.error}`, {
                    status_code: data.errorCode || "ABIS_ERROR",
                    details: data.error
                });
            }
    
            // 2. Intentar parsear la respuesta para obtener la información de "finger"
            let abisResponse;
            try {
                if (!data.response) {
                    console.log("No se encontraron datos de huellas en la respuesta de ABIS.");
                    return sendResponse(res, 400, true, "La respuesta del servidor ABIS no contiene datos de huellas", { status_code: "NO_FINGER_RESPONSE" });
                }
                
                abisResponse = JSON.parse(data.response);
            } catch (parseError) {
                console.log("Error al interpretar la respuesta del servidor ABIS:", parseError);
                return sendResponse(res, 400, true, "Error al interpretar la respuesta del servidor ABIS", { status_code: "PARSE_ERROR" });
            }

            // 3. Extraer TODAS las coincidencias en "FINGER_OMNI_MATCH"
            const fingerprintMatches = abisResponse?.finger?.FINGER_OMNI_MATCH || {};

            // Convertimos las coincidencias en un array [{ id, score }, { id, score }]
            const matchedFingerprints = Object.entries(fingerprintMatches).map(([id, score]) => ({
                id,
                score
            }));

            console.log('matchedFingerprints',matchedFingerprints)

            //Validar si el rut enviado está entre los IDs
            const matchFound = matchedFingerprints.some(fp => fp.id === rut);

            console.log('matchFound',matchFound)
            if (matchFound) {
            return sendResponse(res, 200, false, "Identificación exitosa (RUT coincide con la huella)", {
                status_code: "MATCH_FOUND"
            });
            } else {
            return sendResponse(res, 200, false, "No se encontraron coincidencias para el RUT", {
                status_code: "NO_MATCH"
            });
            }

        } catch (error) {
            console.error("Error al procesar la captura de huella:", error);
            return sendResponse(res, 500, true, "Error interno al procesar la captura de huella");
        }
    }

    static async validateOneFinger(req, res) {
        const { scanResult, rut } = req.body;
        console.log('***rut:',rut)
        const url = "https://abis.tech5.tech/T5CloudService/1.0/processRequest";
        const username = "jeycoradames@gmail.com";
        const password = "j@yc0r@d@#T5";
    
        try {
            // Extraer datos de la huella => pos - image64
            const extractedData = SdkController.processScanResult(scanResult);
            if (!extractedData || extractedData.length === 0) {
                return sendResponse(res, 400, true, "No se pudieron extraer datos válidos de la huella");
            }
    
            // Autenticación en Base64
            const authHeader = Buffer.from(`${username}:${password}`).toString("base64");
    
            // Body de la consulta al abis
            const body = {
                "tid": "sethorPrueba1-daniel",
                "request_type": "Identification",
                "finger_data": {
                    "live_scan_plain": extractedData
                },
                "fingerThreshold": 0.5,
                "maxResults": 10
            };
    
            // Llamado al abis
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${authHeader}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            
            // TODAS LAS RESPUESTAS DEL ABIS SON BAJO EL CONTEXTO DE 200 OK
            // POR LO TANTO LAS RESPUESTAS AL FRONT, VARIARAN DEPENDIENDO DE UN MENSAJE DETALLADO
            
            // SI LA RESPUESTA NO ES OK, ES PORQUE HAY UN ERROR EN EL FORMATO O ABIS DIRECTAMENTE
            if (!response.ok) {
                return sendResponse(res, response.status, true, `Error en la solicitud: ${response.statusText}`, {
                    status_code: `HTTP_${response.status}`
                });
            }
            
            // DE ESTAR TODO BIEN, ADAPTO EL FORMATO DE LA RESPUESTA
            const data = await response.json();

            // 1. Verificar si hay error explícito en la respuesta
            if (data.error) {
                return sendResponse(res, 400, true, `Error del ABIS: ${data.error}`, {
                    status_code: data.errorCode || "ABIS_ERROR",
                    details: data.error
                });
            }
    
            // 2. Intentar parsear la respuesta para obtener la información de "finger"
            let abisResponse;
            try {
                if (!data.response) {
                    console.log("No se encontraron datos de huellas en la respuesta de ABIS.");
                    return sendResponse(res, 400, true, "La respuesta del servidor ABIS no contiene datos de huellas", { status_code: "NO_FINGER_RESPONSE" });
                }
                
                abisResponse = JSON.parse(data.response);
            } catch (parseError) {
                console.log("Error al interpretar la respuesta del servidor ABIS:", parseError);
                return sendResponse(res, 400, true, "Error al interpretar la respuesta del servidor ABIS", { status_code: "PARSE_ERROR" });
            }

            // 3. Extraer TODAS las coincidencias en "FINGER_OMNI_MATCH"
            const fingerprintMatches = abisResponse?.finger?.FINGER_OMNI_MATCH || {};

            // Convertimos las coincidencias en un array [{ id, score }, { id, score }]
            const matchedFingerprints = Object.entries(fingerprintMatches).map(([id, score]) => ({
                id,
                score
            }));

            console.log('matchedFingerprints',matchedFingerprints)

            //Validar si el rut enviado está entre los IDs
            const matchFound = matchedFingerprints.some(fp => fp.id === rut);

            console.log('matchFound',matchFound)
            if (matchFound) {
            return sendResponse(res, 200, false, "Identificación exitosa (RUT coincide con la huella)", {
                status_code: "MATCH_FOUND"
            });
            } else {
            return sendResponse(res, 200, false, "No se encontraron coincidencias para el RUT", {
                status_code: "NO_MATCH"
            });
            }

        } catch (error) {
            console.error("Error al procesar la captura de huella:", error);
            return sendResponse(res, 500, true, "Error interno al procesar la captura de huella");
        }
    }

    //AÑADIR LOGICA PARA ACTUALIZAR EL ESTADO DE LA FACTURA
    
    /**
     * @swagger
     * /api/v1/sdk/validate-template:
     *   post:
     *     summary: Create and validate fingerprint templates
     *     tags: [SDK]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - scanResult
     *               - rut
     *             properties:
     *               scanResult:
     *                 type: object
     *                 description: Fingerprint scan result data
     *               rut:
     *                 type: string
     *                 description: RUT to associate with the fingerprint template
     *     responses:
     *       200:
     *         description: Template created and validated successfully
     *       400:
     *         description: Invalid input or ABIS error
     *       500:
     *         description: Server error
     */
    static async validateTemplate(req,res){
        const { scanResult,rut } = req.body;
        const url = "https://abis.tech5.tech/T5CloudService/1.0/processRequest";
        const username = "jeycoradames@gmail.com";
        const password = "j@yc0r@d@#T5";

        try {
            // Extraer datos de la huella => pos - image64
            const extractedData = SdkController.processScanResult(scanResult);
            if (!extractedData || extractedData.length === 0) {
                return sendResponse(res, 400, true, "No se pudieron extraer datos válidos de la huella");
            }
    
            // Autenticación en Base64
            const authHeader = Buffer.from(`${username}:${password}`).toString("base64");
    
            extractedData.forEach(item => {
                item["dpi"] = 500;
            });

            const body = {
                "tid": "sethorPrueba1-daniel",
                "request_type": "CreateTemplates",
                "finger_data": {
                    "live_scan_plain": extractedData
                },
                "iris_data": [],
                "face_data": [],
                "palm_data": [],
                "tattoo_data": null
            };

    
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${authHeader}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            //SI HAY UN ERROR INESPERADO, LO RETORNO
            if (!response.ok) {
                console.log(`Error HTTP ${response.status}: ${response.statusText}`);
                return sendResponse(res, response.status, true, `Error en la solicitud: ${response.statusText}`, {
                    status_code: `HTTP_${response.status}`
                });
            }

            const jsonResponse = await response.json();

            // Verificar si ABIS devolvió un error
            if (jsonResponse.error) {
                console.log(`Error del ABIS: ${jsonResponse.error}`);
                return sendResponse(res, 400, true, `Error del ABIS: ${jsonResponse.error}`, {
                    status_code: jsonResponse.errorCode || "ABIS_ERROR",
                    details: jsonResponse.error
                });
            }

            // Validar si `finger_data.live_scan_plain` tiene datos
            const templates = jsonResponse.finger_data?.live_scan_plain || [];
            if (templates.length === 0) {
                console.log("No se generaron templates.");
                return sendResponse(res, 400, true, "No se pudieron generar templates", {
                    status_code: "NO_TEMPLATES"
                });
            }

            // Extraer solo los valores de "pos" y "template" de "live_scan_plain"
            const filteredData = jsonResponse.finger_data.live_scan_plain.map(item => ({
                pos: item.pos,
                template: item.template
            }));


            const enrollResponse = await SdkController.enrollarUser(filteredData, rut);
            /*LOGICA SEGUN SU RUT */
            return sendResponse(res, 200, false, enrollResponse);
        } catch (error) {
            console.error("Error al procesar la captura de huella:", error);
            return sendResponse(res, 500, true, "Error interno al procesar la captura de huella");
        }
    }

    /**
     * @swagger
     * /api/v1/sdk/enroll-user:
     *   post:
     *     summary: Enroll a user with fingerprint templates
     *     tags: [SDK]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - dataTemplate
     *               - rut
     *             properties:
     *               dataTemplate:
     *                 type: array
     *                 description: Array of fingerprint templates
     *               rut:
     *                 type: string
     *                 description: RUT to associate with the fingerprint
     *     responses:
     *       200:
     *         description: User enrolled successfully
     *       400:
     *         description: Invalid input or ABIS error
     *       500:
     *         description: Server error
     */
    static async enrollarUser(dataTemplate,rut) {
        const url = "https://abis.tech5.tech/T5CloudService/1.0/processRequest";
        const username = "jeycoradames@gmail.com";
        const password = "j@yc0r@d@#T5";
    
        try {
            // Autenticación en Base64
            const authHeader = Buffer.from(`${username}:${password}`).toString("base64");
    
            const body = {
                "tid": "sethorPrueba1-daniel",
                "encounter_id": rut,
                "request_type": "Enroll",
                "finger_data": {
                    "live_scan_plain": dataTemplate
                },
                "iris_data": [],
                "face_data": [],
                "palm_data": [],
                "tattoo_data": null
            };
    
            // Enviar la solicitud al ABIS
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${authHeader}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
    
            // Verificar si hubo un error HTTP
            if (!response.ok) {
                console.log(`Error HTTP ${response.status}: ${response.statusText}`);
                return {
                    success: false,
                    message: `Error en la solicitud: ${response.statusText}`,
                    status_code: `HTTP_${response.status}`
                };
            }
    
            // Convertir respuesta a JSON
            const jsonResponse = await response.json();

            if (jsonResponse.response === "true") {
                return "Usuario enrollado con éxito.";
            } else if (jsonResponse.error && jsonResponse.errorCode === 2022) {
                return "El usuario ya existe.";
            } else {
                return `Verifique el error: ${jsonResponse.error || "Error desconocido"}`;
            }
    
        } catch (error) {
            return `Error en la solicitud: ${error.message}`;
        }
    }
    
    /**
     * @swagger
     * components:
     *   schemas:
     *     ScanResult:
     *       type: object
     *       properties:
     *         fingers:
     *           type: array
     *           items:
     *             type: object
     *             properties:
     *               pos:
     *                 type: integer
     *                 description: Position of the finger
     *               image_base64:
     *                 type: string
     *                 description: Base64 encoded image of the fingerprint
     */
    static processScanResult(scanResult) {
        if (!scanResult || typeof scanResult !== "object" || !Array.isArray(scanResult.fingers)) {
            return [];
        }
    
        return scanResult.fingers.map((finger, index) => ({
            pos: finger.pos || index + 1,
            data: finger.image_base64 ? finger.image_base64.replace(/\s+/g, '') : null
        })).filter(finger => finger.data);
    }    
}
