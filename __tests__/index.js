test(`GET http://localhost:4000/api/lg`, async() => {
    const response = await fetch('http://localhost:4000/api/lg', {
        method: 'GET'
    });
    const result = await response.text();
    expect(result).toBe('Life is good!');
});

test(`Return id, status and package of data where:
    - id is greater than 5 and less than 30
    - status matches the regular expression /under/
    - package is 'free'
    To equal [
        { id: 9, status: 'under review', package: 'free' },
        { id: 11, status: 'under review', package: 'free' },
        { id: 16, status: 'under review', package: 'free' }
    ]`, async() => {
    const response = await fetch('http://localhost:4000/api/app-users?pageLimit=5&pageNumber=1', {
        method: 'GET',
        headers: {
            'Syntaxe-Resolve-Schema':
            btoa(`{
                id [gt:5] [lt:30]
                status [regex:/under/]
                package [eq:"free"]
            }`)
        }
    });
    const result = await response.json();
    expect(result).toEqual({
        data: [
            { id: 9, status: 'under review', package: 'free' },
            { id: 11, status: 'under review', package: 'free' },
            { id: 16, status: 'under review', package: 'free' }
        ],
        pages: 1
    });
});