export interface Note {
	id: string
	title: string
	status: number // 0: ALIVE, 1: ARCHIVED, 2: DELETED
	modificationDate: string
}
