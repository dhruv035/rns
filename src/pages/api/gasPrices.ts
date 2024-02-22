// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { avalanche } from "viem/chains";
import { createPublicClient, http } from "viem";
import clientPromise from "@/backend-services/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") return res.status(200).send("OK");
  if (req.method === "GET") {
    const client = await clientPromise;
    const db = client.db("RNS");
    const data = db.collection("Gas Tracker").find({}).toArray();

    res.status(200).json({ data: data });
    return;
  }
}
