export const uploadConfig = {
  UPLOAD_DIR: process.cwd() + "/uploads",
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  MAX_FILES: 5,
};
