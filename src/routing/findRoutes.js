import { stations, lines } from './mrt.json';
import buildGraph from './graphBuilder';

/*
    Returns the best routes between the origin and destination.

    Arguments origin and destination are { lat, lng } objects.
    Returns an array of the best routes. You may define "best" using any reasonable metric and document your definition.

    Each route is an object which must contain a "steps" array. You may add additional properties as needed.
    Each step can represent a "walk", "ride" or "change", and must have at least the following properties:
    - { type: "walk", from: <stationId> or "origin", to: <stationId> or "destination" }
    - { type: "ride", line: <lineId>, from: <stationId>, to: <stationId> }
    - { type: "change", station: <stationId>, from: <lineId>, to: <lineId> }
    You may add additional properties as needed.

    Example:

    findRoutes({ lat: 1.322522, lng: 103.815403 }, { lat: 1.29321, lng: 103.852216 })

    should return something like:

    [
        { steps: [
            { type: "walk", from: "origin", to: "botanic_gardens" },
            { type: "ride", line: "CC", from: "botanic_gardens", to: "buona_vista" },
            { type: "change", station: "buona_vista", from: "CC", to: "EW" },
            { type: "ride", line: "EW", from: "buona_vista", to: "bugis" },
            { type: "walk", from: "bugis", to: "destination" }
        ] },
        { steps: [
            // worse route
        ] }
    ]

*/

/*
    API
    ---
*/

export default function findRoutes(origin, destination) {

    const routes = getRoutes(origin, destination);

    if (!Object.keys(routes).includes("error")) {
        const suggestedRoutes = generateSuggestions(routes, origin, destination);
        return suggestedRoutes;
    }

    return routes;
}


/*
    Core
    ----
*/

export function getRoutes(origin, destination) {
    /*
        Algorithm
        ---------
        1) Find all possible routes from origin to destination
        2) Take top 5 routes that have the LEAST NUMBER OF STOPS
        3) For the 5 routes, get each of their combined distance based on lat lng
        4) Sort the 5 routes again by shortest distance
        5) Return sorted routes
    */
    const MRTGraph = buildGraph(); // Create graph representation of all stations

    // Given lat lng, find the closest station to origin and destination
    const startStation = getClosestStation(origin);
    const endStation = getClosestStation(destination);

    if (startStation === endStation) return {"error": `Origin and destination share the same nearest MRT: ${startStation.name}. You might want to walk there instead.`}

    // Set the start and end nodes by using their string representations: e.g. "pasir_ris"
    const startNode = getStringRep(startStation.name);
    const endNode = getStringRep(endStation.name);

    /* Internal helper functions
     * ---------------------------------------------------------------------
    */
    function findAllPaths(MRTGraph, startNode, endNode, path=[]) {
        path = path.slice() // make a copy
        path.push(startNode);

        if (startNode === endNode) return [path]; // if destination reached, return the path

        if (!Object.keys(MRTGraph).includes(startNode)) return []; // if node not valid - return empty array

        let paths = []; // overall path storage

        // Loop through all adjacent nodes of current node and find their adjacent nodes.
        // Recursively loop through all subsequent adjacent nodes to create individual paths.
        // Add these paths to the overall `paths` variable
        for (let node of MRTGraph[startNode].adjacentTo) {
            if (!path.includes(node)) {
                let newPaths = findAllPaths(MRTGraph, node, endNode, path);

                if (newPaths.length > 0) {
                    for (let path of newPaths) {
                        paths.push(path);
                    }
                }
            }
        }

        return paths;
    }

    function calcDistance(sortedRoutes) {
        let distance = {};

        for (let i = 0; i < sortedRoutes.length; i++) {
            distance[sortedRoutes[i]] = sortedRoutes[i]
                                            .map((station, i, arr) => {
                                                if (arr[i + 1] !== undefined) {
                                                    const curr = retrieveStation(station);
                                                    const next = retrieveStation(arr[i + 1]);
                                                    return getDistance(curr, next);
                                                }
                                                return null;
                                            })
                                            .reduce((acc, curr) => {
                                                if (curr === undefined) curr = 0;
                                                return acc + curr
                                            });
        }

        return distance;
    }
    /*
     * ---------------------------------------------------------------------
    */

    // 1) Get all possible routes
    let Routes = findAllPaths(MRTGraph, startNode, endNode);

    // 2) Get top 5 routes after sorted in `asc` by number of stops
    let sortedRoutes = Routes.sort((a, b) => {
        return a.length - b.length;
    }).slice(0, 5); // take shortest 5 routes

    // 3) Get combined distance for each route
    let routesWithTotalDistance = calcDistance(sortedRoutes);

    // 4) Sort by distance
    let sortByDistance = sortedRoutes.sort((a, b) => {
        const distA = routesWithTotalDistance[a];
        const distB = routesWithTotalDistance[b];
        return distA - distB;
    });

    return sortByDistance;
}


