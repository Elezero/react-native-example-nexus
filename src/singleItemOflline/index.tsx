import React, {useEffect, useState} from 'react'
import {FlatList} from 'react-native'

// API
import backendService from '../api/service'
import {Note} from '../models/note'
import {AxiosResponse} from 'axios'
import {Text, TextInput, TouchableOpacity, View} from 'react-native'
import IDBCreateModifiedNoteData from '../api/service/interfaces/IDBCreateModifiedNoteData'

// import useNexusSync from 'react-native-nexus-sync'
import useNexusSync from '../hook/useNexusSync'
import IDBServiceRootResponse from '../api/service/interfaces/IDBServiceRootResponse'
import IDBGetNoteData from '../api/service/interfaces/IDBGetNoteData'

interface SingleItemOfflineProps {
	id: string
}

const SingleItemOffline: React.FC<SingleItemOfflineProps> = ({id}) => {
	const getItemFromServer = async (): Promise<Note[]> => {
		console.log(`GETTING NOTE | --------------`)
		try {
			const _notesResponse = (await backendService.post('/NoteGet.php', {
				id: id
			})) as AxiosResponse<IDBServiceRootResponse<IDBGetNoteData>>
			const _note = _notesResponse.data.data.note
			return [_note]
		} catch {
			;(err: any) => {
				console.log(`err 23R|=========>`, JSON.stringify(err))
			}
		}
		return []
	}

	const createItemToServer = async (noteToCreate: Note): Promise<Note> => {
		const noteCreatedResponse = (await backendService.post('/NoteCreate.php', {
			title: noteToCreate.title
		})) as AxiosResponse<IDBServiceRootResponse<IDBCreateModifiedNoteData>>
		return {
			id: noteCreatedResponse.data.data.i_id,
			title: noteToCreate.title,
			status: noteToCreate.status,
			modificationDate: noteCreatedResponse.data.data.i_modificationDate
		}
	}

	const updateItemToServer = async (noteToUpdate: Note): Promise<Note> => {
		const noteEditedResponse = (await backendService.post('/NoteUpdate.php', {
			id: noteToUpdate.id,
			title: noteToUpdate.title,
			note_status: noteToUpdate.status
		})) as AxiosResponse<IDBServiceRootResponse<IDBCreateModifiedNoteData>>
		return {
			id: noteEditedResponse.data.data.i_id,
			title: noteToUpdate.title,
			status: noteToUpdate.status,
			modificationDate: noteEditedResponse.data.data.i_modificationDate
		}
	}

	const deleteItemToServer = async (noteToDelete: string): Promise<string> => {
		const noteEditedResponse = (await backendService.post('/NoteDelete.php', {
			id: noteToDelete
		})) as AxiosResponse<IDBServiceRootResponse<IDBCreateModifiedNoteData>>
		return noteToDelete
	}

	const {
		data: notes,
		isLoading,
		isOnline,
		backOnLine,
		refreshData,
		saveItem,
		updateItem,
		deleteItem
	} = useNexusSync<Note>({
		async_DATA_KEY: 'NOTE_ID_' + id,
		idAttributeName: 'id',
		modificationDateAttributeName: 'modificationDate',
		onBackOnline: () => {
			console.log(`BACK ON LINE | --------------`)
		},
		autoRefreshOnBackOnline: true,
		remoteMethods: {
			GET: getItemFromServer,
			CREATE: createItemToServer,
			UPDATE: updateItemToServer,
			DELETE: deleteItemToServer
		}
	})

	const [createEditModalVisible, setCreateEditModalVisible] = useState(false)
	const [workingNote, setWorkingNote] = useState<Note>({
		id: '0',
		title: '',
		status: 0,
		modificationDate: ''
	})
	const [note, setNote] = useState<Note | undefined>()

	useEffect(() => {
		if (notes.length > 0) {
			setNote(notes[0])
		}
	}, [notes])

	return (
		<View style={{flex: 1}}>
			{!isOnline && (
				<View style={{backgroundColor: 'red'}}>
					<Text style={{alignContent: 'center', textAlign: 'center'}}>
						Offline mode
					</Text>
				</View>
			)}
			{isOnline && backOnLine && (
				<TouchableOpacity
					style={{
						backgroundColor: '#fbff00',
						padding: 20,
						marginBottom: 20,
						marginHorizontal: 20,
						borderRadius: 20
					}}
					onPress={() => {
						refreshData()
					}}>
					<Text style={{color: 'black'}}>REFRESH</Text>
				</TouchableOpacity>
			)}

			<TouchableOpacity
				style={{backgroundColor: 'blue', padding: 20, marginBottom: 20}}
				onPress={() => {
					setWorkingNote({
						id: '0',
						title: '',
						status: 0,
						modificationDate: ''
					})
					setCreateEditModalVisible(true)
				}}>
				<Text>NEW NOTE</Text>
			</TouchableOpacity>

			{note && (
				<TouchableOpacity
					key={note.id}
					style={{
						backgroundColor: '#2c2c2c',
						padding: 20,
						borderBottomColor: 'red',
						borderBottomWidth: 1
					}}
					onPress={() => {
						setWorkingNote(note)
						setCreateEditModalVisible(true)
					}}
					onLongPress={() => {
						deleteItem(note)
					}}>
					<View style={{}}>
						<Text style={{color: 'orange'}}>ID: {note.id} </Text>
						<Text style={{color: 'orange'}}>TITLE: {note.title}</Text>
						<Text style={{color: 'orange'}}>STATUS: {note.status}</Text>
						<Text style={{color: 'orange'}}>
							MOD DATE: {note.modificationDate}
						</Text>
					</View>
				</TouchableOpacity>
			)}

			{createEditModalVisible && (
				<View
					style={{
						position: 'absolute',
						backgroundColor: '#ff00004b',
						width: '100%',
						height: '100%'
					}}>
					<View>
						<Text style={{color: 'white', fontSize: 20}}>
							{workingNote ? 'Edit' : 'New'}
						</Text>
						<TextInput
							value={workingNote?.title}
							onChangeText={(val: string) => {
								setWorkingNote({...workingNote, title: val})
							}}
							style={{
								backgroundColor: 'white',
								marginVertical: 10,
								color: 'black'
							}}></TextInput>
					</View>
					<TouchableOpacity
						style={{backgroundColor: 'red', padding: 20, marginVertical: 10}}
						onPress={() => {
							setCreateEditModalVisible(false)
						}}>
						<Text>Close</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: '#0084ff',
							padding: 20,
							marginVertical: 10
						}}
						onPress={() => {
							if (workingNote.id === '0') {
								saveItem && saveItem(workingNote)
							} else {
								updateItem && updateItem(workingNote)
							}

							setCreateEditModalVisible(false)
						}}>
						<Text>{workingNote.id === '0' ? 'CREATE' : 'UPDATE'}</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	)
}

export default SingleItemOffline
