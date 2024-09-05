
export function percent(cur, est) {
    return `${Math.round(100*cur/est)}%`
}

export function roundToThousands(val) {
    return val.toLocaleString()
}

export function diff(val1, val2, commas=false) {
    if (typeof val1 === 'string')
        val1 = parseInt(val1)
    if (typeof val2 === 'string')
        val2 = parseInt(val2)
    const d = val1 - val2
    const sign = d >= 0 ? '+' : ''
    const dText = commas ? d.toLocaleString() : d.toString()
    return `${sign}${dText}`
}

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}