export function generateSuggestions(routes, origin, destination) {

    /*
     * Internal helper function
     * -------------------------
    */
    function calcStopsBetween(route, start, end) {
        const startIndex = route.indexOf(start);
        const endIndex = route.indexOf(end);

        return Math.abs(startIndex - endIndex) - 1;
    }
    /*
     * -------------------------
    */


    let suggestions = [];

    for (let route of routes) {
        let steps = { steps: [
                { type: "walk", from: "origin", to: route[0], distance: getDistance(origin, retrieveStation(route[0])) }
            ] };

        let currStation = route[0];
        let currLine = getLine(currStation, route[1]);
        
        for (let i = 0; i < route.length; i++) {
            let step = {};

            if (route[i + 1] !== undefined) {
                const _currLine = getLine(route[i], route[i + 1])
                if (_currLine !== currLine) {
                    // transit stop
                    step["type"] = "ride";
                    step["line"] = currLine;
                    step["from"] = currStation;
                    step["to"] = route[i];
                    step["stops_between"] = calcStopsBetween(route, currStation, route[i]);
                    steps.steps.push(step);

                    step = {}; // reset
                    let prevLine = currLine; // save last line
                    currLine = _currLine;
                    currStation = route[i];
                    step["type"] = "change";
                    step["station"] = route[i];
                    step["from"] = prevLine;
                    step["to"] = currLine;
                    steps.steps.push(step);
                }
            } else {
                // Last stop
                step["type"] = "ride";
                step["line"] = currLine;
                step["from"] = currStation;
                step["to"] = route[i];
                step["stops_between"] = calcStopsBetween(route, currStation, route[i]);
                steps.steps.push(step);

                step = {}; // reset
                step["type"] = "walk";
                step["from"] = route[i];
                step["to"] = "destination";
                step["distance"] = getDistance(retrieveStation(route[i]), destination)
                steps.steps.push(step);
            }
        }

        suggestions.push(steps);
    }

    return suggestions;
}



/*
    Helpers
    -------
*/

export const allLines = getAllLines();

/*
 * Calculates the distance between two points using the Haversine formula

   point1: { lat: float, lng: float }
   point2: { lat: float, lng: float }
*/
export function getDistance(point1, point2) {
    // Using Haversine formula
    // https://en.wikipedia.org/wiki/Haversine_formula

    const y1 = point1.lat;
    const x1 = point1.lng;
    const y2 = point2.lat;
    const x2 = point2.lng;

    const R = 6378.137; // Radius of earth in KM

    const dLat = (y2 * Math.PI / 180) - (y1 * Math.PI / 180);
    const dLon = (x2 * Math.PI / 180) - (x1 * Math.PI / 180);

    const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
              (Math.cos(y1 * Math.PI / 180) *
               Math.cos(y2 * Math.PI / 180) *
               Math.sin(dLon / 2) *
               Math.sin(dLon / 2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const dist = R * c;

    return dist * 1000; // meters
}


/*
 * Retrieves all MRT lines into an array of arrays
*/
export function getAllLines() {
    const allLineKeys = Object.keys(lines);
    let allLines = [];

    for (let key of allLineKeys) {
        let line = lines[key].route;
        allLines.push(line);
    }

    return allLines;
}

/*
 * Retrieves a specific station's details as in the format of 
   each station in `stations`.

   station: string;
*/
export function retrieveStation(station) {
    return stations[station];
}


/*
 * Given lat, lng - retrieve the closest MRT station
   
   coordinates: { lat: number, lng: number }
*/
export function getClosestStation(coordinates) {
    // Get all stations into array
    const stationNames = Object.keys(stations);
    let allStations = [];

    for (let i of stationNames) {
        allStations.push(stations[i]);
    }

    // retrieve lat long
    let curr = allStations[0];

    for (let station of allStations) {
        if (getDistance(coordinates, station) < getDistance(coordinates, curr)) {
            curr = station;
        }       
    }

    let destination;

    for (let i of stationNames) {
        if (stations[i].name === curr.name) {
            destination = stations[i];
        }
    }

    return destination;
}


/*
 * Retrieves current line
*/
export function getLine(curr, next) {
    const allLineKeys = Object.keys(lines);

    for (let line of allLineKeys) {
        const _line = lines[line].route
        if (_line.includes(curr)) {
            const currIndex = _line.indexOf(curr);
            const nextIndex = _line.indexOf(next);

            if (nextIndex > -1) {
                if (Math.abs(currIndex - nextIndex) === 1) return line;
            }
        }
    }
}


/*
 * Retrieves string representation of station.
   e.g. `pasir_ris`

   station: string
*/
export function getStringRep(station) {

    const name = station; // ensure it is string
    let _split;

    if (name.indexOf("-") > -1) {
        _split = name.split("-");
    } else if (name.indexOf("*") > -1) {
        let noStar = name.slice(0, name.indexOf("*"));
        _split = noStar.split(" ");
    } else {
        _split = name.split(" ");
    }

    let processed = [];

    for (let word of _split) {
        processed.push(word.toLowerCase());
    }

    let joined = processed.join("_");

    return joined
}