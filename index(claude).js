const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const pw = 'HatsuneeBotByThisRonzDev';
const sessionDir = path.join(__dirname, 'session');
const encFilePath = path.join(sessionDir, 'enc.json');

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const algorithm = 'aes-256-cbc';

function encrypt(text, secretKey, iv) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText, secretKey, iv) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function checkFolderAndFile() {
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }
    
    if (fs.existsSync(encFilePath)) {
        checkPrivate();
    } else {
        const defaultContent = { pw: '' };
        fs.writeFileSync(encFilePath, JSON.stringify(defaultContent));
        privateScript();
    }
}

function checkPrivate() {
    const data = JSON.parse(fs.readFileSync(encFilePath, 'utf8'));
    if (data && data.pw && data.iv && data.secretKey) {
        try {
            const decryptedPw = decrypt(data.pw, Buffer.from(data.secretKey, 'hex'), Buffer.from(data.iv, 'hex'));
            if (decryptedPw === pw) {
                console.log('\x1b[32m%s\x1b[0m', 'Correct password, running HatsuneeInd()...');
                HatsuneeInd();
                return;
            }
        } catch (error) {
            console.error('Error during decryption:', error);
        }
    }
    privateScript();
}

async function privateScript() {
    try {
        const input = await question('\x1b[42m\x1b[30mEnter password: \x1b[0m');
        rl.close();

        if (input === pw) {
            const secretKey = crypto.randomBytes(32);
            const iv = crypto.randomBytes(16);
            const encryptedPw = encrypt(pw, secretKey, iv);
            
            const encData = {
                pw: encryptedPw,
                iv: iv.toString('hex'),
                secretKey: secretKey.toString('hex')
            };
            
            fs.writeFileSync(encFilePath, JSON.stringify(encData));
            console.log('\x1b[32m%s\x1b[0m', 'Correct password');
            HatsuneeInd();
        } else {
            console.log('\x1b[41m\x1b[30m%s\x1b[0m', 'Wrong password, bro!');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

function HatsuneeInd() {
    console.log('code private script berhasil dan fake code is running...');
    // Implement HatsuneeInd() here
}

checkFolderAndFile();