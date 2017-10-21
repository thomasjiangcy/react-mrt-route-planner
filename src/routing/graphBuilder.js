import { allLines } from './findRoutes';

/*
    Represent stations in graph structure:

        {
            "jurong_east": { adjacentTo: ["bukit_batok", "chinese_garden", "clementi"] },
            "clementi": { adjacentTo: ["jurong_east", "clementi"] },
            ...
        }

*/

export default function buildGraph() {

    const Graph = {};

    // Construct graph
    for (let i = 0; i < allLines.length; i++) {
        for (let j = 0; j < allLines[i].length; j++) {

            const line = allLines[i];
            // If station isn't inside graph, add it as a key
            if (Object.keys(Graph).indexOf(line[j]) === -1) {
                Graph[line[j]] = { adjacentTo: [] };
            }

            // Add the station before and after the station, if any
            if (line[j - 1] !== undefined &&
                Graph[line[j]].adjacentTo.indexOf(line[j - 1]) === -1) { Graph[line[j]].adjacentTo.push(line[j - 1]); }
            if (line[j + 1] !== undefined &&
                Graph[line[j]].adjacentTo.indexOf(line[j + 1]) === -1) { Graph[line[j]].adjacentTo.push(line[j + 1]); }

        }
    }

    return Graph;
}