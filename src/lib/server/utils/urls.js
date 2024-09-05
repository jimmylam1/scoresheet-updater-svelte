import trackUrls from '../../data/trackUrls.json'

/**
 * 
 * @param {string} name 
 * @param {string | number} level 
 * @param {string | number} points 
 * @param {'Driver' | 'Kart' | 'Glider'} type 
 * @returns 
 */
export function getDkgUrl(name, level, points, type) {
    name = name.replace(/ /g, "_").replace('&', 'and').replace("'", "%27")
    return `https://larry98.com/Pictures/${type}/FrameLVLCap/${name}/Regular/${name}-LVL${level}-${points}.png`
}

export function getCupUrl(name) {
    name = name.replace(/ /g, "_").replace("'", "%27")
    return `https://larry98.com/Pictures/Cups/${name}.png`
}

export function getTrackUrl(name) {
    return trackUrls[name]
}