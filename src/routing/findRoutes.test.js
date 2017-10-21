import { stations, lines } from './mrt.json';
import findRoutes from './findRoutes';
import { getDistance, getAllLines, isAccessible, retrieveStation,
         getStringRep } from './findRoutes';

it('should go from origin to destination', () => {
	const results = findRoutes({ lat: 1.322522, lng: 103.815403 }, { lat: 1.29321, lng: 103.852216 });
	const steps = results[0].steps;
	expect(steps[0].from).toBe('origin');
	expect(steps[steps.length - 1].to).toBe('destination');
});


it('should return a number', () => {
    const dist = getDistance({ lat: 1.322422, lng: 103.815403 }, { lat: 1.29321, lng: 103.852216 });
    expect(typeof dist).toBe('number');
});


it('should retrieve all MRT lines', () => {
    const allLines = getAllLines();
    expect(allLines.length).toBe(Object.keys(lines).length);
});



it('should return the details of a specific station', () => {
    const station = retrieveStation('orchard');
    const target = { name: "Orchard", lat: 1.304292, lng: 103.832494 };
    expect(station.name).toBe(target.name);
    expect(station.lat).toBe(target.lat);
    expect(station.lng).toBe(target.lng);
});


it('should return the lowercase and underscored format of station name', () => {
    const withAsterisk = getStringRep("string with asterisk*");
    expect(withAsterisk).toBe("string_with_asterisk");

    const withDash = getStringRep("string-with-dash");
    expect(withDash).toBe("string_with_dash");

    const station = getStringRep("pasir ris");
    expect(station).toBe("pasir_ris");
});
