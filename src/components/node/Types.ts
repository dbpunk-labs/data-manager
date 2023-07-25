//
// Types.ts
// Copyright (C) 2023 db3.network Author imotai <codego.me@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

export type MutationHeader = {
    id: string
    time: string
    sender: string
    size: number
    key: string
    action: string
}

export type RollupRecord = {
    startBlock: string
    endBlock: string
    rawDataSize: string
    compressDataSize: string
    arweaveTx: string
    mutationCount: string
    time: string
    evmTx: string
    key: string
    pending: boolean
    cost: string
}

export type Dashboard = {
    mutationCount: string
    rollupCount: string
    mutationBytesNum: number
    mutationBytesLabel: string
    rollupBytesNum: number
    rollupBytesLabel: string
    mutationAvgCost: string
    rollupAvgCost: string
    compressRatio: string
    totalCostInUsd: string
}
