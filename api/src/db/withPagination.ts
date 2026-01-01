import { PgSelect } from "drizzle-orm/pg-core";

export function withPagination<T extends PgSelect>(
	qb: T,
	start: number = 0,
	limit: number = 20,
) {
	return qb.offset(start).limit(limit);
}