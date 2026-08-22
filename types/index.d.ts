export type SearchParams = { [key: string]: string | string[] | undefined };

export type PageProps = { searchParams: Promise<SearchParams> };
