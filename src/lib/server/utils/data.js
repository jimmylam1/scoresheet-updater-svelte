import driverItems from '../../data/driverItems.json'

export function getAvailableFrenzies(driver, trackName) {
    const skill = getDriverSkill(driver)
    let items = [
        skill,
        "Coin",
        "Mushroom",
        "Banana",
        "Bob-omb",
        "Green Shell",
        "Red Shell",
        "Mega Mushroom",
        "Super Horn",
        "Blooper",
        "Spiny Shell",
        "Bullet Bill",
        "Lightning"
    ]
    const battleItems = [
        skill,
        "Coin",
        "Mushroom",
        "Feather",
        "Banana",
        "Bob-omb",
        "Green Shell",
        "Red Shell",
        "Super Horn",
        "Blooper",
    ]
    if (isBattleTrack(trackName))
        items = battleItems
    if (skill === "Boomerang Flower")
        items.unshift("BoomBox")

    return items
}

export function isBattleTrack(trackName) {
    const battleTracks = [
        "GCN Cookie Land",
        "GBA Battle Course 1",
        "DS Twilight House",
        "New York Minute B",
        "Paris Promenade B"
    ]
    return battleTracks.includes(trackName)
}

export function getDriverSkill(driver) {
    return driverItems[driver]
}

export function getSingles(driverSkill) {
    const res = []
    if (driverSkill === 'Coin Box') {
        for (let i = 0; i < 6; i++) {
            res.push(`${i}`)
        }
    }
    else if (driverSkill === 'Lucky 7') {
        res.push("")
        res.push(`L7`)
        for (let i = 1; i < 5; i++) {
            res.push(`${i+1}L7`)
        }
    }
    else if (driverSkill === 'Boomerang Flower') {
        res.push("")
        res.push(`BB`)
        for (let i = 1; i < 3; i++) {
            res.push(`${i+1}BB`)
        }
    }
    return res
}

export function getPlacements(trackName) {
    const res = [
        '1st',
        '2nd',
        '3rd'
    ]
    if (isBattleTrack(trackName))
        res.push('WF')
    return res
}

export function getACItemIconPath(driverName) {
    const plusSkills = ['Coin Box', 'Lucky 7', 'Boomerang Flower', 'Giant Banana']
    const skill = getDriverSkill(driverName)
    if (driverName === 'Gold Mario')
        return '/images/items/Gold Mario.png'
    if (plusSkills.includes(skill))
        return `/images/items/${skill}.png`
    return '/images/items/base.png'
}
