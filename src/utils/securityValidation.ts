// Security validation utilities

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Enhanced contact information validation
export const validateTelegramHandle = (handle: string): ValidationResult => {
  if (!handle) return { isValid: true };
  
  const telegramRegex = /^@[a-zA-Z0-9_]{5,32}$/;
  if (!telegramRegex.test(handle)) {
    return {
      isValid: false,
      message: 'Telegram должен начинаться с @ и содержать 5-32 символа (буквы, цифры, _)'
    };
  }
  
  return { isValid: true };
};

export const validateWhatsAppNumber = (number: string): ValidationResult => {
  if (!number) return { isValid: true };
  
  // Support international formats: +7 XXX XXX-XX-XX, +1 XXX XXX XXXX, etc.
  const whatsappRegex = /^\+[1-9]\d{1,14}$/;
  const formattedNumber = number.replace(/[\s\-\(\)]/g, '');
  
  if (!whatsappRegex.test(formattedNumber)) {
    return {
      isValid: false,
      message: 'WhatsApp номер должен быть в международном формате: +7 XXX XXX-XX-XX'
    };
  }
  
  return { isValid: true };
};

export const validateFacebookUrl = (url: string): ValidationResult => {
  if (!url) return { isValid: true };
  
  const facebookRegex = /^https?:\/\/(www\.)?(facebook\.com|fb\.me)\/[a-zA-Z0-9._-]+\/?$/;
  if (!facebookRegex.test(url)) {
    return {
      isValid: false,
      message: 'Введите корректную ссылку на Facebook профиль'
    };
  }
  
  return { isValid: true };
};

// Email validation with additional security checks
export const validateEmail = (email: string): ValidationResult => {
  if (!email) return { isValid: false, message: 'Email обязателен' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Введите корректный email' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.{2,}/, // Multiple consecutive dots
    /^\./, // Starting with dot
    /\.$/, // Ending with dot
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(email))) {
    return { isValid: false, message: 'Email содержит недопустимые символы' };
  }
  
  return { isValid: true };
};

// Password validation with security requirements
export const validatePasswordSecurity = (password: string): ValidationResult => {
  if (!password) return { isValid: false, message: 'Пароль обязателен' };
  
  if (password.length < 8) {
    return { isValid: false, message: 'Пароль должен содержать минимум 8 символов' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Пароль слишком длинный (максимум 128 символов)' };
  }
  
  const requirements = [
    { regex: /[A-Z]/, message: 'заглавную букву' },
    { regex: /[a-z]/, message: 'строчную букву' },
    { regex: /[0-9]/, message: 'цифру' },
    { regex: /[^A-Za-z0-9]/, message: 'специальный символ' },
  ];
  
  const missingRequirements = requirements.filter(req => !req.regex.test(password));
  
  if (missingRequirements.length > 0) {
    return {
      isValid: false,
      message: `Пароль должен содержать: ${missingRequirements.map(r => r.message).join(', ')}`
    };
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /(.)\1{3,}/, // 4+ repeated characters
    /123456|654321|qwerty|password|admin/i, // Common weak passwords
    /^[A-Za-z]+$/, // Only letters
    /^[0-9]+$/, // Only numbers
  ];
  
  if (weakPatterns.some(pattern => pattern.test(password))) {
    return { isValid: false, message: 'Пароль слишком простой. Используйте более сложную комбинацию' };
  }
  
  return { isValid: true };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Rate limiting check (client-side awareness)
export const checkRateLimit = (key: string, maxAttempts: number, timeWindow: number): boolean => {
  try {
    const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    const now = Date.now();
    
    // Filter attempts within time window
    const recentAttempts = attempts.filter((timestamp: number) => now - timestamp < timeWindow);
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
    
    return true;
  } catch {
    return true; // Allow if localStorage fails
  }
};