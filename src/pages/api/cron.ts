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

    console.log("asd",process.env.INFURA_KEY)
    const chainId = "1";
    
    const body = req.body;
    console.log("Body",body)

    const publicClient=createPublicClient({
        chain: avalanche,
        transport: http('https://api.avax.network/ext/bc/C/rpc')
    })

    const gas = await publicClient.getGasPrice();
    const gas2 = await publicClient.estimateFeesPerGas()
    const client = await clientPromise;
    const db = client.db('RNS')
    const data = await db.collection('Gas Tracker').insertOne({timestamp:Date.now(),medGas:gas})
    console.log("DATA",data,data.insertedId)
    console.log("GAS",gas,gas2)
    console.log("HELLOW")
  res.status(200).json({ gas:Number(gas) });
}
