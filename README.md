<br  />
<!-- <p align="center"> -->
<!-- <a  href="tile38-ts.png">
<img  src="tile38-ts.png"  alt="Logo"  width="487"  height="281">
</a> -->
<h1 align="center">Tile38-ts</h1>
<p align="center">
<a  href="https://github.com/iwpnd/tile38-ts/issues">Report Bug</a>
· <a  href="https://github.com/iwpnd/tile38-ts/issues">Request Feature</a>
</p>
</p>
<details  open="open">
<summary>Table of Contents</summary>
<ol>
<li>
<a  href="#about-the-project">About The Project</a>
<ul>
<li><a  href="#built-with">Built With</a></li>
</ul>
</li>
<li>
<a  href="#getting-started">Getting Started</a>
<ul>
<li><a  href="#requirements">Requirements</a></li>
<li><a  href="#installation">Installation</a></li>
</ul>
</li>
<li><a  href="#commands">Commands</a></li>
<ul>
<li><a  href="#keys">Keys</a></li>
<li><a  href="#search">Search</a></li>
<li><a  href="#geofencing">Geofencing</a></li>
<li><a  href="#server">Server / Connection</a></li>
</ul>
<li><a  href="#roadmap">Roadmap</a></li>
<li><a  href="#contributing">Contributing</a></li>
<li><a  href="#license">License</a></li>
<li><a  href="#contact">Maintainer</a></li>
<li><a  href="#acknowledgements">Acknowledgements</a></li>
</ol>
</details>

## About The Project

