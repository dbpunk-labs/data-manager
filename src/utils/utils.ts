//
// utils.ts
//
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

export function timeDifference(current: number, previous: number) {
    const sPerMinute = 60
    const sPerHour = sPerMinute * 60
    const sPerDay = sPerHour * 24
    const sPerMonth = sPerDay * 30
    const sPerYear = sPerDay * 365
    const elapsed = current - previous
    if (elapsed < sPerMinute) {
        return Math.round(elapsed) + ' seconds ago'
    } else if (elapsed < sPerHour) {
        return Math.round(elapsed / sPerMinute) + ' minutes ago'
    } else if (elapsed < sPerDay) {
        return Math.round(elapsed / sPerHour) + ' hours ago'
    } else if (elapsed < sPerMonth) {
        return Math.round(elapsed / sPerDay) + ' days ago'
    } else if (elapsed < sPerYear) {
        return Math.round(elapsed / sPerMonth) + ' months ago'
    } else {
        return Math.round(elapsed / sPerYear) + ' years ago'
    }
}

export function bytesToReadableNumRaw(
    bytes_size_str: string
): [number, string] {
    const bytes_size = Number(bytes_size_str)
    const STORAGE_LABELS: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
    const max_shift = 7
    var shift = 0
    var local_bytes_size = bytes_size
    var value = bytes_size
    local_bytes_size >>= 10
    while (local_bytes_size > 0 && shift < max_shift) {
        value /= 1024.0
        shift += 1
        local_bytes_size >>= 10
    }
    return [value.toFixed(2), STORAGE_LABELS[shift]]
}

export function bytesToReadableNum(bytes_size_str: string): string {
    const [value, label] = bytesToReadableNumRaw(bytes_size_str)
    return value + label
}

export function arToReadableNum(units: string): string {
    return (Number(BigInt(units) / BigInt(1000_000)) / 1000_000.0).toFixed(4)
}

export function evmUnitsToReadableNum(units: string): string {
    return (
        Number(BigInt(units) / BigInt(1000_000_000)) / 1000_000_000.0
    ).toFixed(4)
}

export function shortString(id: string, limit: number) {
    if (id.length > limit) {
        return (
            id.substring(0, limit / 2) +
            '...' +
            id.substring(id.length - limit / 2)
        )
    } else {
        return id
    }
}
