export const validatePassword = (req = request, res = response, next) => {
    const { password } = req.body;
    const minLength = 8; // Establecer longitud mínima
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);
  
    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
      return res.status(400).json({ status: "error", msg: "La contraseña debe tener al menos 8 caracteres y contener letras mayúsculas, minúsculas, números y caracteres especiales." });
    }
    next();
  };