import { Router } from 'express';
import { TicketController } from './TicketController';
import { ROUTE_METHOD, CommonMiddlewares } from '../../common';
import { AlbanyRouter } from '../../common/AlbanyRouter';
import { Images } from '../../../utils';

export class TicketRouter extends AlbanyRouter {
  constructor() {
    super('Ticket Router');
  }

  static create(): Router {
    const c = new TicketController();
    const r = new TicketRouter();
    r.addRoute('/ticket', c.createTicket(), ROUTE_METHOD.POST, [
      CommonMiddlewares.onlyClient(),
      Images.midd(),
    ])
      .addRoute('/ticket/:by?', c.getTicket(), ROUTE_METHOD.GET, [
        CommonMiddlewares.needToken(),
      ])
      .addRoute('/ticket/:ticketId', c.attentionTicket(), ROUTE_METHOD.PUT, [
        CommonMiddlewares.onlyTechnical(),
        Images.midd(),
      ])
      .addRoute(
        '/ticket/comment/:ticketId',
        c.commentTicket(),
        ROUTE_METHOD.POST,
        [CommonMiddlewares.onlyClient(), Images.midd()],
      )
      .addRoute('/ticket/state/:ticketId', c.stateTicket(), ROUTE_METHOD.PUT, [
        CommonMiddlewares.needToken(),
      ]);
    return r.router;
  }
}
