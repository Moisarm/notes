import express, { type Request, type Response } from "express";

export const not_found_handler = (req: Request, res: Response) => {
  res.status(404).redirect("/api");
};
