import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

class QueryBuilder {}
async function main2() {
  const db = drizzle({ schema });
  const countries = await db
    .select()
    .from(schema.countries)
    .innerJoin(schema.cities, eq(schema.cities.countryId, schema.countries.id));

  const countries2 = await db.run(
    select(),
    from(schema.countries),
    innerJoin(schema.cities, eq(schema.cities.countryId, schema.countries.id)),
  )

  const countries3 = await db.run({
    select: select(),
    from: from(schema.countries),
    join: innerJoin(schema.cities, eq(schema.cities.countryId, schema.countries.id)),
  })
}

async function main() {
}

await main();
