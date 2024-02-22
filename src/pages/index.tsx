import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import clientPromise from "@/backend-services/db";
import { ObjectId, WithId, Document } from "mongodb";
import { Chart } from "react-google-charts";
import { formatGwei } from "viem";

type gasData = {
  timestamp: number;
  gasPrice: number;
};
const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps = (async () => {
  // Fetch data from external API
  const client = await clientPromise;
  const db = client.db("RNS");
  const data = await db
    .collection("Gas Tracker")
    .find({})
    .toArray()
    .then((res) => {
      const data = res.map((object: any) => {
        return {
          timestamp: object.timestamp,
          gasPrice: Number(formatGwei(BigInt(object.medGas))),
        };
      });
      return data;
    });

  // Pass data to the page via props
  return { props: { data } };
}) satisfies GetServerSideProps<{ data: gasData[] }>;

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const chartData: any = [["Timestamp", "GasPrice"]];
  data.map((object: gasData) => {
    chartData.push([object.timestamp, object.gasPrice]);
  });

  const options = {
    title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
  };

  return (
    <main>
      <div>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
        />
        <table>
          <tbody>
            <tr>
              <th>No.</th>
              <th>Timestamp</th>
              <th>Gas</th>
            </tr>
            {data.map((object: gasData, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{object.timestamp}</td>
                  <td>{object.gasPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
