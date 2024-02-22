// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { avalanche } from 'viem/chains'
import { createPublicClient, http } from 'viem'
import clientPromise from "@/backend-services/db";

type Data = {
  gas: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {

    const client = await clientPromise;
    const db = client.db('RNS')
    const data =  db.collection('Gas Tracker').find({})
    console.log("DATA",data)
    
    console.log("HELLOW")
  res.status(200).json({ gas:Number(2) });
}
