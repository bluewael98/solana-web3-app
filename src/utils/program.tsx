"use client";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { MINIMUM_REMAINING_TIME_UNTIL_EXPIRY, PROGRAM_ID } from "./constants";

export const getProgram = (connection: any, wallet: any) => {
  const IDL = require("./idl.json");
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  const program = new Program(IDL, PROGRAM_ID, provider);
  return program;
};

export async function getProgramAccountPk(seeds: any) {
  return (await PublicKey.findProgramAddress(seeds, PROGRAM_ID))[0];
}

export async function getMasterAccountPk() {
  return await getProgramAccountPk([Buffer.from("master")]);
}

export async function getBetAccountPk(id: any) {
  return await getProgramAccountPk([
    Buffer.from("bet"),
    new BN(id).toArrayLike(Buffer, "le", 8),
  ]);
}