This is a Typescript client for Tile38 that allows for a type-safe interaction with the worlds fastest in-memory geodatabase [Tile38](https://www.tile38.com).

### Features

-   fully typed
-   lazy client
-   optional build-in leader/follower logic
-   easy to use and integrate
-   no external dependencies other than redis
-   build in auto-pagination

### Built With

-   [ioredis](https://www.npmjs.com/package/ioredis)

## Getting Started

### Requirements

```sh
"node": ">=20.x"
"ioredis" ">=5.0.0"
```

### Installation

```sh
yarn add @iwpnd/tile38-ts
```

### Import

```typescript
import { Tile38 } from '@iwpnd/tile38-ts';

const tile38 = new Tile38('leader:9851');
```

### Leader / Follower

When it comes to replication, Tile38 follows a leader-follower model. The leader receives all commands that `SET` data, a follower on the other hand is `read-only` and can only query data. For more on replication in Tile38 refer to the [official documentation](https://tile38.com/topics/replication).

This client is not meant to setup a replication, because this should happen in your infrastructure. But it helps you to specifically execute commands on leader or follower. This way you can make sure that the leader always has enough resources to execute `SET`s and fire `geofence` events on `webhooks`.

For now we allow for one follower `URI` to bet set alongside the leader `URI`.

```typescript
const tile38 = new Tile38('leader:9851', 'follower:9851');
```

Once the client is instantiated with a follower, commands can be explicitly send
to the follower, but adding `.follower()` to your command chaining.

```typescript
await tile38.follower().get('fleet', 'truck1').asObjects();
```

### Options

We expose `ioredis` [RedisOptions](https://redis.github.io/ioredis/index.html#RedisOptions).

```typescript
new Tile38(
    'leader:9851',
    'follower:9851',
    // e.g. to set a retry strategy
    {
        retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
        },
    }
);
```

### Events

We expose `ioredis` [Events](https://github.com/redis/ioredis#events).

```typescript
new Tile38()
    .on('connect', () => console.log('connected'))
    .on('error', console.error);
```

### Pagination

Tile38 has hidden limits set for the amount of objects that can be returned in one request. For most queries/searches this limit is set to `100`. This client gives you the option to either paginate the results yourself by add `.cursor()` and `.limit()` to your queries, or it abstracts pagination away from the user by adding `.all()`.

Let's say your `fleet` in `Berlin` extends 100 vehicles, then

```typescript
await tile38.within('fleet').get('cities', 'Berlin').asObjects();
```

will only return 100 vehicle objects. Now you can either get the rest by setting the limit to the amount of vehicles you have in the city and get them all.

```typescript
await tile38.within('fleet').limit(10000).get('cities', 'Berlin').asObjects();
```

Or, you can paginate the results in multiple concurrent requests to fit your requirements.

```typescript
await tile38
    .within('fleet')
    .cursor(0)
    .limit(100)
    .get('cities', 'Berlin')
    .asObjects();
await tile38
    .within('fleet')
    .cursor(100)
    .limit(100)
    .get('cities', 'Berlin')
    .asObjects();
await tile38
    .within('fleet')
    .cursor(200)
    .limit(100)
    .get('cities', 'Berlin')
    .asObjects();
```

Or, you use `.all()` to get all objects with a concurrency of 1 and a limit of 100:

```typescript
await tile38
    .follower()
    .within('fleet')
    .get('cities', 'Berlin')
    .all()
    .asObjects();
```

## Commands

### Keys

#### SET

Set the value of an id. If a value is already associated to that key/id, it'll be overwritten.

```typescript
await tile38
    .set('fleet', 'truck1')
    .fields({ maxSpeed: 90, milage: 90000 })
    .point(33.5123, -112.2693)
    .exec();

await tile38.set('fleet', 'truck1:driver').string('John Denton').exec();
```

**Options**
|| |
|--|--|
| `.fields()` | Optional additional fields. **MUST BE** numerical|
| `.ex(value)` | Set the specified expire time, in seconds.|
| `.nx()` | Only set the object if it does not already exist.|
| `.xx()` | Only set the object if it already exist.|

**Input**
| | |
|--|--|
| `.point(lat, lon)` | Set a simple point in latitude, longitude |
| `.bounds(minlat, minlon, maxlat, maxlon)` | Set as minimum bounding rectangle |
| `.object(feature)` | Set as feature |
| `.hash(geohash)` | Set as geohash |
| `.string(value)` | Set as string. To retrieve string values you can use `.get()`, `scan()` or `.search()` |

#### FSET

Set the value for one or more fields of an object. Fields must be double precision floating points. Returns the integer count of how many fields changed their values.

```typescript
await tile38.fSet('fleet', 'truck1', { maxSpeed: 90, milage: 90000 });
```

#### FEXISTS

Validate if field exists on id.

```typescript
await tile38
    .set('fleet', 'truck1')
    .fields({ weight: 9001 })
    .point(33.5123, -112.2693)
    .exec();

let response = await tile38.fexists('fleet', 'truck1', 'weight');
console.log(response.exists);
// > true

response = await tile38.fexists('fleet', 'truck1', 'milage');
console.log(response.exists);
// > false
```

**Options**

| command | description                                                                                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.xx()` | `FSET` returns error if fields are set on non-existing ids. `xx()` options changes this behaviour and instead returns `0` if id does not exist. If key does not exist `FSET` still returns error |

#### GET

Get the object of an id.

```typescript
await tile38.get('fleet', 'truck1').asObject();
```

Get the object as string if set as string

```typescript
await tile38.set('fleet', 'truck1:driver').string('John').exec();
await tile38.get('fleet', 'truck1').asString();
```

**Options**

| command         | description                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.withFields()` | will also return the [fields](https://tile38.com/commands/set#fields) that belong to the object. Field values that are equal to zero are omitted. |

**Output**

| command              | description                       |
| -------------------- | --------------------------------- |
| `.asObject()`        | (default) get as object           |
| `.asBounds()`        | get as minimum bounding rectangle |
| `.asHash(precision)` | get as hash                       |
| `.asPoint()`         | get as point                      |
| `.asString()`        | get as string                     |

#### EXISTS

Validate id exists.

```typescript
await tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec();

let response = await tile38.exists('fleet', 'truck1');
console.log(response.exists);
// > true

response = await tile38.exists('fleet', 'truck2');
console.log(response.exists);
// > false
```

#### DEL

Remove a specific object by key and id.

```typescript
await tile38.del('fleet', 'truck1');
```

#### PDEL

Remove objects that match a given pattern.

```typescript
await tile38.pDel('fleet', 'truck*');
```

#### DROP

Remove all objects in a given key.

```typescript
await tile38.drop('fleet');
```

#### BOUNDS

Get the minimum bounding rectangle for all objects in a given key

```typescript
await tile38.bounds('fleet');
```

#### EXPIRE

Set an expiration/time to live in seconds of an object.

```typescript
await tile38.expire('fleet', 'truck1', 10);
```

#### TTL

Get the expiration/time to live in seconds of an object.

```typescript
await tile38.ttl('fleet', 'truck1', 10);
```

#### PERSIST

Remove an existing expiration/time to live of an object.

```typescript
await tile38.persist('fleet', 'truck1');
```

#### KEYS

Get all keys matching a glob-style-pattern. Pattern defaults to `'*'`

```typescript
await tile38.keys();
```

#### STATS

Return stats for one or more keys.
The returned `stats` array contains one or more entries, depending on the number of keys in the request.

```typescript
await tile38.stats('fleet1', 'fleet2');
```

**Returns**

| stat             | description                                     |
| ---------------- | ----------------------------------------------- |
| `in_memory_size` | estimated memory size in bytes                  |
| `num_objects`    | objects in the given key                        |
| `num_points`     | number of geographical objects in the given key |

#### JSET/JSET/JDEL

Set a value in a JSON document.
JGET, JSET, and JDEL allow for working with JSON strings

```typescript
await tile38.jSet('user', 901, 'name', 'Tom');
await tile38.jGet('user', 901);
> {'name': 'Tom'}

await tile38.jSet('user', 901, 'name.first', 'Tom');
await tile38.jSet('user', 901, 'name.first', 'Anderson');
await tile38.jGet('user', 901);
> {'name': { 'first': 'Tom', 'last': 'Anderson' }}

await tile38.jDel('user', 901, 'name.last');
await tile38.jGet('user', 901);
> {'name': { 'first': 'Tom' }}
```

#### RENAME

Renames a collection `key` to `newKey`.

**Options**

| command | description                                                                      |
| ------- | -------------------------------------------------------------------------------- |
| `.nx()` | Default: false. Changes behavior on how renaming acts if `newKey` already exists |

If the `newKey` already exists it will be deleted prior to renaming.

```typescript
await tile38.rename('fleet', 'newFleet', false);
```

If the `newKey` already exists it will do nothing.

```typescript
await tile38.rename('fleet', 'newFleet', true);
```

### Search

Searches are [Tile38](https://tile38.com/) bread and butter. They are what make Tile38 a ultra-fast, serious and cheap alternative to [PostGIS](https://postgis.net/) for a lot of use-cases.

#### WITHIN

`WITHIN` searches a key for objects that are fully contained within a given bounding area.

```typescript
await tile38.within('fleet').bounds(33.462, -112.268,  33.491, -112.245);
>{"ok":true,"objects":[{"id":"1","object":{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.2693, 33.5123]},"properties":{}}}],"count":1,"cursor":1,"elapsed":"72.527µs"}

await tile38.within('fleet').noFields().asCount()
> {"ok":true,"count":205,"cursor":0,"elapsed":"2.078168ms"}

await tile38.within('fleet').get('warehouses', 'Berlin').asCount();
> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}

await tile38.within('fleet').buffer(100).get('warehouses', 'Berlin').asCount();
> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}

await tile38
    .within('fleet')
    .where('weight', 1000, 1200)
    .get('warehouses', 'Berlin').asCount();
> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}

await tile38
    .within('fleet')
    .whereIn('weight', [1000, 1001, 1002])
    .get('warehouses', 'Berlin').asCount();

> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}

await tile38
    .within('fleet')
    .whereExpr("weight == 1000")
    .get('warehouses', 'Berlin').asCount();

> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}
```

**Options**

| command                                   | description                                                                                                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.cursor(value?)`                         | used to iterate through your search results. Defaults to `0` if not set explicitly                                                                                          |
| `.limit(value?)`                          | limit the number of returned objects. Defaults to `100` if not set explicitly                                                                                               |
| `.noFields()`                             | if not set and one of the objects in the key has fields attached, fields will be returned. Use this to suppress this behavior and don't return fields.                      |
| `.match(pattern?)`                        | Match can be used to filtered objects considered in the search with a glob pattern. `.match('truck*')` e.g. will only consider ids that start with `truck` within your key. |
| `.sparse(value)`                          | **caution** seems bugged since Tile38 1.22.6. Accepts values between 1 and 8. Can be used to distribute the results of a search evenly across the requested area.           |
| `.buffer(value)`                          | Apply a buffer around area formats to increase the search area by x meters                                                                                                  |
| `.where(fieldname, min value, max value)` | filter output by fieldname and values.                                                                                                                                      |
| `.wherein(fieldname, values)`             | filter output by fieldname and values. Returns if field value in list of values.                                                                                            |
| `.whereExpr(expr)`                        | filter output with [filter-expression](https://tile38.com/topics/filter-expressions).                                                                                       |

**Outputs**

| command                | description                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.asObjects()`         | return as array of objects                                                                                                                                                         |
| `.asBounds()`          | return as array of minimum bounding rectangles: `{"id": string,"bounds":{"sw":{"lat": number,"lon": number},"ne":{"lat": number,"lon": number}}}`                                  |
| `.asCount()`           | returns a count of the objects in the search                                                                                                                                       |
| `.asHashes(precision)` | returns an array of `{"id": string,"hash": string}`                                                                                                                                |
| `.asIds()`             | returns an array of ids                                                                                                                                                            |
| `.asPoints()`          | returns objects as points: `{"id": string,"point":{"lat": number,"lon": number}`. If the searched key is a collection of `Polygon` objects, the returned points are the centroids. |

**Query**

| command                                   | description                                                                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `.get(key, id)`                           | Search a given stored item in a collection.                                                                            |
| `.circle(lat, lon, radius)`               | Search a given circle of latitude, longitude and radius.                                                               |
| `.bounds(minLat, minLon, maxLat, maxLon)` | Search a given bounding box.                                                                                           |
| `.hash(value)`                            | Search a given [geohash](https://en.wikipedia.org/wiki/Geohash).                                                       |
| `.quadkey(value)`                         | Search a given [quadkey](https://docs.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system?redirectedfrom=MSDN) |
| `.tile(x, y, z)`                          | Search a given [tile](https://en.wikipedia.org/wiki/Tiled_web_map#Defining_a_tiled_web_map)                            |
| `.object(value)`                          | Search a given GeoJSON polygon feature.                                                                                |

#### INTERSECTS

Intersects searches a key for objects that are fully contained within a given bounding area, but also returns those that intersect the requested area.
When used to search a collection of keys consisting of `Point` objects (e.g. vehicle movement data) it works like a `.within()` search as `Points` cannot intersect.
When used to search a collection of keys consisting of `Polygon` or `LineString` it also returns objects, that only partly overlap the requested area.

```typescript
await  tile38.intersects('warehouses').hash('u33d').asObjects();

await tile38.intersects('fleet').get('warehouses', 'Berlin').asIds();
> {"ok":true,"ids":["truck1"],"count":1,"cursor":0,"elapsed":"2.078168ms"}

await tile38
    .intersects('fleet')
    .where('weight', 1000, 1200)
    .get('warehouses', 'Berlin').asCount();
> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}

await tile38
    .intersects('fleet')
    .whereIn('weight', [1000, 1001, 1002])
    .get('warehouses', 'Berlin').asCount();

> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}

await tile38
    .intersects('fleet')
    .whereExpr("weight == 1000")
    .get('warehouses', 'Berlin').asCount();

> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}
```

**Options**

| command                                   | description                                                                                                                                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.clip()`                                 | Tells Tile38 to clip returned objects at the bounding box of the requested area. Works with `.bounds()`, `.hash()`, `.tile()` and `.quadkey()`                                      |
| `.cursor(value?)`                         | used to iterate through your search results. Defaults to `0` if not set explicitly                                                                                                  |
| `.limit(value?)`                          | limit the number of returned objects. Defaults to `100` if not set explicitly                                                                                                       |
| `.noFields()`                             | if not set and one of the objects in the key has fields attached, fields will be returned. Use this to suppress this behavior and don't return fields.                              |
| `.match(pattern?)`                        | Match can be used to filtered objects considered in the search with a glob pattern. `.match('warehouse*')` e.g. will only consider ids that start with `warehouse` within your key. |
| `.sparse(value)`                          | **caution** seems bugged since Tile38 1.22.6. Accepts values between 1 and 8. Can be used to distribute the results of a search evenly across the requested area.                   |
| `.buffer(value)`                          | Apply a buffer around area formats to increase the search area by x meters                                                                                                          |
| `.where(fieldname, min value, max value)` | filter output by fieldname and values.                                                                                                                                              |
| `.wherein(fieldname, values)`             | filter output by fieldname and values. Returns if field value in list of values.                                                                                                    |
| `.whereExpr(expr)`                        | filter output with [filter-expression](https://tile38.com/topics/filter-expressions).                                                                                               |

**Outputs**

| command                | description                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.asObjects()`         | return as array of objects                                                                                                                                                         |
| `.asBounds()`          | return as array of minimum bounding rectangles: `{"id": string,"bounds":{"sw":{"lat": number,"lon": number},"ne":{"lat": number,"lon": number}}}`                                  |
| `.asCount()`           | returns a count of the objects in the search                                                                                                                                       |
| `.asHashes(precision)` | returns an array of `{"id": string,"hash": string}`                                                                                                                                |
| `.asIds()`             | returns an array of ids                                                                                                                                                            |
| `.asPoints()`          | returns objects as points: `{"id": string,"point":{"lat": number,"lon": number}`. If the searched key is a collection of `Polygon` objects, the returned points are the centroids. |

**Query**

| command                                   | description                                                                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `.get(key, id)`                           | Search a given stored item in a collection.                                                                            |
| `.circle(lat, lon, radius)`               | Search a given circle of latitude, longitude and radius.                                                               |
| `.bounds(minLat, minLon, maxLat, maxLon)` | Search a given bounding box.                                                                                           |
| `.hash(value)`                            | Search a given [geohash](https://en.wikipedia.org/wiki/Geohash).                                                       |
| `.quadkey(value)`                         | Search a given [quadkey](https://docs.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system?redirectedfrom=MSDN) |
| `.tile(x, y, z)`                          | Search a given [tile](https://en.wikipedia.org/wiki/Tiled_web_map#Defining_a_tiled_web_map)                            |
| `.object(value)`                          | Search a given GeoJSON polygon feature.                                                                                |

#### Nearby

```typescript
await tile38.set('fleet', 'truck1').point(33.5123, -112.2693).exec();

await  tile38.nearby('fleet').point(33.5124, -112.2694).asCount();
> {"ok":true,"count":1,"cursor":0,"elapsed":"42.8µs"}

await  tile38.nearby('fleet').point(33.5124, -112.2694, 10).asCount();
// because truck1 is further away than 10m
> {"ok":true,"count":0,"cursor":0,"elapsed":"36µs"}

// asIds request
await  tile38.nearby('fleet').point(33.5124, -112.2694).asIds();
> {"ok":true,"ids":['truck1'],"cursor":0,"elapsed":"36µs"}
// asIds with distance
await  tile38.nearby('fleet').distance().point(33.5124, -112.2694).asIds();
> {"ok":true,"ids":[{ "id":"truck1", "distance": 1 }],"cursor":0,"elapsed":"36µs"}

await tile38
    .nearby('fleet')
    .where('weight', 1000, 1200)
    .point(33.5124, -112.2694, 10).asCount();

> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}

await tile38
    .nearby('fleet')
    .whereIn('weight', [1000, 1001, 1002])
    .point(33.5124, -112.2694, 10).asCount();
> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}

await tile38
    .nearby('fleet')
    .whereExpr("weight == 1000")
    .point(33.5124, -112.2694, 10).asCount();

> {"ok":true,"count":50,"cursor":0,"elapsed":"2.078168ms"}
```

**Options**

| command                                   | description                                                                                                                                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.distance()`                             | Returns the distance in `meters` to the object from the query `.point()`                                                                                                            |
| `.cursor(value?)`                         | used to iterate through your search results. Defaults to `0` if not set explicitly                                                                                                  |
| `.limit(value?)`                          | limit the number of returned objects. Defaults to `100` if not set explicitly                                                                                                       |
| `.noFields()`                             | if not set and one of the objects in the key has fields attached, fields will be returned. Use this to suppress this behavior and don't return fields.                              |
| `.match(pattern?)`                        | Match can be used to filtered objects considered in the search with a glob pattern. `.match('warehouse*')` e.g. will only consider ids that start with `warehouse` within your key. |
| `.sparse(value)`                          | **caution** seems bugged since Tile38 1.22.6. Accepts values between 1 and 8. Can be used to distribute the results of a search evenly across the requested area.                   |
| `.where(fieldname, min value, max value)` | filter output by fieldname and values.                                                                                                                                              |
| `.wherein(fieldname, values)`             | filter output by fieldname and values. Returns if field value in list of values.                                                                                                    |
| `.whereExpr(expr)`                        | filter output with [filter-expression](https://tile38.com/topics/filter-expressions).                                                                                               |

**Outputs**

| command                | description                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.asObjects()`         | return as array of objects                                                                                                                                                         |
| `.asBounds()`          | return as array of minimum bounding rectangles: `{"id": string,"bounds":{"sw":{"lat": number,"lon": number},"ne":{"lat": number,"lon": number}}}`                                  |
| `.asCount()`           | returns a count of the objects in the search                                                                                                                                       |
| `.asHashes(precision)` | returns an array of `{"id": string,"hash": string}`                                                                                                                                |
| `.asIds()`             | returns an array of ids                                                                                                                                                            |
| `.asPoints()`          | returns objects as points: `{"id": string,"point":{"lat": number,"lon": number}`. If the searched key is a collection of `Polygon` objects, the returned points are the centroids. |

**Query**

| command                     | description                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `.point(lat, lon, radius?)` | Search nearby a given of latitude, longitude. If radius is set, searches nearby the given radius. |

#### Scan

Incrementally iterate through a given collection key.

```typescript
await tile38.scan('fleet');

await tile38.scan('fleet').where('foo', 1, 2);
await tile38.scan('fleet').wherein('foo', [1, 2]);
await tile38.scan('fleet').whereExpr('foo == 1');
```

**Options**

| command                                   | description                                                                                                                                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.asc()`                                  | Values are returned in ascending order. Default if not set.                                                                                                                         |
| `.desc()`                                 | Values are returned in descending order.                                                                                                                                            |
| `.cursor(value?)`                         | used to iterate through your search results. Defaults to `0` if not set explicitly                                                                                                  |
| `.limit(value?)`                          | limit the number of returned objects. Defaults to `100` if not set explicitly                                                                                                       |
| `.noFields()`                             | if not set and one of the objects in the key has fields attached, fields will be returned. Use this to suppress this behavior and don't return fields.                              |
| `.match(pattern?)`                        | Match can be used to filtered objects considered in the search with a glob pattern. `.match('warehouse*')` e.g. will only consider ids that start with `warehouse` within your key. |
| `.where(fieldname, min value, max value)` | filter output by fieldname and values.                                                                                                                                              |
| `.wherein(fieldname, values)`             | filter output by fieldname and values. Returns if field value in list of values.                                                                                                    |
| `.whereExpr(expr)`                        | filter output with [filter-expression](https://tile38.com/topics/filter-expressions).                                                                                               |

**Outputs**

| command                | description                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.asObjects()`         | return as array of objects                                                                                                                                                         |
| `.asBounds()`          | return as array of minimum bounding rectangles: `{"id": string,"bounds":{"sw":{"lat": number,"lon": number},"ne":{"lat": number,"lon": number}}}`                                  |
| `.asCount()`           | returns a count of the objects in the search                                                                                                                                       |
| `.asHashes(precision)` | returns an array of `{"id": string,"hash": string}`                                                                                                                                |
| `.asIds()`             | returns an array of ids                                                                                                                                                            |
| `.asPoints()`          | returns objects as points: `{"id": string,"point":{"lat": number,"lon": number}`. If the searched key is a collection of `Polygon` objects, the returned points are the centroids. |

#### Search

Used to iterate through a keys string values.

```typescript
await tile38.set('fleet', 'truck1:driver').string('John').exec();

await tile38.search('fleet').match('J*').asStringObjects();
> {"ok":true,"objects":[{"id":"truck1:driver","object":"John"}],"count":1,"cursor":0,"elapsed":"59.9µs"}
```

**Options**

| command                                   | description                                                                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.asc()`                                  | Values are returned in ascending order. Default if not set.                                                                                                                                 |
| `.desc()`                                 | Values are returned in descending order.                                                                                                                                                    |
| `.cursor(value?)`                         | used to iterate through your search results. Defaults to `0` if not set explicitly                                                                                                          |
| `.limit(value?)`                          | limit the number of returned objects. Defaults to `100` if not set explicitly                                                                                                               |
| `.noFields()`                             | if not set and one of the objects in the key has fields attached, fields will be returned. Use this to suppress this behavior and don't return fields.                                      |
| `.match(pattern?)`                        | Match can be used to filtered objects considered in the search with a glob pattern. `.match('J*')` e.g. will only consider string values objects that have a string value starting with `J` |
| `.where(fieldname, min value, max value)` | filter output by fieldname and values.                                                                                                                                                      |
| `.wherein(fieldname, values)`             | filter output by fieldname and values. Returns if field value in list of values.                                                                                                            |
| `.whereExpr(expr)`                        | filter output with [filter-expression](https://tile38.com/topics/filter-expressions).                                                                                                       |

**Outputs**

| command              | description                                  |
| -------------------- | -------------------------------------------- |
| `.asStringObjects()` | return as array of objects                   |
| `.asCount()`         | returns a count of the objects in the search |
| `.asIds()`           | returns an array of ids                      |

### Server / Connection

#### CONFIG GET / REWRITE / SET

While `.configGet()` fetches the requested configuration, `.configSet()` can be used to change the configuration.

**Important**, changes made with `.set()` will only take affect after `.configRewrite()` is used.

**Options**

| command          | description                                                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `requirepass`    | Set a password and make server password-protected, if not set defaults to `""` (no password required).                                                               |
| `leaderauth`     | If leader is password-protected, followers have to authenticate before they are allowed to follow. Set `leaderauth` to password of the leader, prior to `.follow()`. |
| `protected-mode` | Tile38 only allows authenticated clients or connections from `localhost`. Defaults to: `"yes"`                                                                       |
| `maxmemory`      | Set max memory in bytes. Get max memory in bytes/kb/mb/gb.                                                                                                           |
| `autogc`         | Set auto garbage collection to time in seconds where server performs a garbage collection. Defaults to: `0` (no garbage collection)                                  |
| `keep_alive`     | Time server keeps client connections alive. Defaults to: `300` (seconds)                                                                                             |

```typescript
await tile38.configGet('keepalive');
> {"ok":true,"properties":{"keepalive":"300"},"elapsed":"54.6µs"}

await tile38.configSet('keepalive', 400);
> {"ok":true,"elapsed":"36.9µs"}

await tile38.configRewrite();
> {"ok":true,"elapsed":"363µs"}

await tile38.configGet('keepalive');
> {"ok":true,"properties":{"keepalive":"400"},"elapsed":"33.8µs"}
```

**Advanced options**
Advanced configuration can not be set with commands, but has to be set in a `config` file in your data directory. **Options** above, as well as advanced options can be set and are loaded on start-up.

| command       | description                       |
| ------------- | --------------------------------- |
| `follow_host` | URI of Leader to follow           |
| `follow_port` | PORT of Leader to follow          |
| `follow_pos`  | ?                                 |
| `follow_id`   | ID of Leader                      |
| `server_id`   | Server ID of the current instance |
| `read_only`   | Make Tile38 read-only             |

#### FLUSHDB

Delete all keys and hooks.

```typescript
await tile38.flushDb();
```

#### GC

Instructs the server to perform a garbage collection.

```typescript
await tile38.gc();
```

#### READONLY

Sets Tile38 into read-only mode. Commands such as`.set()` and `.del()` will fail.

```typescript
await tile38.readOnly(true);
```

#### SERVER

Get Tile38 statistics. Can optionally be extended with `extended=true`.

```typescript
await tile38.server();

// extended
await tile38.server(true);
```

#### INFO

Get Tile38 statistics. Similar to `SERVER` but with different properties.

```
await tile38.info();
```

### Geofencing

> A [geofence](https://en.wikipedia.org/wiki/Geo-fence) is a virtual boundary that can detect when an object enters or exits the area. This boundary can be a radius or any [search area format](https://tile38.com/commands/intersects#area-formats), such as a [bounding box](https://tile38.com/topics/object-types#bounding-box), [GeoJSON](https://tile38.com/topics/object-types#geojson) object, etc. Tile38 can turn any standard search into a geofence monitor by adding the FENCE keyword to the search.

Geofence events can be:

-   `inside` (object in specified area),
-   `outside` (object outside specified area),
-   `enter` (object enters specified area),
-   `exit` (object exits specified area),
-   `crosses` (object that was not in specified area, has enter/exit it).

Geofence events can be send on upon commands:

-   `set` which sends an event when an object is `.set()`
-   `del` which sends a last event when the object that resides in the geosearch is deleted via `.del()`
-   `drop`which sends a message when the entire collection is dropped

#### SETHOOK

Creates a webhook that points to a geosearch (NEARBY/WITHIN/INTERSECTS). Whenever a commands creates/deletes/drops an object that fulfills the geosearch, an event is send to the specified `endpoint`.

```typescript
// sends event to endpoint, when object in 'fleet'
// enters the area of a 500m radius around
// latitude 33.5123 and longitude -112.2693
await tile38
    .setHook('warehouse', 'http://10.0.20.78/endpoint')
    .nearby('fleet')
    .point(33.5123, -112.2693, 500)
    .exec();
```

```typescript
await tile38.set('fleet', 'bus').point(33.5123001, -112.2693001).exec();
// event =
> {
  "command": "set",
  "group": "5c5203ccf5ec4e4f349fd038",
  "detect": "inside",
  "hook": "warehouse",
  "key": "fleet",
  "time": "2021-03-22T13:06:36.769273-07:00",
  "id": "bus",
  "meta": {},
  "object": { "type": "Point", "coordinates": [-112.2693001, 33.5123001] }
}
```

**Geosearch**

| command                       | description |
| ----------------------------- | ----------- |
| `.nearby(name, endpoint)`     |             |
| `.within(name, endpoint)`     |             |
| `.intersects(name, endpoint)` |             |

**Options**

| command                 | description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `.meta(meta)`           | Optional add additional meta information that are send in the geofence event.                           |
| `.ex(value)`            | Optional TTL in seconds                                                                                 |
| `.commands(...which[])` | Select on which command a hook should send an event. Defaults to: `['set', 'del', 'drop']`              |
| `.detect(...what[])`    | Select what events should be detected. Defaults to: `['enter', 'exit', 'crosses', 'inside', 'outside']` |

**Endpoints**

| endpoint   | description                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP/HTTPS | `http://` `https://` send messages over HTTP/S. For options see [link](https://tile38.com/commands/sethook#http--https).                       |
| gRPC       | `grpc://` send messages over [gRPC](http://www.grpc.io/). For options see [link](https://tile38.com/commands/sethook#grpc).                    |
| Redis      | `redis://` send messages to [Redis](https://redis.io/). For options see [link](https://tile38.com/commands/sethook#redis)                      |
| Disque     | `disque://` send messages to [Disque](https://github.com/antirez/disque). For options see [link](https://tile38.com/commands/sethook#disque).  |
| Kafka      | `kafka://` send messages to a [Kafka](https://kafka.apache.org/) topic. For options see [link](https://tile38.com/commands/sethook#kafka).     |
| AMQP       | `amqp://` send messages to [RabbitMQ](https://www.rabbitmq.com/). For options see [link](https://tile38.com/commands/sethook#amqp).            |
| MQTT       | `mqtt://` send messages to an MQTT broker. For options see [link](https://tile38.com/commands/sethook#mqtt).                                   |
| SQS        | `sqs://` send messages to an [Amazon SQS](https://aws.amazon.com/sqs/) queue. For options see [link](https://tile38.com/commands/sethook#sqs). |
| NATS       | `nats://` send messages to a [NATS](https://www.nats.io/) topic. For options see [link](https://tile38.com/commands/sethook#nats).             |

#### SETCHAN / SUBSCRIBE / PSUBSCRIBE

Similar to `setHook()`, but opens a PUB/SUB channel.

```typescript
// Start a channel that sends event, when object in 'fleet'
// enters the area of a 500m radius around
// latitude 33.5123 and longitude -112.2693
await tile38
    .setChan('warehouse')
    .nearby('fleet')
    .point(33.5123, -112.2693, 500)
    .exec();
```

Now add a receiving channel and add an event handler.

```typescript
const channel = await tile38.channel();
channel.on('message', (message) => console.log(message));
```

Now that channel can:

```typescript
// be subscribed to
await channel.subscribe('warehouse');
// or pattern subscribed to
await channel.pSubscribe('ware*');
```

Every set `.set()` results in:

```typescript
await tile38.set('fleet', 'bus').point(33.5123001, -112.2693001).exec();
// event =
> {
  "command": "set",
  "group": "5c5203ccf5ec4e4f349fd038",
  "detect": "inside",
  "hook": "warehouse",
  "key": "fleet",
  "time": "2021-03-22T13:06:36.769273-07:00",
  "id": "bus",
  "meta": {},
  "object": { "type": "Point", "coordinates": [-112.2693001, 33.5123001] }
}
```

```typescript
// to unsubscribed
await channel.unsubscribe();

// to delete
await tile38.delChan('warehouse');
// or pattern delete
await tile38.pDelChan('ware*');
```

**Geosearch**

| command             | description |
| ------------------- | ----------- |
| `.nearby(name)`     |             |
| `.within(name)`     |             |
| `.intersects(name)` |             |

**Options**

| coommand                | description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `.meta(meta)`           | Optional addition meta information that a send in the geofence event.                                   |
| `.ex(value)`            | Optional TTL in seconds                                                                                 |
| `.commands(...which[])` | Select on which command a hook should send an event. Defaults to: `['set', 'del', 'drop']`              |
| `.detect(...what[])`    | Select what events should be detected. Defaults to: `['enter', 'exit', 'crosses', 'inside', 'outside']` |

## Addition Information

For more information, please refer to:

-   [Tile38](https://tile38.com)

## Roadmap

See the [open issues](https://github.com/iwpnd/tile38-ts/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/amazing-feature`)
3. Commit your Changes (`git commit -m 'fix: add some amazing feature'`)
4. Push to the Branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Maintainer

Vincent Priem - [@vpriem](https://github.com/vpriem)  
Benjamin Ramser - [@iwpnd](https://github.com/iwpnd)

Project Link: [https://github.com/iwpnd/tile38-ts](https://github.com/iwpnd/tile38-ts)

## Acknowledgements

Josh Baker - maintainer of [Tile38](https://tile38.com)
