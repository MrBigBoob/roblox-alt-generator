declare module 'username-generator';

declare module '@vedux/vedudb' {
	export default VeduDB;
}

declare class VeduDB {
	constructor(database: string);

	set(key: string, value: any): Promise<boolean>;

	fetch(key: string): Promise<any>;

	remove(key: string): Promise<boolean>;

	add(key: string, amount: number): Promise<boolean>;

	fetchAll(): Promise<any>;

	subtract(key: string, amount: number): Promise<boolean>;

	has(key: string): Promise<boolean>;

	filter(predicate: (entry: any, key: string) => boolean): any[];

	find(predicate: (entry: any, key: string) => boolean): any;

	findKey(predicate: (entry: any, key: string) => boolean): string;

	random(): any;

	count(): number;
}
