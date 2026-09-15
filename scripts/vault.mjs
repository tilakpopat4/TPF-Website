#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';

const DEFAULT_SOURCE_FILES = ['.env.local', 'credentials.local.json'];
const DEFAULT_ENC_FILE = 'credentials.enc';
const KDF_ITERATIONS = 100000;
const KEY_LEN = 32; // 256 bits for AES-256
const ALGORITHM = 'aes-256-gcm';

// ─── Interactive Hidden Password Prompt ──────────────────────────────────────

function askPassword(promptText) {
  return new Promise((resolve) => {
    // Check if passed via flag or env variable
    const pwdFlagIndex = process.argv.indexOf('--password');
    if (pwdFlagIndex !== -1 && process.argv[pwdFlagIndex + 1]) {
      return resolve(process.argv[pwdFlagIndex + 1]);
    }
    if (process.env.VAULT_PASSWORD) {
      return resolve(process.env.VAULT_PASSWORD);
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // In terminal environments, query password directly
    process.stdout.write(promptText);

    // If stdin is a TTY, mask password
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      let password = '';
      const onData = (char) => {
        char = char.toString('utf8');
        if (char === '\n' || char === '\r' || char === '\u0004') {
          process.stdin.setRawMode(false);
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(password);
        } else if (char === '\u0003') {
          // Ctrl+C
          process.exit(1);
        } else if (char === '\u0008' || char === '\x7f') {
          // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
        } else {
          password += char;
          process.stdout.write('*');
        }
      };
      process.stdin.on('data', onData);
    } else {
      rl.question('', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

// ─── Key Derivation & Cryptography ───────────────────────────────────────────

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, KDF_ITERATIONS, KEY_LEN, 'sha512');
}

function encryptBuffer(buffer, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = deriveKey(password, salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    version: 1,
    cipher: ALGORITHM,
    kdf: 'pbkdf2-sha512',
    iterations: KDF_ITERATIONS,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    data: encrypted.toString('hex'),
  };
}

function decryptVault(vaultObj, password) {
  if (vaultObj.cipher !== ALGORITHM) {
    throw new Error(`Unsupported cipher: ${vaultObj.cipher}`);
  }

  const salt = Buffer.from(vaultObj.salt, 'hex');
  const iv = Buffer.from(vaultObj.iv, 'hex');
  const tag = Buffer.from(vaultObj.tag, 'hex');
  const data = Buffer.from(vaultObj.data, 'hex');

  const key = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted;
}

// ─── Command Handlers ────────────────────────────────────────────────────────

async function handleEncrypt() {
  const args = process.argv.slice(3).filter((a) => !a.startsWith('--'));
  let inputFile = args[0];
  let outputFile = args[1] || DEFAULT_ENC_FILE;

  if (!inputFile) {
    // Find default source
    for (const def of DEFAULT_SOURCE_FILES) {
      if (fs.existsSync(def)) {
        inputFile = def;
        break;
      }
    }
  }

  if (!inputFile || !fs.existsSync(inputFile)) {
    console.error('❌ Error: No source credentials file found to encrypt.');
    console.log(`   Looked for: ${DEFAULT_SOURCE_FILES.join(', ')}`);
    console.log('   Usage: node scripts/vault.mjs encrypt <file-to-encrypt> [output-file.enc]');
    process.exit(1);
  }

  console.log(`\n🔒 Encrypting credentials from: ${inputFile}`);
  const pass1 = await askPassword('Enter Master Encryption Passphrase: ');
  if (!pass1) {
    console.error('\n❌ Error: Passphrase cannot be empty.');
    process.exit(1);
  }

  // If interactive, ask for confirmation
  if (!process.env.VAULT_PASSWORD && !process.argv.includes('--password')) {
    const pass2 = await askPassword('Confirm Master Encryption Passphrase: ');
    if (pass1 !== pass2) {
      console.error('\n❌ Error: Passphrases do not match. Aborting.');
      process.exit(1);
    }
  }

  const content = fs.readFileSync(inputFile);
  const vaultObj = encryptBuffer(content, pass1);

  fs.writeFileSync(outputFile, JSON.stringify(vaultObj, null, 2), 'utf8');
  console.log(`\n✅ Credentials successfully encrypted with AES-256-GCM!`);
  console.log(`   Encrypted output saved to: ${outputFile}`);
  console.log(`   Remember your Master Passphrase—it is required to decrypt this file.`);
}

async function handleDecrypt() {
  const args = process.argv.slice(3).filter((a) => !a.startsWith('--'));
  const inputFile = args[0] || DEFAULT_ENC_FILE;
  let outputFile = args[1];

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error: Encrypted file '${inputFile}' not found.`);
    console.log('   Usage: node scripts/vault.mjs decrypt [encrypted-file.enc] [output-file]');
    process.exit(1);
  }

  console.log(`\n🔓 Decrypting credentials from: ${inputFile}`);
  const password = await askPassword('Enter Master Passphrase: ');

  try {
    const vaultObj = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const decryptedBuffer = decryptVault(vaultObj, password);

    if (!outputFile) {
      // If encrypted file was .env.local or json
      outputFile = '.env.local';
    }

    fs.writeFileSync(outputFile, decryptedBuffer);
    console.log(`\n✅ Decryption successful!`);
    console.log(`   Credentials decrypted and restored to: ${outputFile}`);
  } catch (err) {
    console.error(`\n❌ Decryption failed: Incorrect master passphrase or corrupted vault file.`);
    process.exit(1);
  }
}

function handleStatus() {
  console.log('\n🔍 TPF Credentials & Vault Status:');
  console.log('──────────────────────────────────────────────────');

  for (const file of DEFAULT_SOURCE_FILES) {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '🟢' : '⚪'} ${file}: ${exists ? 'Present (local only)' : 'Not created yet'}`);
  }

  const encExists = fs.existsSync(DEFAULT_ENC_FILE);
  console.log(`  ${encExists ? '🔒' : '⚪'} ${DEFAULT_ENC_FILE}: ${encExists ? 'Encrypted backup present' : 'Not generated yet'}`);

  // Verify .gitignore rules
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const protectsEnv = gitignore.includes('.env*');
    const protectsCreds = gitignore.includes('credentials*');
    console.log('\n🛡️ Git Exclusion Protection:');
    console.log(`  ${protectsEnv ? '✅' : '❌'} .env* excluded in .gitignore`);
    console.log(`  ${protectsCreds ? '✅' : '❌'} credentials* excluded in .gitignore`);
  }
  console.log('──────────────────────────────────────────────────\n');
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

const command = process.argv[2] || 'status';

if (command === 'encrypt') {
  handleEncrypt();
} else if (command === 'decrypt') {
  handleDecrypt();
} else if (command === 'status') {
  handleStatus();
} else {
  console.log(`
TPF Credentials Vault Tool (AES-256-GCM + PBKDF2-SHA512)

Commands:
  node scripts/vault.mjs encrypt [source] [destination.enc]
    Encrypt your local credentials file using AES-256-GCM.

  node scripts/vault.mjs decrypt [source.enc] [destination]
    Decrypt an encrypted vault file back to your local credentials.

  node scripts/vault.mjs status
    Inspect local credential files and git protection status.
`);
}
