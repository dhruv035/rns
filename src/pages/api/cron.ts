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

    
    const body = req.query;
    const publicClient=createPublicClient({
        chain: avalanche,
        transport: http('https://api.avax.network/ext/bc/C/rpc')
    })

    const gas = await publicClient.getGasPrice();
    const gas2 = await publicClient.estimateFeesPerGas()
    const client = await clientPromise;
    const db = client.db('RNS')
    const data = await db.collection('Gas Tracker').insertOne({timestamp:Date.now(),medGas:gas})
  res.status(200).json({ gas:Number(gas) });
}
