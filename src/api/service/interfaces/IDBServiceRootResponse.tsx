export default interface IDBServiceRootResponse<T> {
	message: string
	code: number
	data: T
}
