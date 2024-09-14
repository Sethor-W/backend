import https from "https";
import crypto from "crypto";
const secretKey = process.env.RAPYD_SECRET_KEY;                    // Never transmit the secret key by itself.
const accessKey = process.env.RAPYD_ACCESS_KEY;                    // The access key from Client Portal.
const log = false;

async function makeRequest(method, urlPath, body = null) {
    try {
        const httpMethod = method; // get|put|post|delete - must be lowercase.
        const httpBaseURL = "sandboxapi.rapyd.net";
        const httpURLPath = urlPath;                            // Portion after the base URL.
        const salt = generateRandomString(8);                   // Randomly generated for each request.
        const idempotency = new Date().getTime().toString();
        const timestamp = Math.round(new Date().getTime() / 1000); // Current Unix time (seconds).
        const signature = sign(httpMethod, httpURLPath, salt, timestamp, body)

        const options = {
            hostname: httpBaseURL,
            port: 443,
            path: httpURLPath,
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                salt: salt,
                timestamp: timestamp,
                signature: signature,
                access_key: accessKey,
                idempotency: idempotency
            }
        }

        return await httpRequest(options, body, log);
    }
    catch (error) {
        console.error("Error generating request options");
        throw error;
    }
}

function sign(method, urlPath, salt, timestamp, body) {
    try {
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);      // Stringified JSON without whitespace.
            bodyString = bodyString == "{}" ? "" : bodyString;
        }

        // Cadena para firmar
        let toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;
        log && console.log(`toSign: ${toSign}`);

        // Crear la firma usando HMAC-SHA256
        let hash = crypto.createHmac('sha256', secretKey);
        hash.update(toSign);
        const signature = Buffer.from(hash.digest("hex")).toString("base64")
        log && console.log(`signature: ${signature}`);

        return signature;
    }
    catch (error) {
        console.error("Error generating signature");
        throw error;
    }
}

function generateRandomString(size) {
    try {
        return crypto.randomBytes(size).toString('hex');
    }
    catch (error) {
        console.error("Error generating salt");
        throw error;
    }
}

async function httpRequest(options, body) {

    return new Promise((resolve, reject) => {

        try {
            
            let bodyString = "";
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString == "{}" ? "" : bodyString;
            }

            log && console.log(`httpRequest options: ${JSON.stringify(options)}`);
            const req = https.request(options, (res) => {
                let response = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: ''
                };

                res.on('data', (data) => {
                    response.body += data;
                });

                res.on('end', () => {

                    response.body = response.body ? JSON.parse(response.body) : {}
                    log && console.log(`httpRequest response: ${JSON.stringify(response)}`);

                    if (response.statusCode !== 200) {
                        return reject(response);
                    }

                    return resolve(response);
                });
            })
            
            req.on('error', (error) => {
                return reject(error);
            })
            
            req.write(bodyString)
            req.end();
        }
        catch(err) {
            return reject(err);
        }
    })

}

export { makeRequest };



/**
 * Generate Invoice Prefix
 * Generates an invoice prefix based on the customer name.
 * 
 * @param {string} name - The name of the customer.
 * @returns {string} - The generated invoice prefix.
 */
export function generateInvoicePrefix(name) {
    // Utiliza las primeras letras del nombre y un guion como prefijo
    return `${name.split(' ')[0].toUpperCase().slice(0, 3)}-`;
}
