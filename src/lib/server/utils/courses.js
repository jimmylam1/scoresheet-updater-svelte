import { getACItemIconPath, getAvailableFrenzies, getDriverSkill, getPlacements, getSingles } from "./data"
import { getDataEntry, updateRow } from "./spreadsheet"
import { getCupUrl, getDkgUrl } from "./urls"
import trackUrls from "../../data/trackUrls.json"

export async function getCourses(spreadsheetId) {
    const data = await getDataEntry(spreadsheetId)
    const courses = []
    let cup = ''
    for (let i = 0; i < data.length; i++) {
        const row = data[i]
        if (i % 3 === 0)
            cup = row[0]
        const indices = [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 26, 22, 24, 20, 25]
        courses.push(course(i+3, cup, ...indices.map(i => row[i])))
    }
    return courses
}

function course(rowNum, cupName, trackName, driverName, driverLevel, driverPoints, kartName, kartLevel, kartPoints, gliderName, gliderLevel, gliderPoints, estScore, estAC, curScore, curAC, note) {
    return {
        rowNum,
        cupName,
        cupUrl: getCupUrl(cupName),
        trackName,
        trackUrl: trackUrls[trackName],
        driverName,
        driverLevel: parseInt(driverLevel),
        driverPoints: parseInt(driverPoints.replace(",", "")),
        driverIconUrl: getACItemIconPath(driverName),
        driverUrl: getDkgUrl(driverName, driverLevel, driverPoints.replace(",", ""), 'Driver'),
        kartName,
        kartLevel: parseInt(kartLevel),
        kartPoints: parseInt(kartPoints),
        kartUrl: getDkgUrl(kartName, kartLevel, kartPoints, 'Kart'),
        gliderName,
        gliderLevel: parseInt(gliderLevel),
        gliderPoints: parseInt(gliderPoints),
        gliderUrl: getDkgUrl(gliderName, gliderLevel, gliderPoints, 'Glider'),
        estScore: parseInt(estScore.replace(",", "")),
        curScore: parseInt(curScore.replace(",", "")) || 0,
        estAc: parseInt(estAC.replace(",", "")),
        curAc: parseInt(curAC.replace(",", "")) || 0,
        note: note,
        acIcon: getACItemIconPath(driverName),
        frenzyList: getAvailableFrenzies(driverName, trackName),
        singlesList: getSingles(getDriverSkill(driverName)),
        placementsList: getPlacements(trackName)
    }
}

export async function updateCourse(spreadsheetId, rowNum, frenzy1, frenzy2, frenzy3, box, fin, broke, ac, score, note) {
    await updateRow(spreadsheetId, rowNum, frenzy1, frenzy2, frenzy3, box, fin, broke, ac, score, note)
}