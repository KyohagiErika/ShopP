import CustomerModel from "../models/customer";
import { Request, Response } from "express";
import { ControllerService } from "../utils/decorators";
import { GenderEnum } from "../utils/shopp.enum";

export default class CustomerMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await CustomerModel.listAll();
    if (result) res.send(result);
    else res.status(400).send("Get customer failed");
  }

  @ControllerService()
  static async getOneById(req: Request, res: Response) {
    const id = req.params.id; //(req.params as unknown) as number;
    if (id) {
      const result = await CustomerModel.getOneById(id);
      if (result) {
        res.send(result);
      } else {
        res.status(400).send("Get customer failed!" + id);
      }
      res.status(200);
    } else {
      res.status(400).send("Incorrect id! " + id);
    }
  }

  @ControllerService()
  static async postNew(req: Request, res: Response) {
    const data = req.body;
    if (data.name && data.placeOfDelivery) {
      const result = await CustomerModel.postNew(
        data.name.toString(),
        data.gender,
        data.dob,
        data.avatar,
        data.placeOfDelivery.toString()
      );
      if (result) {
        res.send(result);
      } else {
        res.status(400).send("Post data failed!");
      }
    } else {
      res.status(400).send("Incorrect input data!");
    }
  }

  @ControllerService()
  static async edit(req: Request, res: Response) {
    const data = req.query;
    const id = (req.params as unknown) as string;
    if (data.id && id && data.name && data.placeOfDelivery) {
      const result = await CustomerModel.edit(
        id,
        data.name.toString(),
        data.avatar?+data.avatar:undefined,
        data.gender,
        data.dob,
        data.placeOfDelivery.toString()
      );
      if (result) {
        res.send(result);
      } else {
        res.status(400).send("Insert data failed!");
      }
    } else {
      res.status(400).send("Incorrect input data!");
    }
  }

  @ControllerService()
  static async delete(req: Request, res: Response) {
    const id = +req.params.id; //parseInt(req.params);//(req.params as unknown) as number;
    if (id) {
      const result = await CustomerModel.delete(id);
      if (result) {
        res.send(result);
      } else {
        res.status(400).send("Delete data failed!" + id);
      }
    } else {
      res.status(400).send("Incorrect id!" + id);
    }
  }
}
