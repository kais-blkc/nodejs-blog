import { container } from "@/core/di/inversify.config";
import { TYPES } from "@/core/di/types";
import { asyncHandler } from "@/core/utils/async-handler";
import { Router } from "express";
import multer from "multer";
import { FilesController } from "./files.controller";

const router = Router();
const filesController = container.get<FilesController>(TYPES.FilesController);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // сохраняется с расширением
  },
});
const upload = multer({ storage });

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     tags: [Files]
 *     summary: Загрузка файла
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(filesController.upload),
);

/**
 * @swagger
 * /api/files/list:
 *   get:
 *     tags: [Files]
 *     summary: Список файлов
 *     responses:
 *       200:
 *         description: Список файлов
 */
router.get("/list", asyncHandler(filesController.list));

/**
 * @swagger
 * /api/files/{id}:
 *   get:
 *     tags: [Files]
 *     summary: Получить файл по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Информация о файле
 */
router.get("/:id", asyncHandler(filesController.getFile));

/**
 * @swagger
 * /api/files/delete/{id}:
 *   delete:
 *     tags: [Files]
 *     summary: Удалить файл
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Файл удален
 */
router.delete("/delete/:id", asyncHandler(filesController.delete));

/**
 * @swagger
 * /api/files/download/{id}:
 *   get:
 *     tags: [Files]
 *     summary: Скачать файл
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Файл для скачивания
 */
router.get("/download/:id", asyncHandler(filesController.download));

/**
 * @swagger
 * /api/files/update/{id}:
 *   put:
 *     tags: [Files]
 *     summary: Обновить файл
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Файл обновлен
 */
router.put(
  "/update/:id",
  upload.single("file"),
  asyncHandler(filesController.update),
);

export { router as filesRouter };
