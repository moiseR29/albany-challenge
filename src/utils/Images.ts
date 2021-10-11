/* eslint-disable security/detect-non-literal-fs-filename */
import { promises } from 'fs';
import Multer from 'multer';
import { Request } from 'express';

const { readFile } = promises;
class Images {
  private _m!: Multer.Multer;
  private _route!: string;

  configure(route: string) {
    this._route = route;
    const storage = Multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './images');
      },
      filename: function (req, file, cb) {
        cb(null, new Date().toISOString().concat(file.originalname));
      },
    });
    this._m = Multer({
      storage,
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    });
  }

  midd() {
    return this.m.single('ticketImage');
  }

  getPathImage(req: Request): string {
    let path = '';
    if (req.file) path = req.file.path;
    return path;
  }

  async get(nameFile: string): Promise<string> {
    if (!nameFile) return '';
    return await readFile(this.route.concat(`/${nameFile}`), {
      encoding: 'base64',
    });
  }

  private get m(): Multer.Multer {
    return this._m;
  }

  private get route(): string {
    return this._route;
  }
}

const i: Images = new Images();
export { i as Images };
