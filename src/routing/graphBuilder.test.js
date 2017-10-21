import { stations } from './mrt.json';
import buildGraph from './graphBuilder';

it('should build a graph of all MRT stations', () => {
    const mrtGraph = buildGraph();
    const stations = Object.keys(mrtGraph);
    const allStations = Object.keys(stations);

    expect(stations.length).toBe(allStations.length);

});