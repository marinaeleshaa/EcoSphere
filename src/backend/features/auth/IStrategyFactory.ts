export interface IStrategyFactory<T> {
	getStrategy(userType: string): T;
}
