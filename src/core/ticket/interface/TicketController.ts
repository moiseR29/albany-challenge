/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import {
  CreateTicket,
  GetTicket,
  AttentionTicket,
  StateTicket,
} from '../business';
import { TicketDAOPsql } from './TicketDAOPsql';
import { AlbanyError } from '../../common';
import {
  HTTP_STATUS,
  ALBANY_TOKEN,
  Images,
  TICKET_GET_METHOD,
} from '../../../utils';
import { CommentDAOPsql } from '../../comment';
import { CommentTicket } from '../business/app/CommentTicket';

export class TicketController {
  createTicket(): any {
    return async (req: Request, res: Response) => {
      try {
        const response = await CreateTicket(
          { ...req.body, filePath: Images.getPathImage(req) },
          req.get(ALBANY_TOKEN)!,
          new TicketDAOPsql(),
        );
        return res.status(HTTP_STATUS.CREATED).send(response);
      } catch (error) {
        // @ts-ignore
        const parse = AlbanyError.getError(error);
        return res.status(parse.error.status).json(parse.error);
      }
    };
  }

  getTicket(): any {
    return async (req: Request, res: Response) => {
      try {
        const by = req.params.by ?? TICKET_GET_METHOD.ALL;
        req.params.by = by;
        const response = await GetTicket(
          req.params,
          req.get(ALBANY_TOKEN)!,
          new TicketDAOPsql(),
        );
        return res.status(HTTP_STATUS.OK).send(response);
      } catch (error) {
        // @ts-ignore
        const parse = AlbanyError.getError(error);
        return res.status(parse.error.status).json(parse.error);
      }
    };
  }

  attentionTicket(): any {
    return async (req: Request, res: Response) => {
      try {
        const response = await AttentionTicket(
          { ...req.body, filePath: Images.getPathImage(req) },
          req.get(ALBANY_TOKEN)!,
          req.params,
          new TicketDAOPsql(),
          new CommentDAOPsql(),
        );
        return res.status(HTTP_STATUS.OK).send(response);
      } catch (error) {
        // @ts-ignore
        const parse = AlbanyError.getError(error);
        return res.status(parse.error.status).json(parse.error);
      }
    };
  }

  commentTicket(): any {
    return async (req: Request, res: Response) => {
      try {
        const response = await CommentTicket(
          { ...req.body, filePath: Images.getPathImage(req) },
          req.get(ALBANY_TOKEN)!,
          req.params,
          new TicketDAOPsql(),
          new CommentDAOPsql(),
        );
        return res.status(HTTP_STATUS.OK).send(response);
      } catch (error) {
        // @ts-ignore
        const parse = AlbanyError.getError(error);
        return res.status(parse.error.status).json(parse.error);
      }
    };
  }

  stateTicket(): any {
    return async (req: Request, res: Response) => {
      try {
        const response = await StateTicket(
          req.body,
          req.get(ALBANY_TOKEN)!,
          req.params,
          new TicketDAOPsql(),
        );
        return res.status(HTTP_STATUS.OK).send(response);
      } catch (error) {
        // @ts-ignore
        const parse = AlbanyError.getError(error);
        return res.status(parse.error.status).json(parse.error);
      }
    };
  }
}
