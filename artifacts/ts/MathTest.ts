/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as MathTestContractJson } from "../test/MathTest.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace MathTestTypes {
  export type State = Omit<ContractState<any>, "fields">;

  export interface CallMethodTable {
    uqdiv: {
      params: CallContractParams<{ a: bigint; b: bigint }>;
      result: CallContractResult<bigint>;
    };
    sqrt: {
      params: CallContractParams<{ y: bigint }>;
      result: CallContractResult<bigint>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<MathTestInstance, {}> {
  at(address: string): MathTestInstance {
    return new MathTestInstance(address);
  }

  tests = {
    uqdiv: async (
      params: Omit<
        TestContractParams<never, { a: bigint; b: bigint }>,
        "initialFields"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "uqdiv", params);
    },
    sqrt: async (
      params: Omit<TestContractParams<never, { y: bigint }>, "initialFields">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "sqrt", params);
    },
  };
}

// Use this object to test and deploy the contract
export const MathTest = new Factory(
  Contract.fromJson(
    MathTestContractJson,
    "",
    "085c8183210ec7296681e12ab74e37bebee9d495e78e24cc9b3cd1b110d6df2a"
  )
);

// Use this class to interact with the blockchain
export class MathTestInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<MathTestTypes.State> {
    return fetchContractState(MathTest, this);
  }

  methods = {
    uqdiv: async (
      params: MathTestTypes.CallMethodParams<"uqdiv">
    ): Promise<MathTestTypes.CallMethodResult<"uqdiv">> => {
      return callMethod(MathTest, this, "uqdiv", params, getContractByCodeHash);
    },
    sqrt: async (
      params: MathTestTypes.CallMethodParams<"sqrt">
    ): Promise<MathTestTypes.CallMethodResult<"sqrt">> => {
      return callMethod(MathTest, this, "sqrt", params, getContractByCodeHash);
    },
  };

  async multicall<Calls extends MathTestTypes.MultiCallParams>(
    calls: Calls
  ): Promise<MathTestTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      MathTest,
      this,
      calls,
      getContractByCodeHash
    )) as MathTestTypes.MultiCallResults<Calls>;
  }
}