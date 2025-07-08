import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  private readonly tempDir = path.join(__dirname, '../../../tmp');

  async saveBase64Image(base64Data: string, fileName: string): Promise<string> {
    try {
      const buffer = Buffer.from(base64Data, 'base64');

      // Asegurarse de que el directorio temporal exista
      await fs.mkdir(this.tempDir, { recursive: true });

      const filePath = path.join(this.tempDir, fileName);
      await fs.writeFile(filePath, buffer);

      this.logger.log(`Imagen guardada en ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error('Error al guardar imagen', error);
      throw error;
    }
  }

  async deleteImage(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      this.logger.log(`Imagen eliminada: ${filePath}`);
    } catch (error) {
      this.logger.warn(`No se pudo eliminar la imagen: ${filePath}`);
    }
  }
}
