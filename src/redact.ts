const SECRET_PATTERNS = [
  /password/i, /secret/i, /key/i, /token/i, /env/i, /\.env/,
  /BEGIN .* PRIVATE KEY/,
];

export function redact(text: string): string {
  let redacted = text;
  SECRET_PATTERNS.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  return redacted;
}