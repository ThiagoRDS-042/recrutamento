import { Request, Response } from "express";

import { StatusCode } from "../utils";
import { ClientService } from "../services/ClientService";

export class ClientController {
  async create(req: Request, res: Response) {
    const { nome, tipo } = req.body;

    const clientService = new ClientService();

    const client = await clientService.create(nome, tipo);

    return res.status(StatusCode.CREATED).json(client);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const clientService = new ClientService();

    const client = await clientService.findById(id);

    return res.status(StatusCode.OK).json(client);
  }

  async update(req: Request, res: Response) {
    const { nome, tipo } = req.body;
    const { id } = req.params;

    const clientService = new ClientService();

    const client = await clientService.update(id, nome, tipo);

    return res.status(StatusCode.NO_CONTENT).json(client);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const clientService = new ClientService();

    await clientService.delete(id);

    return res.status(StatusCode.NO_CONTENT).json();
  }

  async find(req: Request, res: Response) {
    const { nome, tipo } = req.query;

    const clientService = new ClientService();

    const clients = await clientService.find(nome as string, tipo as string);

    return res.status(StatusCode.OK).json({ dados: clients });
  }
}
